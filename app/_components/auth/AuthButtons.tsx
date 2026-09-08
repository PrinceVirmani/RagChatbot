import Image from "next/image";
import React from "react";

export const AuthButtons = () => {
  return (
    <div className="flex w-[390px] h-9 items-center gap-3">
      <button
        // Apple button temporarily disabled
        // <button ...>...</button>
        className="flex w-full h-9 items-center justify-center gap-2 rounded-[10px] border border-gray-200 bg-white px-3 py-2 shadow-[0_2px_6px_rgba(15,23,42,0.06)]"
        type="button"
      >
        <Image
          src="/authimages/Google.svg"
          alt="Google sign-in"
          width={16}
          height={16}
          className="h-4 w-4"
        />
        <span className="text-xs text-gray-500">
          Sign in with{" "}
          <span className="font-medium text-gray-700">Google</span>
        </span>
      </button>
    </div>
  );
};
