"use client";

import Button from "@/components/ui/button/Button";
import { ALERT_CONFIG } from "@/components/ui/toast/alertConfig";
import { useAlertToast } from "@/components/ui/toast/useAlertToast";

export default function ToastTestPage() {
  const { openAlertToast } = useAlertToast();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Toast Test Page</h1>

      {Object.keys(ALERT_CONFIG).map((variant) => {
        const key = variant as keyof typeof ALERT_CONFIG;

        return (
          <Button key={variant} onClick={() => openAlertToast(key)}>
            Open {variant}
          </Button>
        );
      })}
    </main>
  );
}
