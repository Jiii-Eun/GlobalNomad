import { useToast } from "@/components/provider/ToastProvider";
import AlertToast from "@/components/ui/toast";
import { ALERT_CONFIG } from "@/components/ui/toast/alertConfig";

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
