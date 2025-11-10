"use client";

import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS, type Locale } from "date-fns/locale";
import { format, parseISO, isAfter, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";

import { useToastProvider } from "@/components/provider/ToastProvider";
import Toast from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast/useToast";
import { useAvailableSchedule, useCreateReservation } from "@/lib/api/activities/hooks";
import type { ScheduleSlot } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";
import { useAuthStatus } from "@/lib/hooks/useAuthStatus"; // ✅ 로그인 상태 확인

import ReservationWrap from "./ReservationWrap";
import type { ReserveSummary } from "./summaryType";
import ParticipantsCounter from "../participants/ParticipantsCounter";

// ---------- Props ----------
export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

// ---------- Utils ----------
const currency = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

const customLocale: Locale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (n: number) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n],
  },
  options: { ...enUS.options, weekStartsOn: 0 },
};

// ---------- Component ----------
interface SelectedSlot {
  date: string;
  slot: ScheduleSlot;
}

export interface ReservationContentProps {
  activityId: number;
  title: string;
  price: number;
  schedules?: Schedule[];
  pendingDates?: string[];

  // 선택 중 요약(모바일 하단 바 기본 노출)
  onSummaryChange?: (s: ReserveSummary) => void;

  // ✅ 예약 확정 후 요약(모바일 하단 바에 "내가 예약한 내역"으로 노출)
  onReservationCommitted?: (s: ReserveSummary) => void;
}

