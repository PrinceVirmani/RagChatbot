'use client'

export const dynamic = "force-dynamic";

import { InputForm } from "@/app/_components/auth/InputForm";
import Image from "next/image";
import React, { useState } from "react";
import Footer from "@/app/_components/Footer";
import { useRouter } from "next/navigation";
import AuthDecorations from "@/app/_components/auth/AuthDecorations";
import { useAuth } from "@/app/_components/providers/AuthProvider";


const SigninPage = () => {
  const router = useRouter();
  const { login, isLoading, error: contextError, clearError } = useAuth();

  /* State for form inputs */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});


  /* Validate email format */
  const validateEmail = (emailValue: string): string => {
    if (!emailValue.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  /* Validate password field */
  const validatePassword = (passwordValue: string): string => {
    if (!passwordValue) {
      return 'Password is required';
    }
    return '';
  };

  /* Validate all form fields */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Error will be set by the login function in AuthProvider
    await login(email, password);
  };

  return (
      <div className="w-full min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Header with Logo and Close button */}
      <div className="w-full flex items-center justify-between px-6 py-4">
        <Image
          src="/authimages/Logo.svg"
          alt="Logo"
          width={28}
          height={28}
          priority
        />
        <button
          className="flex items-center justify-center cursor-pointer"
          style={{
            width: "21px",
            height: "21px",
            borderRadius: "6px",
            padding: "6px",
            background: "var(--bg-weak-50, #F7F7F7)",
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

      {/* Mobile header divider */}
      <div className="sm:hidden w-full border-b border-[#EBEBEB]" />

      <div className="w-full flex-1 flex justify-center px-4">
      <div className="w-full max-w-[450px] relative mt-4 sm:mt-[40px] mb-20">
        <AuthDecorations />
        <div className="flex flex-col justify-center items-center gap-[10px] w-full">
          <div
            className="flex items-center justify-center rounded-full bg-white border border-[#F5F5F5] mt-4 sm:mt-12"
            style={{
              width: "56px",
              height: "56px",
              padding: "12px",
              borderRadius: "96px",
            }}
          >
            <Image
              src="/authimages/signin.svg"
              alt="AI template icon"
              width={32}
              height={32}
              priority
            />
          </div>
          <div className="w-full h-[48px] flex flex-col justify-center items-center gap-[8px] mt-2">
            <h2
              className=" h-[24px]
                text-[20px]
                leading-[24px]
                tracking-[-0.015em]
                text-center
                align-middle text-[#171717]
              "
            >
              Sign in to your account
            </h2>
            <span
              className=" h-[20px]
                text-[14px]
                leading-[20px]
                tracking-[-0.006em]
                text-center
                align-middle text-[#A3A3A3]
              "
            >
              Enter your details to login.
            </span>
          </div>

          <button
            type="button"
            className="mt-4 flex h-[36px] w-full max-w-[370px] items-center justify-center gap-2 rounded-[10px] bg-[var(--bg-white-0)] text-[16px] font-medium text-[#171717] cursor-pointer"
            style={{
              boxShadow:
                "0px -1px 1px -0.5px var(--shadowgrayshadow-4) inset, 0px 0px 0px 1px var(--shadowgrayshadow-8), 0px 1px 1px -0.5px var(--shadowgrayshadow-4), 0px 3px 3px -1.5px var(--shadowgrayshadow-4), 0px 6px 6px -3px var(--shadowgrayshadow-4)",
              padding: "8px 12px",
            }}
          >
            <Image src="/authimages/Google.svg" alt="Google logo" width={20} height={20} priority />
            <span className="text-[#A3A3A3]">
              Sign in with <span className="text-[#5C5C5C]">Google</span>
            </span>
          </button>

          <form
            onSubmit={handleSubmit}
            className="mt-3 flex w-full max-w-[420px] flex-col"
            style={{
              gap: "20px",
              padding: "20px",
              borderRadius: "24px",
              background: "var(--bg-white-0)",
              boxShadow:
                "0px -1px 1px -0.5px var(--shadowgrayshadow-6) inset, 0px 0px 0px 1px var(--shadowgrayshadow-8), 0px 1px 1px -0.5px var(--shadowgrayshadow-4), 0px 3px 3px -1.5px var(--shadowgrayshadow-4), 0px 6px 6px -3px var(--shadowgrayshadow-4), 0px 10px 10px -5px var(--shadowgrayshadow-4), 0px 20px 20px -10px var(--shadowgrayshadow-4)",
            }}
          >
            {/* Email Input */}
            <InputForm
              label="Email Address"
              type="email"
              required
              placeholder="hello@alignui.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
                if (contextError) {
                  clearError();
                }
              }}
              error={errors.email}
              className="h-[40px] bg-white rounded-[12px] border-none shadow-[0px_0px_0px_1px_var(--shadowgrayshadow-8),0px_1px_1px_-0.5px_var(--shadowgrayshadow-4),0px_3px_3px_-1.5px_var(--shadowgrayshadow-4)]"
              leftIcon={
                <Image
                  src="/icons/mail-fill.svg"
                  alt="email icon"
                  width={22}
                  height={22}
                  className="opacity-25"
                />
              }
            />

            {/* Password Input */}
            <InputForm
              label="Password"
              type="password"
              required
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
                if (contextError) {
                  clearError();
                }
              }}
              error={errors.password}
              className="h-[40px] bg-white rounded-[12px] border-none shadow-[0px_0px_0px_1px_var(--shadowgrayshadow-8),0px_1px_1px_-0.5px_var(--shadowgrayshadow-4),0px_3px_3px_-1.5px_var(--shadowgrayshadow-4)]"
              leftIcon={
                <Image
                  src="/icons/Lock-fill.svg"
                  alt="lock icon"
                  width={18}
                  height={18}
                  className="opacity-25"
                />
              }
              rightIconToggle
            />

            {/* Remember + forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#5C5C5C]">
                <span className="relative inline-flex h-4 w-4">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer h-4 w-4 appearance-none rounded-sm border border-gray-200 bg-white shadow-[0_2px_4px_rgba(15,23,42,0.08)] cursor-pointer transition"
                  />
                  <svg
                    viewBox="0 0 16 16"
                    className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-[#1DAF61] opacity-0 peer-checked:opacity-100"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5L6.5 12L13 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-[14px] leading-5  tracking-[-0.006em] text-[#5C5C5C]">
                  Keep me logged in
                </span>
              </label>
              <button
                type="button"
                onClick={() => router.push("/auth/reset-password")}
                className="text-gray-400 hover:underline underline-offset-2 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* API Error Message */}
            {contextError && (
              <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-[13px]">{contextError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[36px] mb-1 bg-[#1DAF61] hover:bg-[#46A580] disabled:bg-gray-400 disabled:cursor-not-allowed text-[#FFFFFF] rounded-[10px] font-medium text-[14px] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-2 text-center text-[14px] text-[#A3A3A3]">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/auth/signup")}
              className="text-[#5C5C5C] font-medium underline cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
      </div>
  );
};

export default SigninPage;
