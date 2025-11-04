"use client";

import { useEffect, useState } from "react";

export function useDevice() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPc, setIsPc] = useState(true);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;

      if (width <= 744) {
        setIsMobile(true);
        setIsTablet(false);
        setIsPc(false);
      } else if (width <= 1248) {
        setIsMobile(false);
        setIsTablet(true);
        setIsPc(false);
      } else {
        setIsMobile(false);
        setIsTablet(false);
        setIsPc(true);
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return { isMobile, isTablet, isPc };
}
