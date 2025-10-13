"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

interface SlideFrameProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  uniqueKey: string | number;
  duration?: number;
  ease?: "easeOut" | "easeInOut" | "linear";
  className?: string;
}
export default function SlideFrame({
  children,
  direction = "right",
  uniqueKey,
  duration = 0.5,
  ease = "easeOut",
  className,
}: SlideFrameProps) {
  const variants = {
    initial: (dir: "left" | "right") => ({
      x: dir === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: "left" | "right") => ({
      x: dir === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, [children]);

  return (
    <div
      className={cn(
        "relative flex overflow-hidden",
        width ? `w-[${width}px]` : "w-auto",
        className,
      )}
    >
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={uniqueKey}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration, ease }}
          className="flex w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
