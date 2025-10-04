"use client";

import { motion, AnimatePresence } from "motion/react";
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

interface ToastContextValue {
  toast: ReactNode | null;
  openToast: (content: ReactNode) => void;
  closeToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ReactNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const openToast = useCallback((content: ReactNode) => {
    clearTimer();
    setToast(content);

    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 3000);
  }, []);

  const closeToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, openToast, closeToast }}>
      {children}

      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key="toast"
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
              transition: { duration: 0.1 },
            }}
            className="fixed top-1/2 left-1/2 z-[999] -translate-x-1/2 -translate-y-1/2 shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider와 함께 사용해야합니다.");
  return ctx;
}
