"use client";

import { cn } from "@/lib/cn";
import useToast from "@/lib/hooks/useToast";

interface ToastFrameProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  frameStyle?: string;
}

export default function ToastFrame({ children, size = "md", frameStyle }: ToastFrameProps) {
  const { Toast } = useToast();

  const frameClass = {
    sm: "rounded-12 h-[184px] w-[296px] p-6",
    md: "w-[327px] h-[220px]",
    lg: "w-[540px] h-[240px]",
  };

  return (
    <Toast>
      <div
        className={cn(
          "flex flex-col rounded-8 border bg-white shadow-[0_4px_16px_0_rgba(17,34,17,0.05)] p-7",
          frameClass[size],
          frameStyle,
        )}
      >
        {children}
      </div>
    </Toast>
  );
}
