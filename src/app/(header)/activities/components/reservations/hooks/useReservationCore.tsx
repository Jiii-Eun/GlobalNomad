"use client";

import { format, parseISO, isAfter, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useToastProvider } from "@/components/provider/ToastProvider";
import Toast from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast/useToast";
import { useAvailableSchedule, useCreateReservation } from "@/lib/api/activities/hooks";
import type { Schedule, ScheduleSlot } from "@/lib/api/activities/types";
import { useAuthStatus } from "@/lib/hooks/useAuthStatus";

export interface SelectedSlot {
  date: string;
  times: ScheduleSlot;
}

interface UseReservationCoreProps {
  activityId: number;
  price: number;
  schedules?: Schedule[];
  pendingDates?: string[];
  onSummaryChange?: (s: {
    dateText?: string;
    timeText?: string;
    members: number;
    totalMembers: number;
    totalPrice: number;
  }) => void;
}

export function useReservationCore({
  activityId,
  price,
  schedules = [],
  pendingDates = [],
  onSummaryChange,
}: UseReservationCoreProps) {
  const router = useRouter();
  const { openToast } = useToastProvider();
  const { showToast } = useToast();
  const { mutateAsync, isPending } = useCreateReservation(activityId);
  const { isLoggedIn } = useAuthStatus();

  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [members, setMembers] = useState(1);
  const [reserved, setReserved] = useState(false);
  const [didInitMonth, setDidInitMonth] = useState(false);

  const pendingDatesSet = useMemo(() => new Set(pendingDates), [pendingDates]);

  /** 달력 초기화 */
  useEffect(() => {
    if (didInitMonth || !schedules.length) return;
    const latest = schedules
      .map((s) => parseISO(s.date))
      .reduce((max, cur) => (isAfter(cur, max) ? cur : max), parseISO(schedules[0].date));
    setCalendarMonth(startOfMonth(latest));
    setDidInitMonth(true);
  }, [schedules, didInitMonth]);

  const year = format(calendarMonth, "yyyy");
  const month = format(calendarMonth, "MM");
  const { data: monthlyAvailable } = useAvailableSchedule(activityId, year, month);

  /** 예약 가능한 날짜들 */
  const availableSet = useMemo(() => {
    const fromHook = monthlyAvailable?.map((g) => g.date) ?? [];
    const fromProp =
      schedules
        ?.filter((s) => format(parseISO(s.date), "yyyyMM") === `${year}${month}`)
        .map((s) => s.date) ?? [];
    return new Set([...fromHook, ...fromProp]);
  }, [monthlyAvailable, schedules, year, month]);

  /** 날짜별 가능한 시간 슬롯 */
  const ymd = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const isSelectedDatePending = selectedDate ? pendingDatesSet.has(ymd) : false;
  const daySlots: ScheduleSlot[] = useMemo(() => {
    if (!selectedDate || isSelectedDatePending) return [];
    const fromHook = monthlyAvailable?.find((g) => g.date === ymd);
    if (fromHook) return fromHook.times;
    const fromProp =
      schedules
        ?.filter((s) => s.date === ymd)
        .map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime })) ?? [];
    return fromProp;
  }, [monthlyAvailable, schedules, selectedDate, isSelectedDatePending, ymd]);

  /** 슬롯 선택 */
  const toggleSlot = (date: Date, times: ScheduleSlot) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.date === dateStr && s.times.id === times.id);
      return exists
        ? prev.filter((s) => !(s.date === dateStr && s.times.id === times.id))
        : [...prev, { date: dateStr, times }];
    });
  };

  /** 예약 버튼 클릭 */
  const handleReserve = async () => {
    if (!isLoggedIn) {
      openToast(<Toast message="로그인이 필요합니다." icon="error" />);
      router.push("/login");
      return;
    }
    if (selectedSlots.length === 0 || isPending) return;

    try {
      await Promise.allSettled(
        selectedSlots.map(({ times }) => mutateAsync({ scheduleId: times.id, headCount: members })),
      );
      setReserved(true);
      showToast("reserveDone");
    } catch {
      showToast("reserveReject");
    }
  };

  const totalAmount = price * members * selectedSlots.length;
  const isReserveDisabled = reserved || isPending || selectedSlots.length === 0;

  /** 예약 정보 요약 콜백 */
  useEffect(() => {
    const count = selectedSlots.length;
    const totalPrice = count === 0 ? price * 1 : price * members * count;
    const totalMembers = count === 0 ? 1 : members * count;
    let dateText: string | undefined;
    let timeText: string | undefined;
    if (selectedDate && count > 0) {
      dateText = format(selectedDate, "yyyy-MM-dd");
      if (count === 1) {
        const only = selectedSlots[0].times;
        timeText = `${only.startTime} ~ ${only.endTime}`;
      } else {
        const first = selectedSlots[0].times;
        timeText = `${first.startTime} ~ ${first.endTime} 외 ${count - 1}건`;
      }
    }
    onSummaryChange?.({
      dateText,
      timeText,
      members,
      totalMembers,
      totalPrice,
    });
  }, [selectedDate, selectedSlots, members, price, onSummaryChange]);

  /** 초기화 */
  useEffect(() => {
    if (reserved) {
      setSelectedDate(null);
      setSelectedSlots([]);
      setMembers(1);
      setReserved(false);
    }
  }, [reserved]);

  return {
    // 상태
    calendarMonth,
    selectedDate,
    selectedSlots,
    members,
    reserved,
    availableSet,
    daySlots,
    isPending,
    isSelectedDatePending,
    isReserveDisabled,
    totalAmount,
    isLoggedIn,
    pendingDatesSet,

    // 액션
    setCalendarMonth,
    setSelectedDate,
    setMembers,
    toggleSlot,
    handleReserve,
  };
}
