"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/cn";
import { useDirection } from "@/lib/hooks/useDirection";

import DrawerContext from "./DrawerContext";

interface DrawerLayoutProps {
  trigger: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  width?: "md" | "full";
  step?: number;
  steps?: React.ReactNode[];
  onBack?: () => void;
  onClose?: () => void;
  isClose?: boolean;
  isBack?: boolean;
  contentClass?: string;
}

const widthMap = {
  md: "max-w-[480px]",
  full: "w-full",
};

export default function DrawerLayout({
  trigger,
  title,
  children,
  width = "full",
  steps,
  onBack,
  onClose,
  isClose = true,
  contentClass,
}: DrawerLayoutProps) {
  const [step, setStep] = useState(0);
  const direction = useDirection(step);

  const nextStep = () => {
    if (!steps) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (!steps || steps.length <= 1) {
      setStep(0);
    }
  }, [steps]);

  const isBack = step > 0;

  const contextValue = {
    title,
    onBack,
    onClose,
    isClose,
    isBack,
    step,
    direction,
    steps,
    nextStep,
    prevStep,
  };

  return (
    <DrawerContext.Provider value={contextValue}>
      <Drawer.Root>
        <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[900] bg-black/40" />
          <Drawer.Content
            className={cn(
              "rounded-t-16 fixed bottom-0 left-1/2 z-[910] flex max-h-[96%] w-full -translate-x-1/2 flex-col bg-white p-6 shadow-lg",
              "mobile:p-4",
              widthMap[width],
              contentClass,
            )}
          >
            <Drawer.Title className="sr-only">{title}</Drawer.Title>
            <Drawer.Description className="sr-only">{title}</Drawer.Description>

            {/* Handle */}
            <div className="bg-brand-deep-green-50 mx-auto mb-3 h-1.5 w-12 rounded-full" />
            <div>{children}</div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </DrawerContext.Provider>
  );
}
