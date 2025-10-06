"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useMeasureHeight<T extends HTMLElement = HTMLDivElement>(autoObserve = true) {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    if (ref.current) {
      const newHeight = ref.current.scrollHeight;
      setHeight(newHeight);
    }
  }, []);

  useEffect(() => {
    if (!autoObserve || !ref.current) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [autoObserve, measure]);

  useEffect(() => {
    measure();
  }, [measure]);

  return { ref, height, measure };
}
