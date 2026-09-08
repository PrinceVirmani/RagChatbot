"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/app/_components/Footer";
import AuthDecorations from "@/app/_components/auth/AuthDecorations";
import { InputForm } from "@/app/_components/auth/InputForm";
import { authApi } from "@/app/lib/authApi";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: Array<{ msg: string }> | string;
}

const ResetPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const validateEmail = (emailValue: string): string => {
    if (!emailValue.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      // Navigate to verify-email page with email as query param
      router.push(`/auth/reset-password/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      let errorMessage = "Failed to send reset code. Please try again.";

      if (axiosError.response?.status === 422) {
        const detail = axiosError.response.data?.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail[0].msg || "Validation failed.";
        }
      } else if (axiosError.response?.status === 404) {
        errorMessage = "Email not found. Please check your email address.";
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
              Reset your password
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
              Enter your email to reset your password
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
            {/* Email Address */}
            <div className="flex flex-col gap-[4px]">
              <InputForm
                label="Email Address"
                required
                placeholder="hello@alignui.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="h-[40px] bg-white rounded-[12px] border-none shadow-[0px_0px_0px_1px_var(--shadowgrayshadow-8),0px_1px_1px_-0.5px_var(--shadowgrayshadow-4),0px_3px_3px_-1.5px_var(--shadowgrayshadow-4)]"
                leftIcon={
                  <Image src="/icons/mail-fill.svg" alt="mail" width={22} height={22} className="opacity-25" />
                }
              />
              <div className="flex items-center gap-2 text-[#A3A3A3] text-[12px] mt-1">
                <Image src="/icons/Caution.svg" alt="caution" width={16} height={16} />
                <span>Enter the email with which you've registered.</span>
              </div>
            </div>

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
                  Sending code...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-2 flex flex-col items-center gap-2 text-center">
            <p className="text-[14px] leading-[20px] text-[#A3A3A3]">
              Don't have access anymore?
            </p>
            <a href="#" className="text-[14px] font-medium text-[#5C5C5C] underline decoration-1 underline-offset-2">
              Try another method
            </a>
          </div>

        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
