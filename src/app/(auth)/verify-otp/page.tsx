"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { useAuth } from "@/app/components/AuthContext";
import { Heart, Mail, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";

// Inner component that safely uses useSearchParams (must be wrapped in Suspense)
function OtpVerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth } = useAuth();

  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "user";
  const context = searchParams.get("context") || "signup"; // "signup" | "login"

  // 6 individual digit inputs
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const userType = role === "ngo" ? "ngo" : "user";

  const handleDigitChange = (index: number, value: string) => {
    // Allow only a single digit (handle paste too)
    const sanitized = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = sanitized;
    setDigits(next);
    setError("");

    // Auto-advance to next input
    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setDigits(next);
    // Focus the last filled or the next empty
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email,
        otp,
        userType,
      });

      if (response.data.customToken && auth) {
        setSuccess(true);
        await signInWithCustomToken(auth, response.data.customToken);
        setTimeout(() => router.push("/"), 1200);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResending(true);
    setError("");

    try {
      await axios.post("/api/auth/send-otp", { email });
      setResendTimer(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-800">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white leading-tight">TransparentAid</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Transparent donations, trusted impact</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Verify your email
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              We sent a 6-digit code to
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm text-center mt-1 break-all">
              {email}
            </p>
            {context === "login" && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                Your account needs to be verified before signing in.
              </p>
            )}
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">Email Verified!</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting you now…</p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP digit inputs */}
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`
                      w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none
                      bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                      ${digit
                        ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                      }
                      focus:border-blue-500 dark:focus:border-blue-400 focus:bg-blue-50 dark:focus:bg-blue-900/20
                      ${error ? "border-red-400 dark:border-red-500" : ""}
                    `}
                    aria-label={`OTP digit ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">{error}</p>
                </div>
              )}

              {/* Verify button */}
              <button
                type="submit"
                disabled={loading || digits.join("").length < 6}
                className="
                  w-full h-12 rounded-xl font-semibold text-white transition-all duration-200
                  bg-gradient-to-r from-blue-600 to-teal-600
                  hover:from-blue-700 hover:to-teal-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg
                  flex items-center justify-center gap-2
                "
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              {/* Resend section */}
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Didn&apos;t receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || resending}
                  className={`
                    text-sm font-medium flex items-center gap-1.5 mx-auto transition-colors
                    ${resendTimer > 0
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                    }
                  `}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : resending
                    ? "Sending…"
                    : "Resend OTP"
                  }
                </button>
              </div>

              {/* Back to login */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1.5 mx-auto transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
          This code expires in 5 minutes. Do not share it with anyone.
        </p>
      </div>
    </div>
  );
}

// Page wrapper — Suspense required because useSearchParams must be inside it
export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OtpVerifyInner />
    </Suspense>
  );
}
