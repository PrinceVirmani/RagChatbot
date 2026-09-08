"use client"
import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";

import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";


interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIconToggle?: boolean;       // enable password toggle
  error?: string;                   // error message from validation
}

export const InputForm = forwardRef<HTMLInputElement, InputFormProps>(
  (
    {
      label,
      required,
      helperText,
      leftIcon,
      rightIconToggle = false,
      type,
      className,
      error,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType =
      isPassword && showPassword ? "text" : type === "password" ? "password" : type;

    return (
      <div className="flex flex-col gap-1">
        {/* Label */}
        <label className="text-[15px] leading-5 font-medium tracking-[-0.006em] text-[#5C5C5C]">
          {label}
          {required && <span className="text-gray-400 ml-0.5">*</span>}
        </label>

        {/* Input Container */}
        <div
          className={[
            "flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3",
            error ? "border-red-500" : "border-gray-200 focus-within:border-green-500 focus-within:bg-white",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Left Icon */}
          {leftIcon && <span className="text-gray-400">{leftIcon}</span>}

          {/* Input Element */}
          <input
            ref={ref}
            type={inputType}
            className="flex-1 bg-transparent text-[14px] leading-5 font-medium tracking-[-0.006em] text-[#5C5C5C] placeholder-gray-400 focus:outline-none"
            {...props}
          />

          {/* Right Icon Toggle (Password Eye) */}
          {rightIconToggle && isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff size={18} className="opacity-40" />
              ) : (
                <Eye size={18} className="opacity-40" />
              )}
            </button>
          )}
        </div>

        {/* Error/Helper Text - Only render container when content exists */}
        {(error || helperText) && (
          <div className="h-1">
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-xs text-gray-400">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

InputForm.displayName = "InputForm";
