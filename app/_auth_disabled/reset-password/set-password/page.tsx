"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/app/_components/Footer";
import AuthDecorations from "@/app/_components/auth/AuthDecorations";
import { InputForm } from "@/app/_components/auth/InputForm";
import { authApi } from "@/app/lib/authApi";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: Array<{ msg: string }> | string;
}

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no email or token
  useEffect(() => {
    if (!email || !token) {
      router.replace("/auth/reset-password");
    }
  }, [email, token, router]);

  // Password validation rules
  const validatePassword = (pwd: string): string => {
    if (!pwd) {
      return "Password is required";
    }
    if (pwd.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  // Check if passwords match
  const validateConfirmPassword = (pwd: string, confirmPwd: string): string => {
    if (!confirmPwd) {
      return "Please confirm your password";
    }
    if (pwd !== confirmPwd) {
      return "Passwords do not match";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate confirm password
    const confirmError = validateConfirmPassword(password, confirmPassword);
    if (confirmError) {
      setError(confirmError);
      return;
    }

    if (!email || !token) {
      setError("Missing required information. Please start over.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authApi.resetPassword(email, token, password);
      // Navigate to signin page with success message
      router.push("/auth/signin?reset=success");
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      let errorMessage = "Failed to reset password. Please try again.";

      if (axiosError.response?.status === 422) {
        const detail = axiosError.response.data?.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail[0].msg || "Validation failed.";
        }
      } else if (axiosError.response?.status === 400) {
        errorMessage = "Invalid or expired reset token. Please start over.";
      } else if (axiosError.response?.status === 404) {
        errorMessage = "Email not found. Please start over.";
      } else if (!axiosError.response) {
        errorMessage = "Network error. Please check your connection.";
      } else if (axiosError.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Header with Logo, Changed your mind text, and Close button */}
      <div className="w-full flex items-center justify-between px-6 py-4">
        <Image
          src="/authimages/Logo.svg"
          alt="Logo"
          width={28}
          height={28}
          priority
        />
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline text-[14px] leading-[20px] tracking-[-0.006em] text-[#A3A3A3]">
            Changed your mind?{" "}
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-[#525252] cursor-pointer"
            >
              Sign in
            </button>
          </span>
          <button
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: "21px",
              height: "21px",
              borderRadius: "6px",
              padding: "6px",
            }}
            onClick={() => router.back()}
          >
            <Image
              src="/authimages/cross.svg"
              alt="Close"
              width={14}
              height={14}
            />
          </button>
        </div>
      </div>

      {/* Mobile header divider */}
      <div className="sm:hidden w-full border-b border-[#EBEBEB]" />

      <div className="w-full flex-1 flex justify-center px-4">
        <div className="w-full max-w-[450px] relative mt-4 sm:mt-[40px] mb-20">
          <AuthDecorations />
          <div className="flex flex-col justify-center items-center gap-[10px] w-full">

            {/* Header Section */}
            <div
              className="flex items-center justify-center rounded-full bg-white border border-[#F5F5F5] mt-4 sm:mt-22"
              style={{
                width: "56px",
                height: "56px",
                padding: "12px",
                borderRadius: "96px",
              }}
            >
              <Image src="/authimages/lock.svg" alt="lock" width={24} height={24} />
            </div>
            <div className="w-full h-[48px] flex flex-col justify-center items-center gap-[8px]">
              <h2
                className="h-[24px]
                  text-[20px]
                  leading-[24px]
                  tracking-[-0.015em]
                  text-center
                  align-middle text-[#171717]
                "
              >
                Set new password
              </h2>
              <span
                className="h-[20px]
                  text-[14px]
                  leading-[20px]
                  tracking-[-0.006em]
                  text-center
                  align-middle text-[#A3A3A3]
                "
              >
                Create a strong password for your account
              </span>
            </div>

            {/* Form Section */}
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex w-full max-w-[420px] flex-col"
              style={{
                gap: "20px",
                padding: "20px",
                borderRadius: "24px",
                background: "var(--bg-white-0)",
                boxShadow:
                  "0px -1px 1px -0.5px var(--shadowgrayshadow-6) inset, 0px 0px 0px 1px var(--shadowgrayshadow-8), 0px 1px 1px -0.5px var(--shadowgrayshadow-4), 0px 3px 3px -1.5px var(--shadowgrayshadow-4), 0px 6px 6px -3px var(--shadowgrayshadow-4), 0px 10px 10px -5px var(--shadowgrayshadow-4), 0px 20px 20px -10px var(--shadowgrayshadow-4)",
              }}
            >
              {/* New Password */}
              <InputForm
                label="New Password"
                required
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                rightIconToggle
                className="h-[40px] bg-white rounded-[12px] border-none shadow-[0px_0px_0px_1px_var(--shadowgrayshadow-8),0px_1px_1px_-0.5px_var(--shadowgrayshadow-4),0px_3px_3px_-1.5px_var(--shadowgrayshadow-4)]"
                leftIcon={
                  <Image src="/icons/Lock-fill.svg" alt="lock icon" width={18} height={18} className="opacity-25" />
                }
              />

              {/* Helper Text */}
              <div className="flex items-center gap-2 text-[#A3A3A3] text-[12px] -mt-2">
                <Image src="/icons/warn.svg" alt="Warning" width={14} height={14} />
                <span>8+ characters, 1 uppercase, 1 number</span>
              </div>

              {/* Confirm Password */}
              <InputForm
                label="Confirm Password"
                required
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                rightIconToggle
                className="h-[40px] bg-white rounded-[12px] border-none shadow-[0px_0px_0px_1px_var(--shadowgrayshadow-8),0px_1px_1px_-0.5px_var(--shadowgrayshadow-4),0px_3px_3px_-1.5px_var(--shadowgrayshadow-4)]"
                leftIcon={
                  <Image src="/icons/Lock-fill.svg" alt="lock icon" width={18} height={18} className="opacity-25" />
                }
              />

              {/* Match indicator */}
              {confirmPassword && (
                <div className="flex items-center gap-2 -mt-2">
                  {password === confirmPassword ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16ZM7.2 11.2L12.8 5.6L11.6 4.4L7.2 8.8L5.2 6.8L4 8L7.2 11.2Z" fill="#10B981"/>
                      </svg>
                      <span className="text-[12px] text-[#10B981]">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16ZM7.2 10.4H8.8V12H7.2V10.4ZM7.2 4H8.8V8.8H7.2V4Z" fill="#EF4444"/>
                      </svg>
                      <span className="text-[12px] text-[#EF4444]">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-[13px]">{error}</p>
                </div>
              )}

              {/* Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[40px] bg-[#1DAF61] hover:bg-[#46A580] disabled:bg-gray-400 disabled:cursor-not-allowed text-[#FFFFFF] rounded-[12px] font-medium text-[14px] transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-2 flex flex-col items-center gap-2 text-center">
              <p className="text-[14px] leading-[20px] text-[#A3A3A3]">
                Having trouble?
              </p>
              <button
                onClick={() => router.push("/auth/reset-password")}
                className="text-[14px] font-medium text-[#5C5C5C] underline decoration-1 underline-offset-2"
              >
                Start over
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
const SetPassword = () => {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-white" />}>
      <SetPasswordContent />
    </Suspense>
  );
};

export default SetPassword;
