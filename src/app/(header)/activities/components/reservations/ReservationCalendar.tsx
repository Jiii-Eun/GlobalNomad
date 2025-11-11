import { format } from "date-fns";
import { enUS, type Locale } from "date-fns/locale";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../calendar/Calendar.css";
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
  fullyReservedDates: Set<string>;
  setCalendarMonth: (d: Date) => void;
  setSelectedDate: (d: Date) => void;
}

export default function ReservationCalendar({
  isLoggedIn,
  calendarMonth,
  selectedDate,
  availableSet,
  pendingDatesSet,
  fullyReservedDates,
  setCalendarMonth: onMonthChange,
  setSelectedDate: onSelect,
}: CalendarProps) {
  return (
    <>
      <p className={cn("text-brand-nomad-black my-4 text-xl font-bold", "tablet:hidden")}>날짜</p>

      <div className="flex justify-center">
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
            if (pendingDatesSet.has(key) || fullyReservedDates.has(key)) return "rdp-pending";
            if (availableSet.has(key)) return "rdp-available";
            return "rdp-unavailable";
          }}
          renderDayContents={(day, date) => {
            const key = format(date, "yyyy-MM-dd");
            const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0);
            const isAvail = availableSet.has(key);
            const isPending = pendingDatesSet.has(key) || fullyReservedDates.has(key);
            const dotClass =
              "pointer-events-none absolute bottom-0.5 inline-block size-1.5 rounded-full tablet:bottom-3 mobile:bottom-1.5";

            return (
              <div className="relative flex h-full items-center justify-center">
                <span>{day}</span>
                {!isPast && isPending && <span className={cn(dotClass, "bg-brand-yellow-500")} />}
                {isAvail && !isPending && <span className={cn(dotClass, "bg-brand-green-500")} />}
                {isPast && !isPending && <span className={cn(dotClass, "bg-brand-gray-300")} />}
              </div>
            );
          }}
          renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
            <div className="flex items-center justify-center gap-20">
              <button
                type="button"
                onClick={decreaseMonth}
                className="rounded px-2 py-1 text-lg hover:bg-gray-100"
              >
                ‹
              </button>
              <div className="text-lg font-semibold select-none">{format(date, "yyyy.MM")}</div>
              <button
                type="button"
                onClick={increaseMonth}
                className="rounded px-2 py-1 text-lg hover:bg-gray-100"
              >
                ›
              </button>
            </div>
          )}
        />
      </div>
    </>
  );
}
