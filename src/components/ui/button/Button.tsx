"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "b" | "w" | "g";
// b: nomad-black, w: white, g: green-500

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  isdisabled?: boolean;
}

export default function Button({
  children,
  variant = "b",
  className,
  isdisabled,
  ...props
}: ButtonProps) {
  // default: r-6 , 폰트 16px, 굵기 medium
  const baseStyle =
    "flex-center transition-all duration-150 rounded-md text-lg font-medium leading-none";

  const variantStyle = {
    b: "bg-brand-nomad-black text-white",
    w: "bg-white text-brand-nomad-black border border-brand-nomad-black",
    g: "bg-brand-green-500 text-white hover:brightness-95",
  }[variant];

  const disabledStyle =
    "bg-brand-gray-600 text-brand-gray-300 cursor-not-allowed hover:brightness-100";

  return (
    <button
      disabled={isdisabled}
      className={cn(baseStyle, variantStyle, isdisabled && disabledStyle, className)}
      {...props}
    >
      {children}
    </button>
  );
}
