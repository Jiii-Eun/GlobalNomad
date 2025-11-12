import { currency } from "@/app/(header)/activities/components/reservations/ReservationWidget";
import { cn } from "@/lib/cn";

export interface PriceProps {
  price: number;
}

export default function ReservationPriceSection({ price }: PriceProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "border-brand-gray-300 border-b pb-4",
        "mobile:border-0 tablet:hidden",
      )}
    >
      <p className="text-brand-black text-3xl font-bold">{currency(price)}</p>
      <p className="text-brand-gray-900 text-xl">/ 인</p>
    </div>
  );
}
