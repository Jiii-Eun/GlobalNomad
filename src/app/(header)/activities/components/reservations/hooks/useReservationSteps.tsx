import ParticipantsCounter from "@/app/(header)/activities/components/participants/ParticipantsCounter";
import { useReservationCore } from "@/app/(header)/activities/components/reservations/hooks/useReservationCore";
import ReservationButton from "@/app/(header)/activities/components/reservations/ReservationButton";
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
    members,
    setCalendarMonth,
    setSelectedDate,
    setMembers,
    toggleSlot,
    reserved,
    isPending,
    isReserveDisabled,
    handleReserve,
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
      <ReservationButton
        reserved={reserved}
        isPending={isPending}
        isLoggedIn
        isReserveDisabled={isReserveDisabled}
        slotCount={selectedSlots.length}
        handleReserve={handleReserve}
      />
      <ReservationSummary totalAmount={totalAmount} />
    </>,
  ];

  return { ...core, steps };
}

export type UseReservationCoreReturn = ReturnType<typeof useReservationCore>;
