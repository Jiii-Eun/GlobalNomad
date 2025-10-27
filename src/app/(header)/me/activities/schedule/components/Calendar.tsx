"use client";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

interface DayCounts {
  pending?: number;
  confirmed?: number;
  completed?: number;
}

interface CalendarProps {
  year?: number;
  month?: number;
  dailyStatusMap?: Map<string, DayCounts>;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onSelectDate?: (date: string) => void;
}

function buildWeeks(viewMonth: dayjs.Dayjs) {
  const firstDay = viewMonth.startOf("month");
  const lastDay = viewMonth.endOf("month");

  const startOffset = firstDay.day();
  const totalDays = lastDay.date();

  const days: (dayjs.Dayjs | null)[] = [];

  for (let i = 0; i < startOffset; i++) days.push(null);

  for (let d = 1; d <= totalDays; d++) {
    days.push(viewMonth.date(d));
  }

  const weeks: (dayjs.Dayjs | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

export default function Calendar({
  year,
  month,
  dailyStatusMap,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => dayjs().startOf("month"));
  const weeks = useMemo(() => buildWeeks(viewMonth), [viewMonth]);
  const getKey = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");

  useEffect(() => {
    if (!year || !month) return;
    const next = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).startOf("month");
    setViewMonth(next);
  }, [year, month]);

  const handlePrev = () => {
    if (onPrevMonth) onPrevMonth();
    else setViewMonth((prev) => prev.subtract(1, "month").startOf("month"));
  };
  const handleNext = () => {
    if (onNextMonth) onNextMonth();
    else setViewMonth((prev) => prev.add(1, "month").startOf("month"));
  };

  return (
    <div className="rounded-4 border-gray-20 flex w-[768px] flex-col gap-6">
      <div className="mx-auto flex w-[342px] justify-between py-[5px]">
        <button onClick={handlePrev} className="h-6 w-6">
          ◀
        </button>

        <div className="text-2xl font-bold">{viewMonth.format("YYYY년 M월")}</div>

        <button onClick={handleNext} className="h-6 w-6">
          ▶
        </button>
      </div>
      <div className="w-[800px]">
        <div className="grid grid-cols-7">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
            <div
              key={d}
              className="border border-[#E8E8E8] bg-[#FAFAFA] px-3 py-3 font-medium text-[#969696]"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="flex flex-col rounded-lg bg-white">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                const counts: DayCounts | undefined = day
                  ? dailyStatusMap?.get(getKey(day))
                  : undefined;
                const pills =
                  day && counts ? (
                    <div className="mt-2 flex flex-col gap-1">
                      {typeof counts.pending === "number" && counts.pending > 0 && (
                        <div className="inline-flex w-full items-center justify-between rounded-[6px] bg-[#3B82F6]/10 px-2 py-1 text-xs">
                          <span className="font-medium text-[#3B82F6]">예약</span>
                          <span className="font-semibold text-[#3B82F6]">{counts.pending}</span>
                        </div>
                      )}
                      {typeof counts.confirmed === "number" && counts.confirmed > 0 && (
                        <div className="inline-flex w-full items-center justify-between rounded-[6px] bg-[#F59E0B]/10 px-2 py-1 text-xs">
                          <span className="font-medium text-[#F59E0B]">승인</span>
                          <span className="font-semibold text-[#F59E0B]">{counts.confirmed}</span>
                        </div>
                      )}
                      {typeof counts.completed === "number" && counts.completed > 0 && (
                        <div className="inline-flex w-full items-center justify-between rounded-[6px] bg-[#9CA3AF]/10 px-2 py-1 text-xs">
                          <span className="font-medium text-[#6B7280]">완료</span>
                          <span className="font-semibold text-[#6B7280]">{counts.completed}</span>
                        </div>
                      )}
                    </div>
                  ) : null;

                return (
                  <button
                    key={di}
                    type="button"
                    disabled={!day}
                    onClick={() => day && onSelectDate?.(getKey(day))}
                    className="flex h-[150px] flex-col items-start justify-start border border-[#E8E8E8] bg-white px-3 py-3 text-left"
                  >
                    {day && (
                      <>
                        <div className="text-[21px] font-medium text-[#969696]">{day.date()}</div>
                        {pills}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
