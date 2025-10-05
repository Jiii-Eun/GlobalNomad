import { useState, useRef, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import AddBtnImg from "@/assets/icons/buttons/button-plus.svg";
import RemoveBtnImg from "@/assets/icons/buttons/button-minus.svg";
import CalendarImg from "@/assets/icons/ui/calendar.svg";

interface TimeSlotProps {
  start: Date;
  end: Date;
}
const HOUR = 60 * 60 * 1000;

interface TimeSlotPicker {
  selectDate: Date | null;
  onSelectedDateChange: (date: Date | null) => void;
  slots?: TimeSlotProps[];
  onSlotsChange?: (slots: TimeSlotProps[]) => void;

  minDate?: Date;
}

function buildTimeOptions(forEnd = false): string[] {
  const arr: string[] = [];
  const s = forEnd ? 1 : 0;
  const e = forEnd ? 24 : 23;
  for (let h = s; h <= e; h++) arr.push(h === 24 ? "24:00" : `${String(h).padStart(2, "0")}:00`);
  return arr;
}

function combineDateTime(date: Date, hhmm: string): Date {
  const [hh, mm] = hhmm.split(":").map(Number);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (hh === 24) {
    d.setDate(d.getDate() + 1);
    return d;
  }
  d.setHours(hh, mm, 0, 0);
  return d;
}

function overlaps(a: TimeSlotProps, b: TimeSlotProps) {
  return a.start < b.end && b.start < a.end;
}

function sameLocalDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtDateTime(d: Date) {
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}/${mm}/${dd}`;
}

const TimeSlotPicker: React.FC<TimeSlotPicker> = ({
  selectDate,
  onSelectedDateChange,
  slots: controlledSlots,
  onSlotsChange,
  minDate = new Date(),
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState<TimeSlotProps[]>(controlledSlots ?? []);
  const datePickerRef = useRef<DatePicker>(null);
  const startOptions = useMemo(() => buildTimeOptions(false), []);
  const endOptionsAll = useMemo(() => buildTimeOptions(true), []);
  const endOptions = useMemo(
    () => endOptionsAll.filter((t) => t > startTime),
    [endTime, startTime, endOptionsAll],
  );
  useEffect(() => {
    if (controlledSlots) setSlots(controlledSlots);
  }, [controlledSlots]);

  const updateSlots = (next: TimeSlotProps[]) => {
    setSlots(next);
    onSlotsChange?.(next);
  };

  const handleAdd = () => {
    if (!selectDate) return alert("날짜를 먼저 선택하세요.");

    const start = combineDateTime(selectDate, startTime);
    const end = combineDateTime(selectDate, endTime);

    if (!(start < end)) return alert("시작 시간은 종료 시간보다 이른 시각이어야 합니다.");

    if (start.getMinutes() !== 0 || end.getMinutes() !== 0)
      return alert("시간은 정시(분=00)만 선택 가능합니다.");
    const diff = end.getTime() - start.getTime();
    if (diff < HOUR || diff % HOUR !== 0) return alert("최소 1시간 이상, 1시간 단위로 선택하세요.");

    const sameDay = slots.filter((s) => sameLocalDate(s.start, start));
    if (sameDay.some((s) => overlaps(s, { start, end }))) return alert("기존 시간대와 겹칩니다.");

    const next = [...slots, { start, end }].sort((a, b) => a.start.getTime() - b.start.getTime());
    updateSlots(next);
  };

  const handleRemove = (idx: number) => {
    const next = [...slots];
    next.splice(idx, 1);
    updateSlots(next);
  };

  return (
    <div className="flex w-fit flex-col">
      <div className="flex flex-wrap items-end gap-5">
        <div className="flex flex-col gap-[10px]">
          <label>날짜</label>
          <div className="relative">
            <DatePicker
              ref={datePickerRef}
              className="h-[56px] w-[379px] rounded-[4px] border border-[#79747E] px-4 py-2"
              dateFormat="yy/MM/dd"
              selected={selectDate}
              onChange={onSelectedDateChange}
              minDate={minDate}
              placeholderText="YY/MM/DD"
            />
            <CalendarImg
              className="pointer-events-auto absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 cursor-pointer"
              onClick={() => datePickerRef.current?.setFocus()}
            />
          </div>
        </div>
        <div className="flex items-end">
          <div className="flex flex-col gap-[10px]">
            <label>시작 시간</label>
            <div>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`${startTime ? "text-black" : "text-[#A1A1A1]"} h-[56px] w-[140px] rounded-[4px] border border-[#79747E] px-4 py-1`}
              >
                {startOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="mx-2.5">~</span>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <label>종료 시간</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`${endTime ? "text-black" : "text-[#A1A1A1]"} h-[56px] w-[140px] rounded-[4px] border border-[#79747E] px-4 py-1`}
            >
              {endOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectDate}
          className="hover:opacity-90 disabled:opacity-50"
          title="시간대 추가"
          aria-label="시간대 추가"
        >
          <AddBtnImg className="h-[56px] w-[56px]" />
        </button>
      </div>
      {slots.length > 0 && (
        <div
          className="my-6 h-px w-full bg-[#E5E7EB]"
          role="separator"
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col gap-5">
        {slots.length === 0 && <p className="text-[13px] text-gray-500">추가된 시간이 없습니다.</p>}

        {slots.map((slot, idx) => (
          <div
            key={`${slot.start.toISOString()}-${slot.end.toISOString()}`}
            className="flex items-center gap-5"
          >
            <input
              readOnly
              value={fmtDateTime(slot.start)}
              className="h-[56px] w-[379px] rounded-[4px] border border-[#79747E] px-4 py-2"
            />
            <div>
              <input
                readOnly
                value={`${String(slot.start.getHours()).padStart(2, "0")}:00`}
                className="h-[56px] w-[140px] rounded-[4px] border border-[#79747E] px-4 py-1"
              />
              <span className="mx-2.5">~</span>
              <input
                readOnly
                value={`${String(slot.end.getHours()).padStart(2, "0")}:${String(
                  slot.end.getMinutes(),
                ).padStart(2, "0")}`}
                className="h-[56px] w-[140px] rounded-[4px] border border-[#79747E] px-4 py-1"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="hover:opacity-90 disabled:opacity-50"
              title="시간대 삭제"
              aria-label="시간대 삭제"
            >
              <RemoveBtnImg className="h-[56px] w-[56px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
