"use client";

import { ToastProvider } from "@/components/provider/ToastProvider";
import { cn } from "@/lib/cn";

interface ToastFrameProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  frameStyle?: string;
  autoClose?: boolean;
  textStyle?: string;
}

export default function ToastFrame({ children, size = "lg", frameStyle }: ToastFrameProps) {
  const FRAME_CLASS = {
    sm: "rounded-12 h-[184px] w-[296px] p-6",
    md: "w-[327px] h-[220px]",
    lg: "w-[540px] h-[240px] mobile:w-[327px] mobile:h-[220px]",
  };

  return (
    <ToastProvider>
      <div className={cn("rounded-8 flex flex-col bg-white p-7", FRAME_CLASS[size], frameStyle)}>
        {children}
      </div>
    </ToastProvider>
  );
}
