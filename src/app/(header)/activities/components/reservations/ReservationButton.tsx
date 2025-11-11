import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

export interface ButtonProps {
  reserved: boolean;
  isPending: boolean;
  isLoggedIn: boolean;
  isReserveDisabled: boolean;
  handleReserve: () => void;
}

export interface AllButtonProps extends ButtonProps {
  slotCount: number;
}

export default function ReservationButton({
  reserved,
  isPending,
  isLoggedIn,
  isReserveDisabled: disabled,
  slotCount,
  handleReserve: onClick,
}: AllButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-body1-bold my-7 w-full rounded-md px-4 py-[1.4rem] text-white",
        disabled ? "bg-brand-gray-300 cursor-not-allowed" : "bg-brand-black",
        "mobile:my-0 px-0 py-0 leading-12",
      )}
    >
      {reserved
        ? "예약 완료"
        : isPending
          ? "예약 중..."
          : !isLoggedIn
            ? "로그인이 필요합니다"
            : `예약하기 (${slotCount}건)`}
    </Button>
  );
}
