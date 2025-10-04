"use client";

import { Status } from "@/components/icons";
import { useToast } from "@/components/provider/ToastProvider";
import { cn } from "@/lib/cn";

import { ALERT_CONFIG } from "./constants";

interface AlertProps {
  variant: keyof typeof ALERT_CONFIG;
  actions?: Record<string, () => void>;
}

export default function AlertToast({ variant, actions = {} }: AlertProps) {
  const { closeToast } = useToast();
  const config = ALERT_CONFIG[variant];
  const size = config.size ?? "lg";

  const icon = config.icon ? <Status.CheckMarkFill className="h-6 w-6" /> : null;

  const buttons = config.buttons ?? [{ label: "확인", primary: true }];

  return (
    <div
      className={cn(
        "rounded-8 flex flex-col bg-white p-7 shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]",
        size === "lg" && "mobile:w-[327px] mobile:h-[220px] h-[240px] w-[540px]",
        size === "sm" && "rounded-12 h-[184px] w-[296px] p-6",
      )}
    >
      {icon && <div className="flex justify-center">{icon}</div>}
      <p className="text-center">{config.message}</p>

      {/* 버튼 수정 */}
      <div className={cn("mt-4 flex gap-2", size === "lg" ? "justify-end" : "justify-center")}>
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={() => {
              if (btn.actionKey && actions[btn.actionKey]) {
                actions[btn.actionKey]();
              }
              closeToast();
            }}
            className={cn(
              "rounded border px-4 py-2",
              btn.primary
                ? "bg-brand-nomad-black text-white"
                : "border-brand-nomad-black text-brand-nomad-black",
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
