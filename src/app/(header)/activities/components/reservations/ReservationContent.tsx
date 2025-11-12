"use client";

import ParticipantsCounter, {
  MemberProps,
} from "@/app/(header)/activities/components/participants/ParticipantsCounter";
import ReservationButton, {
  ButtonProps,
} from "@/app/(header)/activities/components/reservations/ReservationButton";
import ReservationCalendar, {
  CalendarProps,
} from "@/app/(header)/activities/components/reservations/ReservationCalendar";
import ReservationSummary, {
  SummaryProps,
} from "@/app/(header)/activities/components/reservations/ReservationSummary";
import ReservationTimeSlots, {
  TimeSlotProps,
} from "@/app/(header)/activities/components/reservations/ReservationTimeSlots";
import { cn } from "@/lib/cn";

import ReservationPriceSection, { PriceProps } from "./ReservationPriceSection";
import ReservationWrap from "./ReservationWrap";

export interface ContentProps
  extends CalendarProps,
    ButtonProps,
    PriceProps,
    SummaryProps,
    MemberProps,
    TimeSlotProps {
  pendingDates?: string[];
  price: number;
  fullyReservedDates: Set<string>;
  setMembers: (members: number) => void;
  setSelectedDate: (date: Date) => void;
  handleReserve: () => void;
  isReserveDisabled: boolean;
}

export default function ReservationContent({
  pendingDatesSet,
  price,
  calendarMonth,
  selectedDate,
  availableSet,
  daySlots,
  isSelectedDatePending,
  selectedSlots,
  members,
  reserved,
  isPending,
  isReserveDisabled,
  totalAmount,
  fullyReservedDates,
  setCalendarMonth,
  setSelectedDate,
  setMembers,
  toggleSlot,
  handleReserve,
}: ContentProps) {
  return (
    <ReservationWrap>
      <ReservationPriceSection price={price} />
      <div className={cn("tablet:flex tablet:h-[500px] tablet:justify-center tablet:gap-6")}>
        <ReservationCalendar
          isLoggedIn
          calendarMonth={calendarMonth}
          selectedDate={selectedDate}
          availableSet={availableSet}
          pendingDatesSet={pendingDatesSet}
          fullyReservedDates={fullyReservedDates}
          setCalendarMonth={setCalendarMonth}
          setSelectedDate={setSelectedDate}
        />

        <div
          className={cn(
            "tablet:rounded-2xl tablet:border-brand-gray-300 tablet:border tablet:max-w-[300px] tablet:w-full",
            "tablet:bg-white tablet:p-6 tablet:shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]",
          )}
        >
          <ReservationTimeSlots
            selectedDate={selectedDate}
            daySlots={daySlots}
            isSelectedDatePending={isSelectedDatePending}
            selectedSlots={selectedSlots}
            toggleSlot={toggleSlot}
          />
          <ParticipantsCounter
            members={members}
            handleCountPlus={() => setMembers(members + 1)}
            handleCountMinus={() => setMembers(members > 1 ? members - 1 : 1)}
          />
          <div className="tablet:hidden">
            <ReservationButton
              reserved={reserved}
              isPending={isPending}
              isLoggedIn
              isReserveDisabled={isReserveDisabled}
              slotCount={selectedSlots.length}
              handleReserve={handleReserve}
            />
          </div>
          <ReservationSummary totalAmount={totalAmount} />
        </div>
      </div>
    </ReservationWrap>
  );
}