export default function ReservationContent({
  activityId,
  price,
  schedules,
  pendingDates = [],
  onSummaryChange,
  onReservationCommitted,
}: ReservationContentProps) {
  const router = useRouter();
  const { openToast } = useToastProvider();
  const { showToast } = useToast();
  const { mutateAsync, isPending } = useCreateReservation(activityId);
  const { isLoggedIn } = useAuthStatus(); // ✅ 로그인 상태 확인

  // ✅ 예약 완료 날짜 Set
  const pendingDatesSet = useMemo(() => new Set(pendingDates), [pendingDates]);

  // ---------- 상태 ----------
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [didInitMonth, setDidInitMonth] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [members, setMembers] = useState(1);
  const [reserved, setReserved] = useState(false);

  // ✅ 예약 완료 후 초기화
  useEffect(() => {
    if (reserved) {
      setSelectedDate(null);
      setSelectedSlots([]);
      setMembers(1);
      setReserved(false);
    }
  }, [reserved]);

  // ---------- 달력 초기 설정 ----------
  useEffect(() => {
    if (didInitMonth || !schedules?.length) return;
    const latest = schedules
      .map((s) => parseISO(s.date))
      .reduce((max, cur) => (isAfter(cur, max) ? cur : max), parseISO(schedules[0].date));
    setCalendarMonth(startOfMonth(latest));
    setDidInitMonth(true);
  }, [schedules, didInitMonth]);

  const year = format(calendarMonth, "yyyy");
  const month = format(calendarMonth, "MM");
  const { data: monthlyAvailable } = useAvailableSchedule(activityId, year, month);

  const availableSet = useMemo(() => {
    const fromHook = monthlyAvailable?.map((g) => g.date) ?? [];
    const fromProp =
      schedules
        ?.filter((s) => format(parseISO(s.date), "yyyyMM") === `${year}${month}`)
        .map((s) => s.date) ?? [];
    return new Set([...fromHook, ...fromProp]);
  }, [monthlyAvailable, schedules, year, month]);

  // ---------- 슬롯 처리 ----------
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

  const toggleSlot = (date: Date, slot: ScheduleSlot) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.date === dateStr && s.slot.id === slot.id);
      return exists
        ? prev.filter((s) => !(s.date === dateStr && s.slot.id === slot.id))
        : [...prev, { date: dateStr, slot }];
    });
  };

  // ---------- 예약 실행 ----------
  const handleReserve = async () => {
    if (!isLoggedIn) {
      openToast(<Toast message="로그인이 필요합니다." icon="error" />);
      router.push("/login");
      return;
    }

    if (selectedSlots.length === 0 || isPending) return;

    try {
      await Promise.allSettled(
        selectedSlots.map(({ slot }) => mutateAsync({ scheduleId: slot.id, headCount: members })),
      );
      setReserved(true);
      showToast("reserveDone");
    } catch {
      showToast("reserveReject");
    }
  };

  const totalAmount = price * members * selectedSlots.length;
  const isReserveDisabled = reserved || isPending || selectedSlots.length === 0;

  // ✅ 하단바 요약에 뿌릴 데이터 계산 & 통지
  useEffect(() => {
    const count = selectedSlots.length;
    const totalPrice = count === 0 ? price * 1 : price * members * count;
    const totalMembers = count === 0 ? 1 : members * count;

    let dateText: string | undefined;
    let timeText: string | undefined;
    if (selectedDate && count > 0) {
      dateText = format(selectedDate, "yyyy-MM-dd");
      if (count === 1) {
        const only = selectedSlots[0].slot;
        timeText = `${only.startTime}~${only.endTime}`;
      } else {
        const first = selectedSlots[0].slot;
        timeText = `${first.startTime}~${first.endTime} 외 ${count - 1}건`;
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

  // ---------- 렌더 ----------
  return (
    <ReservationWrap>
      {/* 가격 */}
      <div className="flex items-center gap-2">
        <p className="text-brand-black text-3xl font-bold">{currency(price)}</p>
        <p className="text-brand-gray-900 text-xl">/ 인</p>
      </div>

      {/* 날짜 선택 */}
      <div className="border-brand-gray-300 mt-4 border-t">
        <p className="text-brand-nomad-black mt-4 mb-4 text-xl font-bold">날짜</p>
        <div className="flex justify-center">
          <DatePicker
            inline
            autoComplete="off"
            locale={customLocale}
            disabled={!isLoggedIn} // ✅ 로그인 안된 경우 달력 비활성화
            minDate={new Date()}
            openToDate={calendarMonth}
            selected={selectedDate}
            onChange={(d) => {
              if (!isLoggedIn) return;
              setSelectedDate(d);
            }}
            onMonthChange={setCalendarMonth}
            onYearChange={setCalendarMonth}
            dayClassName={(d) => {
              const key = format(d, "yyyy-MM-dd");
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (d.getTime() < today.getTime()) return "rdp-past"; // 지난 날짜
              if (pendingDatesSet.has(key)) return "rdp-pending"; // ✅ 회색 처리
              if (availableSet.has(key)) return "rdp-available";
              return "rdp-unavailable";
            }}
            renderDayContents={(day, date) => {
              const key = format(date, "yyyy-MM-dd");
              const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0);
              const isAvail = availableSet.has(key);
              const isPending = pendingDatesSet.has(key);

              const dotClass =
                "pointer-events-none absolute bottom-1 inline-block size-1.5 rounded-full";

              return (
                <div className="relative flex items-center justify-center">
                  <span>{day}</span>

                  {/* ✅ 이미 예약된 날짜 표시 (노란 점) */}
                  {!isPast && isPending && <span className={cn(dotClass, "bg-brand-yellow-500")} />}

                  {/* ✅ 예약 가능한 날짜 표시 (초록 점) */}
                  {isAvail && !isPending && <span className={cn(dotClass, "bg-brand-green-500")} />}

                  {/* 지난 날짜 표시 (회색 점) */}
                  {isPast && <span className={cn(dotClass, "bg-brand-gray-300")} />}
                </div>
              );
            }}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              decreaseYear,
              increaseYear,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
              prevYearButtonDisabled,
              nextYearButtonDisabled,
            }) => (
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseYear}
                    disabled={prevYearButtonDisabled}
                    className="rounded px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-40"
                    aria-label="이전 년도"
                  >
                    «
                  </button>
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="rounded px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-40"
                    aria-label="이전 달"
                  >
                    ‹
                  </button>
                </div>
                <div className="font-semibold select-none">{format(date, "yyyy.MM")}</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="rounded px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-40"
                    aria-label="다음 달"
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    onClick={increaseYear}
                    disabled={nextYearButtonDisabled}
                    className="rounded px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-40"
                    aria-label="다음 년도"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* 시간 선택 */}
      <div className="mobile:mt-7 mt-4 flex flex-col gap-3.5">
        <p className="text-brand-nomad-black text-2lg mobile:text-h2 font-bold">예약 가능한 시간</p>
        {isSelectedDatePending ? (
          <div className="text-h4-regular text-brand-nomad-black mb-4">
            예약이 모두 완료되어 이용 가능한 시간이 없습니다.
          </div>
        ) : selectedDate && daySlots.length > 0 ? (
          <div className="flex flex-wrap">
            {daySlots.map((slot) => {
              const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
              const selected = selectedSlots.some(
                (s) => s.date === dateStr && s.slot.id === slot.id,
              );
              return (
                <button
                  key={slot.id}
                  onClick={() => selectedDate && toggleSlot(selectedDate, slot)}
                  disabled={isSelectedDatePending}
                  className={`mr-[1.2rem] mb-[1.2rem] rounded-lg border px-[1.2rem] py-[1rem] text-base font-medium ${
                    selected
                      ? "bg-brand-nomad-black border-brand-nomad-black text-white"
                      : "text-brand-nomad-black border-brand-nomad-black bg-white"
                  }`}
                >
                  {slot.startTime} ~ {slot.endTime}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-h4-regular text-brand-nomad-black mb-4">
            {selectedDate ? "예약가능한 시간이 없습니다" : "날짜를 먼저 선택하세요"}
          </div>
        )}
      </div>

      {/* 인원 */}
      <ParticipantsCounter
        count={members}
        handleCountPlus={() => setMembers((n) => n + 1)}
        handleCountMinus={() => setMembers((n) => (n > 1 ? n - 1 : 1))}
      />

      {/* 예약 버튼 */}
      <button
        type="button"
        onClick={handleReserve}
        disabled={isReserveDisabled}
        className={`text-body1-bold my-7 w-full rounded-md px-4 py-[1.4rem] text-white ${
          isReserveDisabled ? "bg-brand-gray-300 cursor-not-allowed" : "bg-brand-black"
        }`}
      >
        {reserved
          ? "예약 완료"
          : isPending
            ? "예약 중..."
            : !isLoggedIn
              ? "로그인이 필요합니다"
              : `예약하기 (${selectedSlots.length}건)`}
      </button>

      {/* 합계 */}
      <div className="border-brand-gray-300 text-h3-bold text-nomad-black flex justify-between border-t pt-4 text-xl font-bold">
        <p className="">총 합계</p>
        <div>{currency(totalAmount)}</div>
      </div>
    </ReservationWrap>
  );
}
