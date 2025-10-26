"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
// import { ImageWithFallback } from "./figma/ImageWithFallback";




const SignUpForm = () => {

  const { signUp } = useAuth(); 

  const router=useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    acceptedTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkPasswordStrength = (password: string) => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      setPasswordStrength("Strong");
    } else if (password.length >= 6) {
      setPasswordStrength("Moderate");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.acceptedTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const { email, name, password } = formData;
    setLoading(true);

     try {
      // Call the signUp function from AuthContext (which now handles the API and client sign-in)
      const result = await signUp({ email, username:name, password });
      if (result.success) {
        // Successful sign-up and Firebase sign-in
        router.push('/'); // Redirect to the homepage or dashboard
      } else {
        // Handle server/API errors returned by signUp
      }
    } catch (err) {
      // Handle unexpected client-side errors
      console.error("Sign-up process failed:", err);
    } finally {
    }
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden md:block">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            {/* <ImageWithFallback
              src="https://images.unsplash.com/photo-1554136369-724d2c41d883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWxwaW5nJTIwaGFuZHMlMjBjaGFyaXR5fGVufDF8fHx8MTc2MDgwMzM1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Helping hands"
              className="w-full h-full object-cover"
            /> */}
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-gray-900 dark:text-white mb-2">Join Our Community</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Together we can make a lasting impact on communities worldwide
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 transition-colors duration-300">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white">TransparentAid</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start making a difference today
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join us in transforming lives through transparency
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && <p className="text-red-600 font-semibold">{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  checkPasswordStrength(e.target.value);
                }}
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
              {formData.password && (
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Moderate"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                className="rounded-lg"
              />
              {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                <p className="text-red-600 text-sm mt-1">Passwords do not match!</p>
              )}
            </div>

            <div className="space-y-2 text-white">
              <Label>Register as</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value:string) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="signup-user" />
                  <Label htmlFor="signup-user" className="cursor-pointer">
                    User / Donor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ngo" id="signup-ngo" />
                  <Label htmlFor="signup-ngo" className="cursor-pointer">
                    NGO
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="signup-admin" />
                  <Label htmlFor="signup-admin" className="cursor-pointer">
                    Admin
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptedTerms}
                onChange={() =>
                  setFormData({ ...formData, acceptedTerms: !formData.acceptedTerms })
                }
                required
                className="rounded checked:bg-blue-600"
              />
              <Label htmlFor="terms" className="select-none cursor-pointer text-sm">
                I accept the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg h-11"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={()=>router.push("/login")}
                className="text-blue-600 hover:text-blue-700"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default SignUpForm
