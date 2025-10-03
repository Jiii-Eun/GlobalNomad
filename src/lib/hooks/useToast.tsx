"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const useToast = (autoClose?: number) => {
  const [isOpen, setIsOpen] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalElement(document.getElementById("portal"));
    }

    return () => {
      clearTimer();
    };
  }, []);

  const openToast = useCallback(() => {
    setIsOpen(true);

    if (autoClose && autoClose > 0) {
      clearTimer();
      timerRef.current = setTimeout(() => setIsOpen(false), autoClose);
    }
  }, [autoClose]);

  const closeToast = useCallback(() => {
    setIsOpen(false);
    clearTimer();
  }, []);

  const Toast = ({ children }: { children: React.ReactNode }) => {
    if (!portalElement) return null;

    return createPortal(
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 z-[999] -translate-x-1/2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>,
      portalElement,
    );
  };

  return { isOpen, openToast, closeToast, Toast };
};

export default useToast;
