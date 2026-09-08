'use client'

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/app/_components/Footer";
import AuthDecorations from "@/app/_components/auth/AuthDecorations";
import { InputForm } from "@/app/_components/auth/InputForm";
import { useAuth } from "@/app/_components/providers/AuthProvider";


const SignupPage = () => {
  const router = useRouter();
  const { register, isLoading, error: contextError, clearError } = useAuth();

  /* State for form inputs */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

  /* Validate full name */
  const validateFullName = (nameValue: string): string => {
    if (!nameValue.trim()) {
      return 'Full name is required';
    }
    return '';
  };

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

  /* Validate password strength */
  const validatePassword = (passwordValue: string): string => {
    if (!passwordValue) {
      return 'Password is required';
    }
    if (passwordValue.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(passwordValue)) {
      return 'Password must contain at least 1 uppercase letter';
    }
    if (!/[0-9]/.test(passwordValue)) {
      return 'Password must contain at least 1 number';
    }
    return '';
  };

  /* Validate all form fields */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const fullNameError = validateFullName(fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

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

    // Error will be set by the register function in AuthProvider
    await register(email, password, fullName);
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
            className="flex items-center justify-center rounded-full bg-white border border-[#F5F5F5] mt-2 sm:mt-6"
            style={{
              width: "56px",
              height: "56px",
              padding: "12px",
              borderRadius: "96px",
            }}
          >
            <Image src="/authimages/Signupperson.svg" alt="Signupperson" width={32} height={32} priority />
          </div>
          <div className="w-full h-[48px] flex flex-col justify-center items-center gap-[8px]">
            <h2
              className=" h-[24px]
                text-[20px]
                leading-[24px]
                tracking-[-0.015em]
                text-center
                align-middle text-[#171717]
              "
            >
              Create a new account
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
              Start your journey with us
            </span>
          </div>
          <button
            type="button"
            className="mt-2 flex h-[36px] w-full max-w-[370px] items-center justify-center gap-2 rounded-[10px] bg-[var(--bg-white-0)] text-[16px] font-medium text-[#171717] cursor-pointer"
            style={{
              boxShadow:
                "0px -1px 1px -0.5px var(--shadowgrayshadow-4) inset, 0px 0px 0px 1px var(--shadowgrayshadow-8), 0px 1px 1px -0.5px var(--shadowgrayshadow-4), 0px 3px 3px -1.5px var(--shadowgrayshadow-4), 0px 6px 6px -3px var(--shadowgrayshadow-4)",
              padding: "8px 12px",
            }}
          >
            <Image src="/authimages/Google.svg" alt="Google logo" width={20} height={20} priority />
            <span className="text-[#A3A3A3]">
              Sign up with <span className="text-[#5C5C5C]">Google</span>
            </span>
          </button>

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
            {/* Full Name */}
            <InputForm
              label="Full name"
              required
              placeholder="James Brown"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: '' });
                }
                if (contextError) {
                  clearError();
                }
              }}
              error={errors.fullName}
              className="h-[40px] bg-white rounded-[12px] border-none shadow-[0px_0px_0px_1px_var(--shadowgrayshadow-8),0px_1px_1px_-0.5px_var(--shadowgrayshadow-4),0px_3px_3px_-1.5px_var(--shadowgrayshadow-4)]"
              leftIcon={
                <Image
                  src="/icons/Person.svg"
                  alt="user icon"
                  width={18}
                  height={18}
                />
              }
            />

            {/* Email Address */}
            <InputForm
              label="Email Address"
              required
              placeholder="hello@alignui.com"
              type="email"
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
                <Image src="/icons/mail-fill.svg" alt="email icon" width={22} height={22} className="opacity-25" />
              }
            />

            {/* Password */}
            <InputForm
              label="Password"
              required
              placeholder="••••••••"
              type="password"
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

            {/* API Error Message */}
            {contextError && (
              <div className="w-full p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-[13px]">{contextError}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[36px] bg-[#1DAF61] hover:bg-[#46A580] disabled:bg-gray-400 disabled:cursor-not-allowed text-[#FFFFFF] rounded-[10px] font-medium text-[14px] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <div className="mt-2 text-center text-[14px] text-[#A3A3A3]">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-[#5C5C5C] font-medium underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
      </div>
  );
};

export default SignupPage;
