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
    </ReservationWrap>
  );
}
