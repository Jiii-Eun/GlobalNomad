import { useEffect, useRef } from "react";

export function usePortal(id: string) {
  const rootElemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let parentElem = document.getElementById(id);
    if (!parentElem) {
      parentElem = document.createElement("div");
      parentElem.setAttribute("id", id);
      document.body.appendChild(parentElem);
    }

    const elem = document.createElement("div");
    rootElemRef.current = elem;
    parentElem.appendChild(elem);

    return () => {
      if (rootElemRef.current && parentElem) {
        parentElem.removeChild(rootElemRef.current);
      }
    };
  }, [id]);

  return rootElemRef.current;
}
