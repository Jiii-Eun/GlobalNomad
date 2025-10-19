import { useState, useEffect } from "react";

export function useDevice() {
  const [device, setDevice] = useState<"pc" | "tablet" | "mobile" | null>(null);

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width >= 1024) setDevice("pc");
      else if (width >= 768) setDevice("tablet");
      else setDevice("mobile");
    };
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  return {
    isPc: device === "pc",
    isTablet: device === "tablet",
    isMobile: device === "mobile",
    isReady: device !== null,
  };
}
