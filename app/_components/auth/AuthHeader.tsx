import React, { FC } from "react";

interface AuthHeaderProps {
  title: string;        // e.g. "Sign in to your account"
  subtitle?: string;    // e.g. "Enter your details to login."
  align?: "left" | "center";
}

export const AuthHeader: FC<AuthHeaderProps> = ({
  title,
  subtitle,
  align = "left",
}) => {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-1 ${alignment}`}>
      <h1 className="font-medium text-[18px] leading-[24px] tracking-[-0.015em] text-gray-900">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  );
};
