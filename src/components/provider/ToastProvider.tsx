"use client";

import { motion, AnimatePresence } from "motion/react";
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

import useClickOutside from "@/lib/hooks/useClickOutside";

interface ToastContextValue {
  toast: ReactNode | null;
  openToast: (content: ReactNode, options?: ToastOptions) => void;
  closeToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastOptions {
  autoClose?: boolean;
  duration?: number;
}

const DEFAULT_OPTIONS: Required<ToastOptions> = {
  autoClose: true,
  duration: 3000,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ReactNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const openToast = useCallback((content: ReactNode, options?: ToastOptions) => {
    clearTimer();
    setToast(null);

    setTimeout(() => {
      setToast(content);

      const merged = { ...DEFAULT_OPTIONS, ...options };
      if (merged.autoClose) {
        timerRef.current = setTimeout(() => {
          setToast(null);
          timerRef.current = null;
        }, merged.duration);
      }
    }, 10);
  }, []);

  const closeToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, []);

  const toastRef = useClickOutside(closeToast);

  return (
    <ToastContext.Provider value={{ toast, openToast, closeToast }}>
      {children}

      <AnimatePresence mode="sync">
        {toast && (
          <motion.div
            key="toast"
            ref={toastRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 1, y: 20 }}
            animate={{
              opacity: 1,
              y: [20, -10, 0],
              transition: {
                duration: 0.3,
                ease: "easeOut",
                times: [0, 0.5, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              transition: { duration: 0.15, ease: "easeInOut" },
            }}
            className="shadow-green fixed top-1/2 left-1/2 z-[999] -translate-x-1/2 -translate-y-1/2"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToastProvider() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider와 함께 사용해야합니다.");
  return ctx;
}
