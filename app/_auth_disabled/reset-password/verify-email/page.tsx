"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/app/_components/Footer";
import AuthDecorations from "@/app/_components/auth/AuthDecorations";
import { authApi } from "@/app/lib/authApi";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: Array<{ msg: string }> | string;
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.replace("/auth/reset-password");
    }
  }, [email, router]);

  // Focus functionality
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Allow only single digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Clear error when typing
    if (error) setError(null);

    // Focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Only numbers

    const digits = pastedData.split("");
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus appropriate input
    const nextFocusIndex = Math.min(digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    setError(null);

    try {
      await authApi.forgotPassword(email);
      setTimer(60);
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      let errorMessage = "Failed to resend code. Please try again.";

      if (!axiosError.response) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Handle verify OTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      setError("Email not found. Please start over.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.verifyOtp(email, otpString);
      // Navigate to set-password page with email and reset_token
      router.push(
        `/auth/reset-password/set-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(response.reset_token)}`
      );
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      let errorMessage = "Invalid or expired code. Please try again.";

      if (axiosError.response?.status === 422) {
        const detail = axiosError.response.data?.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail[0].msg || "Validation failed.";
        }
      } else if (axiosError.response?.status === 400) {
        errorMessage = "Invalid or expired code. Please try again.";
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

  // Mask email for display
  const maskEmail = (emailStr: string) => {
    if (!emailStr) return "";
    const [local, domain] = emailStr.split("@");
    if (!domain) return emailStr;
    const maskedLocal = local.length > 2
      ? local[0] + "***" + local[local.length - 1]
      : local;
    return `${maskedLocal}@${domain}`;
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
          <div className="flex flex-col justify-center items-center gap-[24px] w-full">

            {/* Header Section */}
            <div className="flex flex-col items-center gap-4 mt-4 sm:mt-22">
              <div
                className="flex items-center justify-center rounded-full bg-white border border-[#F5F5F5]"
                style={{
                  width: "56px",
                  height: "56px",
                  padding: "12px",
                  borderRadius: "96px",
                }}
              >
                <Image src="/authimages/Verifymail.svg" alt="mail" width={32} height={32} />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-[20px] leading-[24px] tracking-[-0.015em] text-[#171717]">
                  Verify your email
                </h2>
                <p className="text-[14px] leading-[20px] tracking-[-0.006em] text-[#A3A3A3]">
                  We've sent a 6-digit code to <span className="text-[#171717]">{maskEmail(email)}</span>
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form
              onSubmit={handleVerify}
              className="flex w-full max-w-[420px] flex-col sm:order-none order-1"
              style={{
                gap: "24px",
                padding: "24px",
                borderRadius: "24px",
                background: "var(--bg-white-0)",
                boxShadow:
                  "0px -1px 1px -0.5px var(--shadowgrayshadow-6) inset, 0px 0px 0px 1px var(--shadowgrayshadow-8), 0px 1px 1px -0.5px var(--shadowgrayshadow-4), 0px 3px 3px -1.5px var(--shadowgrayshadow-4), 0px 6px 6px -3px var(--shadowgrayshadow-4), 0px 10px 10px -5px var(--shadowgrayshadow-4), 0px 20px 20px -10px var(--shadowgrayshadow-4)",
              }}
            >
              {/* Timer / Resend - shown at top on mobile */}
              <div className="flex sm:hidden items-center justify-center gap-2 text-[14px] leading-[20px] text-[#A3A3A3]">
                <span>Didn't receive the code?</span>
                {timer > 0 ? (
                  <span className="font-medium text-[#5C5C5C]">{timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-medium text-[#171717] hover:underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend"}
                  </button>
                )}
              </div>

              {/* OTP Grid */}
              <div className="flex items-center justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-9 h-9 md:w-12 md:h-12 text-center text-[18px] font-medium text-[#171717] rounded-xl border ${
                      error ? "border-red-500" : "border-[#E5E5E5]"
                    } focus:outline-none focus:border-[#1DAF61] focus:ring-1 focus:ring-[#1DAF61] transition-all bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-[13px]">{error}</p>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[40px] bg-[#1DAF61] hover:bg-[#46A580] disabled:bg-gray-400 disabled:cursor-not-allowed text-[#FFFFFF] rounded-xl font-medium text-[14px] transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>

              {/* Timer / Resend - shown at bottom on desktop */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-1 text-[14px] leading-[20px] text-[#A3A3A3]">
                <span>Didn't receive the code?</span>
                {timer > 0 ? (
                  <span className="font-medium text-[#5C5C5C]">{timer} seconds</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-medium text-[#171717] hover:underline disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend"}
                  </button>
                )}
              </div>
            </form>

            {/* Footer Links - hidden on mobile, shown on desktop */}
            <div className="hidden sm:flex flex-col items-center gap-2 text-center">
              <p className="text-[14px] leading-[20px] text-[#A3A3A3]">
                Check your spam folder or try resending the code
              </p>
              <button
                onClick={() => router.push("/auth/reset-password")}
                className="text-[14px] text-[#5C5C5C] underline decoration-1 underline-offset-2"
              >
                Try a different email
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Footer Links - shown at bottom on mobile */}
      <div className="sm:hidden flex flex-col items-center gap-2 text-center py-4 mb-12 mt-auto border-t border-[#E5E5E5]">
        <p className="text-[14px] leading-[20px] text-[#A3A3A3]">
          Check your spam folder or try resending the code
        </p>
        <button
          onClick={() => router.push("/auth/reset-password")}
          className="text-[14px] text-[#5C5C5C] underline decoration-1 underline-offset-2"
        >
          Try a different email
        </button>
      </div>

      <Footer />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
const VerifyEmail = () => {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-white" />}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;
