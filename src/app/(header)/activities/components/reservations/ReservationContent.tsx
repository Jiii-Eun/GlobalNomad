// ReservationContent.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
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

import ReservationWrap from "./ReservationWrap";
import ParticipantsCounter from "../participants/ParticipantsCounter";

// ---------- Props ----------
export interface Schedule {
  id: number;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}
export interface ReservationContentProps {
  activityId: number;
  title: string; // 시그니처 유지용
  price: number;
  schedules?: Schedule[];
  pendingDates?: string[]; // 나의 '대기(pending)' 날짜들
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

type JsonRec = Record<string, unknown>;
const isRec = (v: unknown): v is JsonRec => typeof v === "object" && v !== null;
const getIn = (obj: unknown, path: string[]): unknown => {
  let cur: unknown = obj;
  for (const k of path) {
    if (!isRec(cur)) return undefined;
    cur = (cur as JsonRec)[k];
  }
  return cur;
};
// 로컬 에러 표준화 (any 금지)
function toStatusAndMessage(err: unknown): { status?: number; message: string } {
  const status =
    (typeof getIn(err, ["status"]) === "number" ? (getIn(err, ["status"]) as number) : undefined) ??
    (typeof getIn(err, ["response", "status"]) === "number"
      ? (getIn(err, ["response", "status"]) as number)
      : undefined) ??
    (typeof getIn(err, ["payload", "status"]) === "number"
      ? (getIn(err, ["payload", "status"]) as number)
      : undefined);

  const messageFromError = err instanceof Error ? err.message : undefined;
  const message =
    messageFromError ??
    (typeof getIn(err, ["message"]) === "string"
      ? (getIn(err, ["message"]) as string)
      : undefined) ??
    (typeof getIn(err, ["response", "data", "message"]) === "string"
      ? (getIn(err, ["response", "data", "message"]) as string)
      : undefined) ??
    (typeof getIn(err, ["payload", "message"]) === "string"
      ? (getIn(err, ["payload", "message"]) as string)
      : undefined) ??
    "요청 중 오류가 발생했습니다.";

  return { status, message };
}

// ---------- Component ----------
interface SelectedSlot {
  date: string;
  slot: ScheduleSlot;
}

export default function ReservationContent({
  activityId,
  title: _title,
  price,
  schedules,
  pendingDates = [],
}: ReservationContentProps) {
  const router = useRouter();
  const { openToast } = useToastProvider();
  const { showToast } = useToast();
  const { mutateAsync, isPending } = useCreateReservation(activityId);

  // 1) 최초: 가장 최신 예약 가능 날짜의 월로 달력 오픈
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [didInitMonth, setDidInitMonth] = useState(false);

  useEffect(() => {
    if (didInitMonth || !schedules?.length) return;
    const latest = schedules
      .map((s) => parseISO(s.date))
      .reduce((max, cur) => (isAfter(cur, max) ? cur : max), parseISO(schedules[0].date));
    setCalendarMonth(startOfMonth(latest));
    setDidInitMonth(true);
  }, [schedules, didInitMonth]);

  // 2) 월별 가능일 조회
  const year = format(calendarMonth, "yyyy");
  const month = format(calendarMonth, "MM");
  const { data: monthlyAvailable } = useAvailableSchedule(activityId, year, month);

  // 3) 선택 상태
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [members, setMembers] = useState(1);
  const [reserved, setReserved] = useState(false);

  // 4) 현재 달의 예약 가능 일자 Set
  const availableSet = useMemo(() => {
    if (monthlyAvailable?.length) return new Set(monthlyAvailable.map((g) => g.date));
    const fromProp =
      schedules
        ?.filter((s) => format(parseISO(s.date), "yyyyMM") === `${year}${month}`)
        .map((s) => s.date) ?? [];
    return new Set(fromProp);
  }, [monthlyAvailable, schedules, year, month]);

  // (전역) 선택 가능한 날짜가 하나라도 있는가? (오늘 이후 기준)
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const hasSelectableDates = useMemo(() => {
    const fromHookDates = (monthlyAvailable ?? []).map((g) => g.date);
    const fromPropDates = (schedules ?? []).map((s) => s.date);
    const all = Array.from(new Set([...fromHookDates, ...fromPropDates]));
    return all.some((d) => d >= todayStr);
  }, [monthlyAvailable, schedules, todayStr]);

  // 나의 '대기(pending)' 날짜
  const pendingDatesSet = useMemo(() => new Set(pendingDates ?? []), [pendingDates]);

  // 5) 선택한 날짜의 시간 슬롯
  const ymd = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const isSelectedDatePending = selectedDate
    ? pendingDatesSet.has(format(selectedDate, "yyyy-MM-dd"))
    : false;

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

  // pending 날짜면 시간 초기화
  useEffect(() => {
    if (isSelectedDatePending && selectedSlots.length > 0) setSelectedSlots([]);
  }, [isSelectedDatePending, selectedSlots.length]);

  // 6) 슬롯 다중 선택
  const toggleSlot = (date: Date, slot: ScheduleSlot) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.date === dateStr && s.slot.id === slot.id);
      return exists
        ? prev.filter((s) => !(s.date === dateStr && s.slot.id === slot.id))
        : [...prev, { date: dateStr, slot }];
    });
  };

  // 7) 예약 실행 (로컬 토스트로만 처리)
  const handleReserve = async () => {
    const disabled = reserved || isPending || !hasSelectableDates || selectedSlots.length === 0;
    if (disabled) return;

    try {
      const results = await Promise.allSettled(
        selectedSlots.map(({ slot }) => mutateAsync({ scheduleId: slot.id, headCount: members })),
      );

      const firstRejected = results.find((r) => r.status === "rejected") as
        | PromiseRejectedResult
        | undefined;

      if (firstRejected) {
        const { status, message } = toStatusAndMessage(firstRejected.reason);

        if (status === 409) {
          showToast("reserveReject");
          return;
        }
        if (status === 401) {
          openToast(<Toast message="로그인이 필요합니다." icon="error" />);
          router.push("/login");
          return;
        }
        if (status === 404) {
          router.push("/not-found");
          return;
        }
        if (status === 500) {
          openToast(<Toast message="서버 오류가 발생했습니다." icon="error" />);
          return;
        }
        openToast(<Toast message={message} icon="error" />);
        return;
      }

      setReserved(true);
      showToast("reserveDone");
    } catch (e) {
      const { status, message } = toStatusAndMessage(e);

      if (status === 409) {
        showToast("reserveReject");
        return;
      }
      if (status === 401) {
        openToast(<Toast message="로그인이 필요합니다." icon="error" />);
        router.push("/login");
        return;
      }
      if (status === 404) {
        router.push("/not-found");
        return;
      }
      if (status === 500) {
        openToast(<Toast message="서버 오류가 발생했습니다." icon="error" />);
        return;
      }
      openToast(<Toast message={message} icon="error" />);
    }
  };

  const totalAmount = price * members * selectedSlots.length;
  const isReserveDisabled =
    reserved ||
    isPending ||
    isSelectedDatePending ||
    selectedSlots.length === 0 ||
    !hasSelectableDates;

  // ---------- Render ----------
  return (
    <ReservationWrap>
      {/* 가격 */}
      <div className="flex items-center gap-2">
        <p className="text-brand-black text-3xl font-bold">{currency(price)}</p>
        <p className="text-brand-gray-900 text-xl">/ 인</p>
      </div>

      {/* 날짜 선택 */}
      <div className="mt-4 border-t border-[#DDDDDD]">
        <p className="text-brand-nomad-black mt-4 mb-4 text-xl font-bold">날짜</p>
        <div className="flex justify-center">
          <DatePicker
            inline
            autoComplete="off"
            locale={customLocale}
            minDate={new Date()}
            openToDate={calendarMonth}
            selected={selectedDate}
            onChange={(d) => {
              setSelectedDate(d);
              if (d && pendingDatesSet.has(format(d, "yyyy-MM-dd"))) setSelectedSlots([]);
            }}
            onMonthChange={(d) => setCalendarMonth(d)}
            onYearChange={(d) => setCalendarMonth(d)}
            showDisabledMonthNavigation
            filterDate={(d) => availableSet.has(format(d, "yyyy-MM-dd"))}
            highlightDates={[
              ...((
                monthlyAvailable?.map((g) => parseISO(g.date)) ??
                schedules
                  ?.filter((s) => format(parseISO(s.date), "yyyyMM") === `${year}${month}`)
                  .map((s) => parseISO(s.date)) ??
                []
              ).length
                ? [
                    {
                      "rdp-available":
                        monthlyAvailable?.map((g) => parseISO(g.date)) ??
                        schedules
                          ?.filter((s) => format(parseISO(s.date), "yyyyMM") === `${year}${month}`)
                          .map((s) => parseISO(s.date)) ??
                        [],
                    },
                  ]
                : []),
            ]}
            dayClassName={(d) =>
              availableSet.has(format(d, "yyyy-MM-dd")) ? "rdp-available" : "rdp-unavailable"
            }
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
            renderDayContents={(day, date) => {
              const key = format(date, "yyyy-MM-dd");
              const isAvail = availableSet.has(key);
              return (
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <span>{day}</span>
                  {isAvail && (
                    <span className="pointer-events-none absolute bottom-0.5 inline-block h-1.5 w-1.5 rounded-full bg-green-600" />
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* 시간 선택 */}
      <div className="mobile:mt-7 mt-4 flex flex-col gap-3.5">
        <p className="text-brand-nomad-black text-2lg mobile:text-h2 font-bold">예약 가능한 시간</p>

        {!hasSelectableDates ? (
          <div className="text-h4-regular text-brand-nomad-black mb-4">
            예약가능한 시간이 없습니다
          </div>
        ) : isSelectedDatePending ? (
          <div className="text-h4-regular text-brand-nomad-black mb-4">
            이미 예약된 대기 상태입니다.
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
                  className={`mr-[1.2rem] mb-[1.2rem] rounded-lg border px-[1.2rem] py-[1rem] text-base font-medium ${
                    selected
                      ? "bg-brand-nomad-black border-brand-nomad-black text-white"
                      : "text-brand-nomad-black border-brand-nomad-black bg-white"
                  }`}
                  aria-pressed={selected}
                >
                  {slot.startTime}~{slot.endTime}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-h4-regular text-brand-nomad-black mb-4">
            {selectedDate ? "예약가능한 시간이 없습니다" : "날짜를 먼저 선택하세요"}
          </div>
        )}

        {selectedSlots.length > 0 && (
          <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
            <p className="mb-1 font-semibold">선택된 예약 ({selectedSlots.length}개)</p>
            <ul className="list-inside list-disc space-y-1">
              {selectedSlots.map(({ date, slot }) => (
                <li key={`${date}-${slot.id}`}>
                  {date} {slot.startTime}~{slot.endTime}
                </li>
              ))}
            </ul>
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
          isReserveDisabled ? "cursor-not-allowed bg-gray-400" : "bg-[var(--color-brand-black)]"
        }`}
      >
        {reserved ? "예약 완료" : isPending ? "예약 중..." : `예약하기 (${selectedSlots.length}건)`}
      </button>

      {/* 합계 */}
      <div className="border-t-gray200 text-h3-bold text-nomad-black flex justify-between border-t pt-4">
        <p>총 합계</p>
        <div>{currency(totalAmount)}</div>
      </div>
    </ReservationWrap>
  );
}
