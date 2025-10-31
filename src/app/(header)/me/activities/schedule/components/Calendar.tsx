"use client";
import dayjs from "dayjs";
import { useEffect, useMemo, useState, useRef } from "react";

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
  onSelectDate?: (date: string, anchor?: HTMLButtonElement) => void;
  onChangeMonth?: (year: number, month: number) => void;
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
  onChangeMonth,
}: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => dayjs().startOf("month"));
  const [openPicker, setOpenPicker] = useState(false);
  const [tempYear, setTempYear] = useState<number>(viewMonth.year());
  const [tempMonth, setTempMonth] = useState<number>(viewMonth.month() + 1);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const weeks = useMemo(() => buildWeeks(viewMonth), [viewMonth]);
  const getKey = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");

  useEffect(() => {
    if (!year || !month) return;
    const next = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).startOf("month");
    setViewMonth(next);
    setTempYear(next.year());
    setTempMonth(next.month() + 1);
  }, [year, month]);

  useEffect(() => {
    if (!openPicker) return;
    const onDocClick = (e: MouseEvent) => {
      if (!pickerRef.current) return;
      if (!pickerRef.current.contains(e.target as Node)) {
        setOpenPicker(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [openPicker]);

  const handlePrev = () => {
    if (onPrevMonth) onPrevMonth();
    else setViewMonth((prev) => prev.subtract(1, "month").startOf("month"));
  };
  const handleNext = () => {
    if (onNextMonth) onNextMonth();
    else setViewMonth((prev) => prev.add(1, "month").startOf("month"));
  };

  const years = useMemo(() => {
    const base = year ?? viewMonth.year();
    const list: number[] = [];
    for (let y = base - 5; y <= base + 5; y++) list.push(y);
    return list;
  }, [year, viewMonth]);

  const applyMonth = (y: number, m: number) => {
    if (onChangeMonth) {
      onChangeMonth(y, m);
    } else {
      setViewMonth(dayjs(`${y}-${String(m).padStart(2, "0")}-01`).startOf("month"));
    }
    setOpenPicker(false);
  };

  return (
    <div className="rounded-4 border-gray-20 flex w-[768px] flex-col gap-6">
      <div className="mx-auto flex w-[342px] items-center justify-between py-[5px]">
        <button onClick={handlePrev} className="h-6 w-6">
          ◀
        </button>

        <div className="relative">
          <button
            type="button"
            className="text-2xl font-bold"
            onClick={() => setOpenPicker((v) => !v)}
            aria-haspopup="dialog"
            aria-expanded={openPicker}
            aria-label="년월 선택"
          >
            {viewMonth.format("YYYY년 M월")}
          </button>
          {openPicker && (
            <div
              ref={pickerRef}
              role="dialog"
              aria-modal="true"
              className="absolute left-1/2 z-50 w-[280px] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <select
                  className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                  value={tempYear}
                  onChange={(e) => setTempYear(Number(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = i + 1;
                  const active = tempYear === viewMonth.year() && m === viewMonth.month() + 1;
                  return (
                    <button
                      key={m}
                      type="button"
                      className={
                        "rounded px-2 py-2 text-sm " + (active ? "bg-black text-white" : "bg-white")
                      }
                      onClick={() => {
                        setTempMonth(m);
                        applyMonth(tempYear, m);
                      }}
                    >
                      {m}월
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

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
                    <div className="flex w-full flex-col">
                      {typeof counts.pending === "number" && counts.pending > 0 && (
                        <div className="rounded-4 w-full items-center justify-between bg-[#3B82F6]/10 px-1 py-[3px] text-[14px]">
                          <span className="font-medium text-[#3B82F6]">예약</span>
                          <span className="font-semibold text-[#3B82F6]">{counts.pending}</span>
                        </div>
                      )}
                      {typeof counts.confirmed === "number" && counts.confirmed > 0 && (
                        <div className="rounded-4 w-full items-center justify-between bg-[#F59E0B]/10 px-1 py-[3px] text-[14px]">
                          <span className="font-medium text-[#F59E0B]">승인</span>
                          <span className="font-semibold text-[#F59E0B]">{counts.confirmed}</span>
                        </div>
                      )}
                      {typeof counts.completed === "number" && counts.completed > 0 && (
                        <div className="rounded-4 flex w-full items-center gap-0.5 bg-[#9CA3AF]/10 px-1 py-[3px] text-[14px]">
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
                    onClick={(e) =>
                      day && onSelectDate?.(getKey(day), e.currentTarget as HTMLButtonElement)
                    }
                    className="flex h-[150px] flex-col items-start justify-start border border-[#E8E8E8] bg-white text-left"
                  >
                    {day && (
                      <>
                        <div className="px-3 py-3 text-[21px] font-medium text-[#969696]">
                          {day.date()}
                        </div>
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
