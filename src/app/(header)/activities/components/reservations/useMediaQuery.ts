import { useEffect, useState } from "react";

export default function useMediaQuery(query: string) {
  const get = () => (typeof window !== "undefined" ? window.matchMedia(query).matches : false);
  const [match, setMatch] = useState<boolean>(get);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setMatch("matches" in e ? e.matches : (e as MediaQueryList).matches);

    onChange(mq);
    if ("addEventListener" in mq) {
      mq.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
      return () => mq.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
    }
  }, [query]);

  return match;
}
