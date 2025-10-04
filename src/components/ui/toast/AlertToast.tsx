"use client";

import { useRouter } from "next/navigation";

import { Status } from "@/components/icons";
import { useToast } from "@/components/provider/ToastProvider";
import Button from "@/components/ui/button/Button";
import {
  TOAST_ALIGN_CLASS,
  TOAST_BUTTON_ALIGN_CLASS,
  TOAST_BUTTON_CLASS,
  TOAST_FRAME_CLASS,
} from "@/components/ui/toast/constants";
import { cn } from "@/lib/cn";

import { ALERT_CONFIG } from "./alertConfig";

interface AlertProps {
  variant: keyof typeof ALERT_CONFIG;
  onClick?: () => void;
  frameClass?: string;
  buttonClass?: string;
}

export default function AlertToast({ variant, onClick, frameClass, buttonClass }: AlertProps) {
  const { closeToast } = useToast();
  const router = useRouter();
  const config = ALERT_CONFIG[variant];
  const size = config.size ?? "lg";

  const icon = config.icon ? <Status.CheckMarkFill className="h-6 w-6" /> : null;
  const buttons = config.buttons ?? [{ label: "확인", primary: true }];
  const message = config.message;
  const btnAlign = config.btnAlign;

  const frameStyle = TOAST_FRAME_CLASS[size];
  const buttonAlignStyle = TOAST_BUTTON_ALIGN_CLASS[size];
  const buttonStyle = TOAST_BUTTON_CLASS[size];

  const alignStyle = btnAlign ? TOAST_ALIGN_CLASS[btnAlign] : "";

  const handleButtonClick = (actionKey?: string) => {
    closeToast();

    onClick?.();

    if (actionKey === "redirect" && config.redirectTo) {
      router.prefetch(config.redirectTo);
    }
  };

  return (
    <div className={cn("rounded-8 flex flex-col justify-end bg-white p-7", frameStyle, frameClass)}>
      <div className="flex flex-col gap-4">
        {icon && <div className="flex justify-center">{icon}</div>}
        <p className="text-center">{message}</p>
      </div>

      {buttons && (
        <div className={cn("flex items-center justify-center gap-2", buttonAlignStyle, alignStyle)}>
          {buttons.map((btn, i) => (
            <Button
              key={i}
              onClick={() => {
                handleButtonClick();
              }}
              className={cn(
                "bg-white",
                buttonStyle,
                btn.primary
                  ? "bg-brand-nomad-black text-white"
                  : "border-brand-nomad-black text-brand-nomad-black border",
                buttonClass,
              )}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
