"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "b" | "w" | "g";
// b: nomad-black, w: white, g: green-500

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  isDisabled?: boolean;
}

export default function Button({
  children,
  variant = "b",
  className,
  isDisabled,
  ...props
}: ButtonProps) {
  // default: r-6 , 폰트 16px, 굵기 medium
  const baseStyle = cn(
    "flex justify-center items-center transition-all duration-150 rounded-md text-lg font-medium bg-white",
    "disabled:border-brand-gray-300 disabled:text-brand-gray-300 disabled:bg-brand-gray-600 disabled:text-white disabled:opacity-50",
    "disabled:hover:brightness-100",
  );

  const variantStyle = {
    b: "bg-brand-nomad-black text-white hover:bg-brand-deep-green-500",
    w: "bg-white text-brand-nomad-black border border-brand-nomad-black hover:bg-brand-deep-green-50",
    g: "bg-brand-green-500 text-white hover:bg-brand-deep-green-50",
  }[variant];

  return (
    <button disabled={isDisabled} className={cn(baseStyle, variantStyle, className)} {...props}>
      {children}
    </button>
  );
}
