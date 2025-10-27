"use client"

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Call the login function from the AuthContext
      const result = await login({ email, password });
      if (result.success) {
        console.log("Login successful. Setting redirect flag.");
        router.push("/");
      } 
    } catch (error) {
      console.error('Login form submission error:', error);
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 transition-colors duration-300">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white">TransparentAid</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transparent donations, trusted impact</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400">Login to continue making a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
              <Label>Login as</Label>
              <RadioGroup value={role} onValueChange={setRole}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer">User / Donor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ngo" id="ngo" />
                  <Label htmlFor="ngo" className="cursor-pointer">NGO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-lg h-11"
            >
              Login
            </Button>

            <div className="text-center mt-2">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={()=>router.push("/signup")}
                className="text-blue-600 hover:text-blue-700"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            {/* <ImageWithFallback
              src="https://images.unsplash.com/photo-1710093072215-65070f9cf93e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZG9uYXRpb24lMjBjb21tdW5pdHl8ZW58MXx8fHwxNzYwODU4MzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Community helping hands"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            /> */}
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-gray-900 dark:text-white mb-2">Building Trust Through Transparency</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track every donation and see the real impact of your generosity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm