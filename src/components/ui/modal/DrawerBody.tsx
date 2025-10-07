"use client";

import { motion } from "framer-motion";
import { useEffect, useState, forwardRef } from "react";

import { cn } from "@/lib/cn";
import { useMotionHeight } from "@/lib/hooks/useMotionHeight";

import { useDrawerContext } from "./DrawerContext";
import StepSlider from "./StepSlider";

interface DrawerBodyProps {
  frameClass?: string;
  children?: React.ReactNode;
}

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(({ frameClass, children }, ref) => {
  const { steps } = useDrawerContext();
  const hasSteps = steps && steps.length > 0;

  const { ref: contentRef, heightMotion } = useMotionHeight(180, 26);
  const [isMeasured, setIsMeasured] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIsMeasured(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div
      style={isMeasured ? { height: heightMotion } : { height: "auto" }}
      className="flex-1 overflow-hidden"
    >
      <div ref={contentRef}>
        <div className="max-h-[calc(80vh-80px)] overflow-y-auto">
          <div className={cn("py-6", frameClass)}>
            {hasSteps ? <StepSlider /> : <div ref={ref}>{children}</div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

DrawerBody.displayName = "DrawerBody";
export default DrawerBody;
