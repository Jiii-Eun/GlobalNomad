"use client";

import { createContext, useContext } from "react";

interface DrawerContextValue {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
  isClose?: boolean;
  isBack?: boolean;
  isLastStep?: boolean;
  steps?: React.ReactNode[];
  step?: number;
  direction?: "next" | "prev";
  nextStep?: () => void;
  prevStep?: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("<DrawerLayout>과 함께 사용해야합니다.");
  }
  return context;
}

export default DrawerContext;
