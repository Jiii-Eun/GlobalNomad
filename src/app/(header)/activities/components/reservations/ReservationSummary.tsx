import { currency } from "@/app/(header)/activities/components/reservations/ReservationWidget";

export interface SummaryProps {
  totalAmount: number;
}

export default function ReservationSummary({ totalAmount }: SummaryProps) {
  return (
    <div className="border-brand-gray-300 text-h3-bold text-nomad-black flex justify-between border-t pt-4 text-xl font-bold">
      <p>총 합계</p>
      <div>{currency(totalAmount)}</div>
    </div>
  );
}
