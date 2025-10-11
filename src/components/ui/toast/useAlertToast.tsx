import { useToast } from "@/components/provider/ToastProvider";
import { ALERT_CONFIG } from "@/components/ui/toast/alertConfig";
import AlertToast from "@/components/ui/toast/AlertToast";

export function useAlertToast() {
  const { openToast } = useToast();

  const openAlertToast = (variant: keyof typeof ALERT_CONFIG) => {
    const config = ALERT_CONFIG[variant];
    openToast(<AlertToast variant={variant} />, {
      autoClose: config.autoClose ?? true,
    });
  };

  return { openAlertToast };
}
