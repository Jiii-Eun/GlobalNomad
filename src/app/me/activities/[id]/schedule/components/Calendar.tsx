"use client";
import { useMemo, useState } from "react";
import dayjs from "dayjs";

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

export default function Calendar() {
  const [viewMonth, setViewMonth] = useState(() => dayjs().startOf("month"));
  const weeks = useMemo(() => buildWeeks(viewMonth), [viewMonth]);

  return (
    <div className="rounded-4 border-gray-20 flex w-[768px] flex-col gap-6">
      <div className="mx-auto flex w-[342px] justify-between py-[5px]">
        <button
          onClick={() => setViewMonth((prev) => prev.subtract(1, "month").startOf("month"))}
          className="h-6 w-6"
        >
          ◀
        </button>

        <div className="text-2xl font-bold">{viewMonth.format("YYYY년 M월")}</div>

        <button
          onClick={() => setViewMonth((prev) => prev.add(1, "month").startOf("month"))}
          className="h-6 w-6"
        >
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
              {week.map((day, di) => (
                <div key={di} className="h-[150px] border border-[#E8E8E8] bg-white px-3 py-3">
                  {day && (
                    <div className="text-[21px] font-medium text-[#969696]">{day.date()}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
