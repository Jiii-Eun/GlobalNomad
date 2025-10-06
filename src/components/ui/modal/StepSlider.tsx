"use client";

import { motion, AnimatePresence } from "motion/react";

import { useDrawerContext } from "@/components/ui/modal/DrawerContext";

export default function StepSlider() {
  const { steps = [], step = 0, direction = "next" } = useDrawerContext();
  const offset = direction === "next" ? 40 : -40;

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ x: offset, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -offset, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.45, 0, 0.55, 1] }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
