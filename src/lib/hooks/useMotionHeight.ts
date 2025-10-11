"use client";

import { useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

import { useMeasureHeight } from "./useMeasureHeight";

export function useMotionHeight(stiffness = 180, damping = 26) {
  const { ref, height, measure } = useMeasureHeight();
  const spring = useSpring(height, { stiffness, damping });
  const heightMotion = useTransform(spring, (v) => `${v}px`);

  useEffect(() => {
    spring.set(height);
  }, [height, spring]);

  return { ref, height, heightMotion, measure };
}
