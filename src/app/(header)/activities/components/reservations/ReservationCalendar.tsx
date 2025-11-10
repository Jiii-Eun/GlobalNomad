import { format } from "date-fns";
import { enUS, type Locale } from "date-fns/locale";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/cn";

const customLocale: Locale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (n: number) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n],
  },
  options: { ...enUS.options, weekStartsOn: 0 },
};

export interface CalendarProps {
  isLoggedIn: boolean;
  calendarMonth: Date;
  selectedDate: Date | null;
  availableSet: Set<string>;
  pendingDatesSet: Set<string>;
  setCalendarMonth: (d: Date) => void;
  setSelectedDate: (d: Date) => void;
}

export default function ReservationCalendar({
  isLoggedIn,
  calendarMonth,
  selectedDate,
  availableSet,
  pendingDatesSet,
  setCalendarMonth: onMonthChange,
  setSelectedDate: onSelect,
}: CalendarProps) {
  return (
    <div className={cn("border-brand-gray-300 mt-4 border-t", "mobile:border-0")}>
      <p className={cn("text-brand-nomad-black my-4 text-xl font-bold", "mobile:my-0")}>날짜</p>

      <div className="flex w-full justify-center">
        <div className="w-full max-w-[320px]">
          <DatePicker
            inline
            autoComplete="off"
            locale={customLocale}
            disabled={!isLoggedIn}
            minDate={new Date()}
            openToDate={calendarMonth}
            selected={selectedDate}
            onChange={(d) => isLoggedIn && d && onSelect(d)}
            onMonthChange={onMonthChange}
            dayClassName={(d) => {
              const key = format(d, "yyyy-MM-dd");
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (d.getTime() < today.getTime()) return "rdp-past";
              if (pendingDatesSet.has(key)) return "rdp-pending";
              if (availableSet.has(key)) return "rdp-available";
              return "rdp-unavailable";
            }}
            renderDayContents={(day, date) => {
              const key = format(date, "yyyy-MM-dd");
              const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0);
              const isAvail = availableSet.has(key);
              const isPending = pendingDatesSet.has(key);
              const dotClass =
                "pointer-events-none absolute bottom-0.5 inline-block size-1.5 rounded-full";

              return (
                <div className="relative flex items-center justify-center">
                  <span>{day}</span>
                  {!isPast && isPending && <span className={cn(dotClass, "bg-brand-yellow-500")} />}
                  {isAvail && !isPending && <span className={cn(dotClass, "bg-brand-green-500")} />}
                  {isPast && <span className={cn(dotClass, "bg-brand-gray-300")} />}
                </div>
              );
            }}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className="mb-2 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={decreaseMonth}
                  className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                >
                  ‹
                </button>
                <div className="font-semibold select-none">{format(date, "yyyy.MM")}</div>
                <button
                  type="button"
                  onClick={increaseMonth}
                  className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                >
                  ›
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
