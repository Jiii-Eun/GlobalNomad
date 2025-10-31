"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { useToastProvider } from "@/components/provider/ToastProvider";
import Toast from "@/components/ui/toast";

export interface ApiError extends Error {
  status?: number;
}

interface ErrorContextValue {
  handleError: (error: ApiError) => void;
}

const ErrorContext = createContext<ErrorContextValue>({
  handleError: (error: ApiError) => {
    console.warn("[ErrorContext] Provider가 감싸지 않았습니다:", error);
  },
});

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  const handleError = (error: ApiError) => {
    setError(error);
  };

  const { openToast } = useToastProvider();

  useEffect(() => {
    if (!error) return;

    switch (error.status) {
      case 401:
        openToast(<Toast message="로그인이 필요합니다." />);
        router.push("/login");
        break;
      case 404:
        router.push("/not-found");
        break;
      case 500:
        openToast(<Toast message="서버 오류가 발생했습니다." icon="error" />);
        break;
      default:
        openToast(<Toast message={"요청 중 오류가 발생했습니다."} icon="error" />);
    }

    setError(null);
  }, [error, router]);

  return <ErrorContext.Provider value={{ handleError }}>{children}</ErrorContext.Provider>;
};

export const useErrorHandler = () => useContext(ErrorContext);
