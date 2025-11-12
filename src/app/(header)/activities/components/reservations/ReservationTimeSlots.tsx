import { format } from "date-fns";

import { SelectedSlot } from "@/app/(header)/activities/components/reservations/hooks/useReservationCore";
import type { ScheduleSlot } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";

export interface TimeSlotProps {
  selectedDate: Date | null;
  daySlots: ScheduleSlot[];
  isSelectedDatePending: boolean;
  selectedSlots: SelectedSlot[];
  toggleSlot: (date: Date, times: ScheduleSlot) => void;
}

export default function ReservationTimeSlots({
  selectedDate,
  daySlots,
  isSelectedDatePending,
  selectedSlots,
  toggleSlot,
}: TimeSlotProps) {
  return (
    <div className="mobile:mt-7 mt-4 flex flex-col gap-3.5">
      <p className="text-brand-nomad-black text-2lg mobile:text-h2 font-bold">예약 가능한 시간</p>

      {isSelectedDatePending ? (
        <div className="text-h4-regular text-brand-nomad-black mb-4">
          예약이 모두 완료되어 이용 가능한 시간이 없습니다.
        </div>
      ) : selectedDate && daySlots.length > 0 ? (
        <div className="flex flex-wrap">
          {daySlots.map((times) => {
            const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
            const selected = selectedSlots.some(
              (s) => s.date === dateStr && s.times.id === times.id,
            );
            return (
              <button
                key={times.id}
                onClick={() => selectedDate && toggleSlot(selectedDate, times)}
                disabled={isSelectedDatePending}
                className={cn(
                  "mr-[1.2rem] mb-[1.2rem] rounded-lg border px-[1.2rem] py-4 text-base font-medium",
                  "tablet:mr-0 mobile:px-0 mobile:py-0 mobile:leading-12",
                  selected
                    ? "bg-brand-deep-green-500 border-brand-deebg-brand-deep-green-500 text-white"
                    : "text-brand-deep-green-500 border-brand-deep-green-500 bg-white",
                  "tablet:w-full",
                )}
              >
                {times.startTime} ~ {times.endTime}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-h4-regular text-brand-nomad-black mb-4">
          {selectedDate ? "예약가능한 시간이 없습니다" : "날짜를 먼저 선택하세요"}
        </div>
      )}
    </div>
  );
}
