"use client";

import { useEffect, useRef, useState } from "react";

export function useDirection(step: number) {
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const prevStepRef = useRef(step);

  useEffect(() => {
    if (step > prevStepRef.current) setDirection("next");
    else if (step < prevStepRef.current) setDirection("prev");

    prevStepRef.current = step;
  }, [step]);

  return direction;
}
