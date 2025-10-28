"use client";

import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

import Calendar from "@/app/me/activities/schedule/components/Calendar";
import { Arrow } from "@/components/icons";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerLayout } from "@/components/ui/modal";
import { getReservations, updateReservationStatus } from "@/lib/api/my-activities/api";
import {
  useReservationDashboard,
  useMyActivities,
  useReservedSchedule,
} from "@/lib/api/my-activities/hooks";
import type {
  GetReservationsRes,
  Reservation,
  ReservedScheduleItem,
} from "@/lib/api/my-activities/types";

export default function Schedule() {
  const queryClient = useQueryClient();
  const { data: myActs } = useMyActivities({ size: 5 });
  const activityOtions =
    myActs?.activities.map((act) => ({ value: act.id, label: act.title })) ?? [];
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const drawerBtnRef = useRef<HTMLButtonElement | null>(null);
  const [activityId, setActivityId] = useState<number | "">("");
  const [viewMonth, setViewMonth] = useState(() => dayjs());
  const year = String(viewMonth.year());
  const month = String(viewMonth.month() + 1);

  const calendarWrapRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelTop, setPanelTop] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { data: monthDash, isFetching } = useReservationDashboard(
    Number(activityId || 0),
    year,
    month,
    false,
    { enabled: !!activityId },
  );

  const dailyStatusMap = useMemo(() => {
    const map = new Map<string, { pending: number; confirmed: number; completed: number }>();
    (monthDash ?? []).forEach((d) => {
      map.set(d.date, {
        pending: d.reservations.pending ?? 0,
        confirmed: d.reservations.confirmed ?? 0,
        completed: d.reservations.completed ?? 0,
      });
    });
    return map;
  }, [monthDash]);

  const [openDate, setOpenDate] = useState<string | null>(null);
  const { data: daySlots } = useReservedSchedule(
    activityId && openDate
      ? { activityId: Number(activityId), date: openDate }
      : { activityId: 0, date: "" },
    !(activityId && openDate),
  );

  type TabKey = "pending" | "confirmed" | "declined";
  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  const [slotLists, setSlotLists] = useState<
    Record<
      number,
      {
        pending: Reservation[];
        confirmed: Reservation[];
        declined: Reservation[];
      }
    >
  >({});

  const dayTotals = useMemo(() => {
    const totals = { pending: 0, confirmed: 0, declined: 0 };
    (daySlots ?? []).forEach((s) => {
      totals.pending += s.count?.pending ?? 0;
      totals.confirmed += s.count?.confirmed ?? 0;
      totals.declined += s.count?.declined ?? 0;
    });
    return totals;
  }, [daySlots]);

  const tabLabel = useCallback(
    (k: "pending" | "confirmed" | "declined") => {
      const name = k === "pending" ? "신청" : k === "confirmed" ? "승인" : "거절";
      const n = dayTotals[k] ?? 0;
      return n > 0 ? `${name} ${n}` : name;
    },
    [dayTotals],
  );

  const refreshDashboard = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["reservationDashboard", Number(activityId || 0), year, month],
    });
  }, [queryClient, activityId, year, month]);

  async function decline(reservation: Reservation) {
    await updateReservationStatus({
      activityId: reservation.activityId,
      reservationId: reservation.id,
      status: "declined",
    });
    setSlotLists((prev) => {
      const list = prev[reservation.scheduleId];
      if (!list) return prev;
      return {
        ...prev,
        [reservation.scheduleId]: {
          ...list,
          pending: list.pending.filter((r) => r.id !== reservation.id),
          confirmed: list.confirmed.filter((r) => r.id !== reservation.id),
          declined: [reservation, ...list.declined],
        },
      };
    });

    refreshDashboard();
  }

  async function confirmAndAutoDecline(target: Reservation) {
    await updateReservationStatus({
      activityId: target.activityId,
      reservationId: target.id,
      status: "confirmed",
    });

    const others = [
      ...(slotLists[target.scheduleId]?.pending ?? []),
      ...(slotLists[target.scheduleId]?.confirmed ?? []),
    ].filter((r) => r.id !== target.id);

    await Promise.all(
      others.map((r) =>
        updateReservationStatus({
          activityId: r.activityId,
          reservationId: r.id,
          status: "declined",
        }),
      ),
    );

    setSlotLists((prev) => {
      const cur = prev[target.scheduleId];
      if (!cur) return prev;
      const confirmed = [target, ...cur.confirmed.filter((r) => r.id !== target.id)];
      const declined = [...cur.declined, ...others];
      return {
        ...prev,
        [target.scheduleId]: { pending: [], confirmed, declined },
      };
    });

    refreshDashboard();
  }

  useEffect(() => {
    if (!openDate) return;
    if (!daySlots || daySlots.length === 0) {
      setSelectedScheduleId(null);
      return;
    }
    setSelectedScheduleId((prev) => {
      const exists = daySlots.some((s) => s.scheduleId === prev);
      return exists ? prev : daySlots[0].scheduleId;
    });
  }, [openDate, daySlots]);

  useEffect(() => {
    if (!activityId || !openDate || !selectedScheduleId) return;

    (async () => {
      const [pending, confirmed, declined] = await Promise.all([
        getReservations({
          activityId: Number(activityId),
          scheduleId: selectedScheduleId,
          status: "pending",
          size: 50,
        }),
        getReservations({
          activityId: Number(activityId),
          scheduleId: selectedScheduleId,
          status: "confirmed",
          size: 50,
        }),
        getReservations({
          activityId: Number(activityId),
          scheduleId: selectedScheduleId,
          status: "declined",
          size: 50,
        }),
      ]);

      setSlotLists((prev) => ({
        ...prev,
        [selectedScheduleId]: {
          pending: pending.reservations,
          confirmed: confirmed.reservations,
          declined: declined.reservations,
        },
      }));
    })();
  }, [activityId, openDate, selectedScheduleId]);

  const hasConfirmed = useMemo(() => {
    if (!selectedScheduleId) return false;

    const localCount = slotLists[selectedScheduleId]?.confirmed.length ?? 0;
    const serverCount =
      daySlots?.find((x) => x.scheduleId === selectedScheduleId)?.count.confirmed ?? 0;

    return localCount > 0 || serverCount > 0;
  }, [selectedScheduleId, slotLists, daySlots]);

  useEffect(() => {
    if (!openDate || !selectedScheduleId) return;

    const timer = setInterval(async () => {
      const s = (daySlots ?? []).find((x) => x.scheduleId === selectedScheduleId);
      if (!s) return;

      const end = dayjs(`${openDate} ${s.endTime}:00`);
      if (dayjs().isBefore(end)) return;

      const lists = slotLists[selectedScheduleId];
      if (!lists || lists.confirmed.length === 0) return;

      await Promise.all(
        lists.confirmed.map((r) =>
          updateReservationStatus({
            activityId: r.activityId,
            reservationId: r.id,
            status: "completed",
          }),
        ),
      );

      setSlotLists((prev) => ({
        ...prev,
        [selectedScheduleId]: { ...prev[selectedScheduleId], confirmed: [] },
      }));

      queryClient.invalidateQueries({
        queryKey: ["reservationDashboard", Number(activityId || 0), year, month],
      });
    }, 60_000);

    return () => clearInterval(timer);
  }, [openDate, selectedScheduleId, daySlots, slotLists, activityId, year, month, queryClient]);

  useEffect(() => {
    if (isMobile || !openDate) return;

    const wrap = calendarWrapRef.current?.getBoundingClientRect();
    const panel = panelRef.current?.getBoundingClientRect();
    if (!wrap || !panel) return;

    const MARGIN = 16;
    const centerTop = (wrap.height - panel.height) / 2;
    const minTop = MARGIN;
    const maxTop = Math.max(MARGIN, wrap.height - panel.height - MARGIN);

    setPanelTop(Math.round(Math.min(Math.max(centerTop, minTop), maxTop)));
  }, [isMobile, openDate, activeTab, selectedScheduleId, daySlots, slotLists, viewMonth]);

  return (
    <>
      <div className="flex w-[792px] flex-col gap-6">
        <div className="flex w-[768px] flex-col gap-8">
          <h1 className="text-3xl font-bold">예약 현황</h1>
          <Field id="activity" className="h-20">
            <Input
              as="select"
              id="activity"
              className="rounded-4 appearance-none border border-gray-400 bg-white"
              rightIcon={<Arrow.Down className="h-6 w-6" />}
              placeholderOption="내 체험 선택"
              options={activityOtions}
              value={activityId}
              onChange={(e) => setActivityId(Number((e.target as HTMLSelectElement).value))}
            ></Input>
          </Field>
        </div>
        <div ref={calendarWrapRef} className="relative w-[800px]">
          <Calendar
            dailyStatusMap={dailyStatusMap}
            year={Number(year)}
            month={Number(month)}
            onPrevMonth={() => setViewMonth((m) => m.subtract(1, "month"))}
            onNextMonth={() => setViewMonth((m) => m.add(1, "month"))}
            onSelectDate={(d) => {
              setOpenDate(d);
              if (isMobile) queueMicrotask(() => drawerBtnRef.current?.click());
            }}
          />
          {!isMobile && openDate && (
            <>
              <div
                className="absolute inset-0 z-40"
                onClick={() => setOpenDate(null)}
                aria-hidden
              />

              <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                className="absolute right-0 z-50 flex min-h-[620px] w-[420px] flex-col gap-4 rounded-3xl border border-gray-200 bg-white px-6 py-7 shadow-lg"
                style={{ top: Math.max(0, panelTop) }}
              >
                <div className="border-brand-gray-200 flex flex-col gap-10 border-b">
                  <div className="flex justify-between">
                    <div className="text-2xl font-bold">예약 정보</div>
                    <button
                      type="button"
                      className="rounded text-2xl hover:bg-gray-100"
                      onClick={() => setOpenDate(null)}
                      aria-label="닫기"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex gap-3">
                    {(["pending", "confirmed", "declined"] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        className={`rounded px-3 py-1 text-xl ${activeTab === k ? "bg-black text-white" : "bg-white"}`}
                        onClick={() => setActiveTab(k)}
                      >
                        {tabLabel(k)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="text-xl font-semibold">예약 날짜</div>
                  <div className="flex flex-col">
                    <div className="text-xl">{openDate}</div>
                    <Field id="slot" className="h-20">
                      <Input
                        as="select"
                        id="slot"
                        className="rounded-4 appearance-none border border-gray-400 bg-white"
                        rightIcon={<Arrow.Down className="h-6 w-6" />}
                        placeholderOption="시간 선택"
                        options={(daySlots ?? []).map((s) => ({
                          value: s.scheduleId,
                          label: `${s.startTime} ~ ${s.endTime}`,
                        }))}
                        value={selectedScheduleId ?? ""}
                        disabled={!daySlots || daySlots.length === 0}
                        onChange={(e) => {
                          const v = (e.target as HTMLSelectElement).value;
                          setSelectedScheduleId(v === "" ? null : Number(v));
                        }}
                      />
                    </Field>
                  </div>
                  {selectedScheduleId && (
                    <div className="flex flex-col gap-4">
                      <span className="text-xl font-semibold">예약 내역</span>

                      <ul className="flex flex-col gap-3.5">
                        {(slotLists[selectedScheduleId]?.[activeTab] ?? []).map((r) => (
                          <li
                            key={r.id}
                            className="rounded-4 border-brand-gray-300 flex h-[116px] justify-between border px-4 py-2"
                          >
                            <div className="flex flex-col gap-2.5">
                              <div className="text-brand-gray-600 font-semibold">
                                닉네임 <span className="font-medium text-black">{r.nickname}</span>
                              </div>
                              <div className="text-brand-gray-600 font-semibold">
                                인원 <span className="font-medium text-black">{r.headCount}명</span>
                              </div>
                            </div>
                            <div className="flex items-end gap-2">
                              {activeTab === "pending" && (
                                <button
                                  className="text-md h-fit w-fit rounded bg-black px-5 py-2.5 text-center text-white"
                                  disabled={hasConfirmed}
                                  onClick={() => confirmAndAutoDecline(r)}
                                >
                                  승인하기
                                </button>
                              )}
                              {activeTab !== "declined" && (
                                <button
                                  className="text-md h-fit w-fit rounded border px-5 py-2.5 text-center"
                                  onClick={() => decline(r)}
                                >
                                  거절하기
                                </button>
                              )}
                            </div>
                          </li>
                        ))}

                        {(slotLists[selectedScheduleId]?.[activeTab] ?? []).length === 0 && (
                          <li className="rounded bg-gray-50 px-3 py-6 text-center text-sm text-gray-500">
                            내역이 없습니다.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-2 flex gap-4 text-sm">
          <span>
            완료: {(monthDash ?? []).reduce((a, b) => a + (b.reservations.completed ?? 0), 0)}
          </span>
          <span>
            예약: {(monthDash ?? []).reduce((a, b) => a + (b.reservations.pending ?? 0), 0)}
          </span>
          <span>
            승인: {(monthDash ?? []).reduce((a, b) => a + (b.reservations.confirmed ?? 0), 0)}
          </span>
        </div>
        <DrawerLayout
          trigger={<span ref={drawerBtnRef} className="hidden" />}
          title="예약 정보"
          width="full"
        >
          <DrawerHeader />
          <DrawerBody frameClass="flex flex-col gap-4">
            <Field id="slot" className="h-20">
              <Input
                as="select"
                id="slot"
                className="rounded-4 border border-gray-400 bg-white px-4 py-2"
                placeholderOption="시간 선택"
                options={(daySlots ?? []).map((s) => ({
                  value: s.scheduleId,
                  label: `${s.startTime} ~ ${s.endTime}`,
                }))}
                value={selectedScheduleId ?? ""}
                disabled={!daySlots || daySlots.length === 0}
                onChange={(e) => {
                  const v = (e.target as HTMLSelectElement).value;
                  setSelectedScheduleId(v === "" ? null : Number(v));
                }}
              />
            </Field>
            {openDate && (
              <section className="rounded-4 mt-0 border border-gray-200 bg-white p-4">
                <header className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{openDate} 예약 내역</h2>

                  <div className="flex gap-2">
                    {(["pending", "confirmed", "declined"] as const).map((k) => (
                      <button
                        key={k}
                        className={`rounded px-3 py-1 text-sm ${activeTab === k ? "bg-black text-white" : "bg-gray-100"}`}
                        onClick={() => setActiveTab(k)}
                      >
                        {k === "pending" ? "신청" : k === "confirmed" ? "승인" : "거절"}
                      </button>
                    ))}
                  </div>
                </header>
                {selectedScheduleId && (
                  <div className="rounded border border-gray-200 p-3">
                    <div className="mb-2 text-sm text-gray-600">
                      {(() => {
                        const s = (daySlots ?? []).find((x) => x.scheduleId === selectedScheduleId);
                        return s ? `${s.startTime} ~ ${s.endTime}` : "";
                      })()}
                      <span className="ml-2">
                        (예약 {slotLists[selectedScheduleId]?.pending.length ?? 0} / 승인{" "}
                        {slotLists[selectedScheduleId]?.confirmed.length ?? 0})
                      </span>
                    </div>

                    <ul className="flex flex-col gap-2">
                      {(slotLists[selectedScheduleId]?.[activeTab] ?? []).map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">#{r.id}</span>
                            <span className="font-medium">{r.nickname}</span>
                            <span className="text-sm text-gray-500">
                              {r.headCount}명 · {r.totalPrice.toLocaleString()}원
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {activeTab !== "declined" && (
                              <button
                                className="rounded border border-gray-300 px-3 py-1 text-sm"
                                onClick={() => decline(r)}
                              >
                                거절하기
                              </button>
                            )}
                            {activeTab === "pending" && (
                              <button
                                className="rounded bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
                                disabled={hasConfirmed}
                                onClick={() => confirmAndAutoDecline(r)}
                              >
                                확정하기
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                      {(slotLists[selectedScheduleId]?.[activeTab] ?? []).length === 0 && (
                        <li className="rounded bg-gray-50 px-3 py-6 text-center text-sm text-gray-500">
                          내역이 없습니다.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </DrawerBody>
          <DrawerFooter />
        </DrawerLayout>
      </div>
    </>
  );
}
