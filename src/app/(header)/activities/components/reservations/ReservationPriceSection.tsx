import { currency } from "@/app/(header)/activities/components/reservations/ReservationWidget";

export interface PriceProps {
  price: number;
}

export default function ReservationPriceSection({ price }: PriceProps) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-brand-black text-3xl font-bold">{currency(price)}</p>
      <p className="text-brand-gray-900 text-xl">/ 인</p>
    </div>
  );
}
