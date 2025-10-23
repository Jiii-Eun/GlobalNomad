"use client";

import { useToastProvider } from "@/components/provider/ToastProvider";
import Toast from "@/components/ui/toast";

export function useTestToast() {
  const { openToast } = useToastProvider();

  const showCustomToast = () => {
    openToast(
      <Toast
        size="lg"
        icon
        message="이건 ToastConfig 없이 직접 띄운 커스텀 토스트예요 🎉"
        buttons={[
          { label: "닫기", actionKey: "cancel" },
          { label: "확인", primary: true, actionKey: "confirm" },
        ]}
        onAction={(key) => {
          if (key === "confirm") console.log("확인 클릭");
          if (key === "cancel") console.log("취소 클릭");
        }}
        align="center"
      />,
      { autoClose: false },
    );
  };

  return { showCustomToast };
}
