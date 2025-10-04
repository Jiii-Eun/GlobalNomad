"use client";

import { useToast } from "@/components/provider/ToastProvider";
import AlertToast from "@/components/ui/toast/AlertToast";
import { ALERT_CONFIG } from "@/components/ui/toast/constants";

export default function ToastTestPage() {
  const { openToast } = useToast();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Toast Test Page</h1>

      {Object.keys(ALERT_CONFIG).map((variant) => (
        <button
          key={variant}
          onClick={() => openToast(<AlertToast variant={variant as keyof typeof ALERT_CONFIG} />)}
          className="rounded bg-green-900 px-4 py-2 text-white"
        >
          Open {variant}
        </button>
      ))}
    </main>
  );
}
