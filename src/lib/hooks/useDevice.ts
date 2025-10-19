import { useEffect, useState } from "react";

export function useDevice() {
  const [state, setState] = useState({
    isPc: false,
    isTablet: false,
    isMobile: false,
  });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setState({
        isPc: width > 1248,
        isTablet: width > 744 && width <= 1248,
        isMobile: width <= 744,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return state;
}
