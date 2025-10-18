import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollablePortal = document.getElementById("portal");
    if (scrollablePortal) {
      scrollablePortal.style.overflowY = "auto";
      scrollablePortal.style.touchAction = "pan-y";
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
      if (scrollablePortal) scrollablePortal.style.overflowY = "";
    };
  }, [locked]);
}
