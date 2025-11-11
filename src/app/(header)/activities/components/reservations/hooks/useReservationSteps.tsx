import ParticipantsCounter from "@/app/(header)/activities/components/participants/ParticipantsCounter";
import { useReservationCore } from "@/app/(header)/activities/components/reservations/hooks/useReservationCore";
import ReservationCalendar from "@/app/(header)/activities/components/reservations/ReservationCalendar";
import ReservationSummary from "@/app/(header)/activities/components/reservations/ReservationSummary";
import ReservationTimeSlots from "@/app/(header)/activities/components/reservations/ReservationTimeSlots";

export function useReservationSteps(core: UseReservationCoreReturn) {
  const {
    calendarMonth,
    daySlots,
    isSelectedDatePending,
    selectedSlots,
    selectedDate,
    availableSet,
    pendingDatesSet,
    fullyReservedDates,
    members,
    setCalendarMonth,
    setSelectedDate,
    setMembers,
    toggleSlot,
    totalAmount,
  } = core;

  const steps = [
    <>
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
    </>,
    <>
      <ParticipantsCounter
        members={members}
        handleCountPlus={() => setMembers((n) => n + 1)}
        handleCountMinus={() => setMembers((n) => (n > 1 ? n - 1 : 1))}
      />
      <ReservationSummary totalAmount={totalAmount} />
    </>,
  ];

  return { ...core, steps };
}

export type UseReservationCoreReturn = ReturnType<typeof useReservationCore>;
