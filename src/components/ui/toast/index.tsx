"use client";

import { Status } from "@/components/icons";
import { useToastProvider } from "@/components/provider/ToastProvider";
import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

export interface ToastProps {
  message?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode | string;
  buttons?: {
    label: string;
    primary?: boolean;
    actionKey?: string;
  }[];
  onAction?: (actionKey?: string) => void;
  size?: "sm" | "lg";
  align?: "start" | "center" | "end";
  frameClass?: string;
  buttonClass?: string;
}

const FRAME = {
  sm: "rounded-12 h-[184px] w-[296px] p-6 gap-7 justify-between",
  lg: "w-[540px] h-[240px] gap-10 mobile:w-[327px] mobile:h-[220px] mobile:gap-11 justify-end",
};
const ALIGN = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

const BUTTON_ALIGN = {
  sm: "",
  lg: "mobile:justify-center justify-end",
};

const BUTTON = {
  sm: "rounded-6 text-md h-[38px] w-20 font-bold",
  lg: "rounded-8 h-12 w-[120px] px-4 py-2",
};

export default function Toast({
  message,
  children,
  icon,
  buttons = [{ label: "확인", primary: true }],
  onAction,
  size = "lg",
  align = "end",
  frameClass,
  buttonClass,
}: ToastProps) {
  const frameStyle = FRAME[size];
  const alignStyle = ALIGN[align];
  const buttonAlignStyle = BUTTON_ALIGN[size];
  const buttonStyle = BUTTON[size];
  const icons =
    typeof icon === "string"
      ? (icon === "check" && <Status.CheckMarkFill className="size-full" />) ||
        (icon === "error" && <Status.CheckErrorFill className="size-full" />)
      : icon;

  const { closeToast } = useToastProvider();

  const handleButtonClick = (actionKey?: string) => {
    if (actionKey) {
      onAction?.(actionKey);
    }

    closeToast();
  };

  return (
    <div className={cn("rounded-8 flex flex-col bg-white p-7 shadow-lg", frameStyle, frameClass)}>
      <div className="flex flex-col items-center gap-4">
        {icon && <div className="size-6">{icons}</div>}
        {children ? children : <p className="text-center text-lg">{message}</p>}
      </div>

      <div className={cn("flex items-center gap-2", buttonAlignStyle, alignStyle)}>
        {buttons.map((btn, i) => (
          <Button
            key={i}
            variant={btn.primary ? "b" : "w"}
            onClick={() => handleButtonClick(btn?.actionKey)}
            className={cn(buttonStyle, buttonClass)}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
