"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { signInWithCustomToken } from "firebase/auth";

type ViewState = "login" | "forgot-email" | "forgot-otp" | "forgot-reset";

const LoginForm = () => {
  const [view, setView] = useState<ViewState>("login");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotRole, setForgotRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ngo");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login, auth } = useAuth();

  // --- Handlers ---

  const handleForgotSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setForgotRole(data.role || "user");
      setView("forgot-otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotVerify = async (action: "login" | "reset") => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: forgotOtp,
          action,
          userType: forgotRole,
          newPassword: action === "reset" ? newPassword : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");

      if (action === "login") {
        if (auth && data.customToken) {
          await signInWithCustomToken(auth, data.customToken);
          router.push("/");
        } else {
          throw new Error("Authentication failed client-side.");
        }
      } else if (action === "reset") {
        setView("login");
        setError("Password reset successfully. Please login with your new password.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (view === "login") {
      setLoading(true);
      try {
        const result = await login({ email, password, role });
        if (result.requiresOtp) {
          router.push(
            `/verify-otp?email=${encodeURIComponent(result.email || email)}&role=${encodeURIComponent(result.role || role)}&context=login`
          );
        } else if (result.success) {
          router.push("/");
        } else {
          setError(result.message || "Login failed. Please try again.");
        }
      } catch (err) {
        console.error("Login form submission error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    } else if (view === "forgot-email") {
      handleForgotSendOtp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 transition-colors duration-300">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">HelpChain</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transparent donations, trusted impact
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {view === "login" && "Welcome Back"}
              {view === "forgot-email" && "Reset Password"}
              {view === "forgot-otp" && "Verify OTP"}
              {view === "forgot-reset" && "Create New Password"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {view === "login" && "Login to continue making a difference"}
              {view === "forgot-email" && "Enter your email to receive an OTP"}
              {view === "forgot-otp" && "Enter the OTP sent to your email"}
              {view === "forgot-reset" && "Set a new secure password"}
            </p>
          </div>

          {/* Unified Form Wrapper */}
          <form onSubmit={handleMainSubmit} className="space-y-5" noValidate>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* LOGIN VIEW */}
            {view === "login" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-lg"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Select Role</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="ngo">NGO</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg h-11"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => { setView("forgot-email"); setError(""); }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/signup")}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD: EMAIL INPUT */}
            {view === "forgot-email" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg h-11"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => { setView("login"); setError(""); }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD: OTP VERIFY */}
            {view === "forgot-otp" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="forgot-otp">Enter OTP</Label>
                  <Input
                    id="forgot-otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    required
                    className="rounded-lg text-center tracking-widest text-lg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleForgotVerify("login")}
                    disabled={loading || forgotOtp.length < 6}
                    className="w-full h-11"
                  >
                    {loading ? "Verifying..." : "Login Directly"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setView("forgot-reset")}
                    disabled={forgotOtp.length < 6}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg h-11"
                  >
                    Reset Password
                  </Button>
                </div>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => { setView("login"); setError(""); }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD: NEW PASSWORD */}
            {view === "forgot-reset" && (
              <div className="space-y-5">
                <div className="space-y-2 relative">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <Button
                  type="button"
                  onClick={() => handleForgotVerify("reset")}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg h-11"
                  disabled={loading || newPassword.length < 6}
                >
                  {loading ? "Resetting..." : "Save New Password"}
                </Button>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => { setView("login"); setError(""); }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Side Illustration/Placeholder */}
        <div className="hidden md:block">
          <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-200 h-64 flex items-center justify-center">
            <span className="text-gray-400">Illustration Placeholder</span>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Building Trust Through Transparency
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track every donation and see the real impact of your generosity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;