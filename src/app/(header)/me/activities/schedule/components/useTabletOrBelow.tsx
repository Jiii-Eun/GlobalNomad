import { useEffect, useState } from "react";

export function useIsTabletOrBelow() {
  const [isTabletOrBelow, setIsTabletOrBelow] = useState(false);

  useEffect(() => {
    // matchMedia는 클라이언트에서만 있으니까 useEffect 안에서만 접근
    const mql = window.matchMedia("(max-width: 1248px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsTabletOrBelow(e.matches);
    };

    // 초기값
    handleChange(mql);

    // 리스너 등록 (브라우저별 호환성 때문에 둘 다 처리)
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleChange);
      return () => {
        mql.removeEventListener("change", handleChange);
      };
    } else {
      mql.addListener(handleChange);
      return () => {
        mql.removeListener(handleChange);
      };
    }
  }, []);

  return isTabletOrBelow;
}
