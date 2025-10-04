"use client";

import { useToast } from "@/components/provider/ToastProvider";
import Button from "@/components/ui/button/Button";
import { ALERT_CONFIG } from "@/components/ui/toast/alertConfig";
import AlertToast from "@/components/ui/toast/AlertToast";

export default function ToastTestPage() {
  const { openToast } = useToast();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Toast Test Page</h1>

      {Object.keys(ALERT_CONFIG).map((variant) => {
        const key = variant as keyof typeof ALERT_CONFIG;
        const config = ALERT_CONFIG[key];

        return (
          <Button
            key={variant}
            onClick={() =>
              openToast(<AlertToast variant={key} />, {
                autoClose: config.autoClose ?? true,
              })
            }
            className="rounded bg-green-900 px-4 py-2 text-white"
          >
            Open {variant}
          </Button>
        );
      })}
    </main>
  );
}
