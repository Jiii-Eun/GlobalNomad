"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ScheduleSlot } from "@/lib/api/activities/types";

interface CalendarContextValue {
  activityId: number;
  selectedDate: string | null; // 'yyyy-MM-dd'
  selectedTime: ScheduleSlot | null;
  headCount: number;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedTime: React.Dispatch<React.SetStateAction<ScheduleSlot | null>>;
  setHeadCount: React.Dispatch<React.SetStateAction<number>>;
  clearSelection: () => void; // 편의 액션
  isReadyToReserve: boolean; // 선택 완료 여부 파생값
}

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within <CalendarProvider />");
  return ctx;
}

interface CalendarProviderProps {
  activityId: number;
  children: React.ReactNode;
}

export function CalendarProvider({ activityId, children }: CalendarProviderProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<ScheduleSlot | null>(null);
  const [headCount, setHeadCount] = useState<number>(1);

  // 다른 체험 상세로 바뀌면 선택값 리셋
  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setHeadCount(1);
  }, [activityId]);

  const clearSelection = () => {
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const isReadyToReserve = !!(selectedDate && selectedTime && headCount > 0);

  const value = useMemo<CalendarContextValue>(
    () => ({
      activityId,
      selectedDate,
      selectedTime,
      headCount,
      setSelectedDate,
      setSelectedTime,
      setHeadCount,
      clearSelection,
      isReadyToReserve,
    }),
    [activityId, selectedDate, selectedTime, headCount, isReadyToReserve],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}
