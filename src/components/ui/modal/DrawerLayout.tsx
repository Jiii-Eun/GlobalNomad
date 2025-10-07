"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";

import { useDevice } from "@/lib/hooks/useDevice";
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

  const { isMobile } = useDevice();

  useEffect(() => {
    if (!isMobile && step !== 0) {
      setStep(0);
    }
  }, [isMobile, step]);

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
            className={`fixed bottom-0 left-1/2 z-[910] flex max-h-[96%] w-full -translate-x-1/2 flex-col rounded-t-[16px] bg-white p-6 shadow-lg ${widthMap[width]}`}
          >
            <Drawer.Title className="sr-only">{title}</Drawer.Title>

            {/* Handle */}
            <div className="bg-brand-deep-green-50 mx-auto mb-3 h-1.5 w-12 rounded-full" />
            <div>{children}</div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </DrawerContext.Provider>
  );
}
