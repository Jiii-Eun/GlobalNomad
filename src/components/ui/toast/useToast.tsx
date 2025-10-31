"use client";

import { useRouter } from "next/navigation";

import { useToastProvider } from "@/components/provider/ToastProvider";
import Toast from "@/components/ui/toast";
import { TOAST_CONFIG } from "@/components/ui/toast/ToastConfig";

export function useToast() {
  const { openToast } = useToastProvider();
  const router = useRouter();

  const showToast = (
    variant: keyof typeof TOAST_CONFIG,
    handleConfirm?: () => Promise<void> | void,
  ) => {
    const config = TOAST_CONFIG[variant];
    const autoClose = config.autoClose ?? true;

    const message = config.message;
    const icon = config.icon;
    const buttons = config.buttons;
    const btnAlign = config.btnAlign;
    const size = config.size;
    const redirectTo = config.redirectTo;

    const onAction = async (actionKey?: string) => {
      if (actionKey === "confirm" && handleConfirm) {
        await handleConfirm();
      }

      if (actionKey === "redirect" && redirectTo) {
        router.push(redirectTo);
      }
    };

    openToast(
      <Toast
        message={message}
        icon={icon}
        buttons={buttons}
        onAction={onAction}
        size={size}
        align={btnAlign}
      />,
      { autoClose },
    );
  };

  return { showToast };
}
