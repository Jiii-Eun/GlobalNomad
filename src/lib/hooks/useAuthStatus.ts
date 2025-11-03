"use client";
import { useEffect, useState } from "react";

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    fetch("/api/auth/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data: { loggedIn: boolean }) => {
        if (alive) setIsLoggedIn(data.loggedIn);
      })
      .catch(() => {
        if (alive) setIsLoggedIn(false);
      })
      .finally(() => {
        if (alive) setChecking(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { isLoggedIn, checking };
}
