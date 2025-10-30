"use client";

import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

import Calendar from "@/app/me/activities/schedule/components/Calendar";
import { Arrow } from "@/components/icons";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { getReservations, updateReservationStatus } from "@/lib/api/my-activities/api";
import {
  useReservationDashboard,
  useMyActivities,
  useReservedSchedule,
} from "@/lib/api/my-activities/hooks";
import type { Reservation } from "@/lib/api/my-activities/types";
import { useInfiniteScrollQuery } from "@/lib/hooks/useInfiniteScroll";

import NotingPage from "../../components/NotingPage";

export default function Schedule() {
  const queryClient = useQueryClient();
  const { data: myActs } = useMyActivities({ size: 50 });
  const activityOtions =
    myActs?.activities.map((act) => ({ value: act.id, label: act.title })) ?? [];

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [activityId, setActivityId] = useState<number | "">("");
  const [viewMonth, setViewMonth] = useState(() => dayjs());

  const year = String(viewMonth.year());
  const month = String(viewMonth.month() + 1);

  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const calendarWrapRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelTop, setPanelTop] = useState(0);

  const { data: monthDash } = useReservationDashboard(Number(activityId || 0), year, month, false, {
    enabled: !!activityId,
  });

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
    interface Count {
      pending: number;
      confirmed: number;
      declined: number;
    }
    const totals: Count = { pending: 0, confirmed: 0, declined: 0 };
    const slots = daySlots ?? [];
    for (const s of slots) {
      const { pending = 0, confirmed = 0, declined = 0 } = s.count ?? {};
      totals.pending += pending;
      totals.confirmed += confirmed;
      totals.declined += declined;
    }
    if (selectedScheduleId !== null) {
      const {
        pending = 0,
        confirmed = 0,
        declined = 0,
      } = slots.find((x) => x.scheduleId === selectedScheduleId)?.count ?? {};
      const server: Count = { pending, confirmed, declined };

      const local = slotLists[selectedScheduleId];
      if (local) {
        const localCounts: Count = {
          pending: local.pending?.length ?? 0,
          confirmed: local.confirmed?.length ?? 0,
          declined: local.declined?.length ?? 0,
        };

        totals.pending += localCounts.pending - server.pending;
        totals.confirmed += localCounts.confirmed - server.confirmed;
        totals.declined += localCounts.declined - server.declined;
      }
    }

    return totals;
  }, [daySlots, slotLists, selectedScheduleId]);

  const { data: pages, targetRef } = useInfiniteScrollQuery<
    { cursorId: number | null; reservations: Reservation[] },
    {
      activityId: number;
      scheduleId: number;
      status: "pending" | "confirmed" | "declined";
      size: number;
      cursorId?: number;
    }
  >({
    queryKey: ["reservations", Number(activityId || 0), selectedScheduleId, activeTab],
    fetchFn: (params) => getReservations(params),
    initialParams: {
      activityId: Number(activityId || 0),
      scheduleId: selectedScheduleId ?? 0,
      status: activeTab,
      size: 2,
    },
    enabled: Boolean(activityId && selectedScheduleId && openDate),
    size: 2,
    rootRef: listScrollRef,
  });

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
    queryClient.invalidateQueries({
      queryKey: ["reservedSchedule", Number(activityId || 0), openDate],
    });
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
    queryClient.invalidateQueries({
      queryKey: ["reservedSchedule", Number(activityId || 0), openDate],
    });
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

      setSlotLists((prev) => ({
        ...prev,
        [selectedScheduleId]: { ...prev[selectedScheduleId], confirmed: [] },
      }));

      queryClient.invalidateQueries({
        queryKey: ["reservationDashboard", Number(activityId || 0), year, month],
      });
      queryClient.invalidateQueries({
        queryKey: ["reservedSchedule", Number(activityId || 0), openDate],
      });
    }, 60_000);

    return () => clearInterval(timer);
  }, [openDate, selectedScheduleId, daySlots, slotLists, activityId, year, month, queryClient]);

  useEffect(() => {
    if (!openDate) return;

    const wrap = calendarWrapRef.current?.getBoundingClientRect();
    const panel = panelRef.current?.getBoundingClientRect();
    if (!wrap || !panel) return;

    const MARGIN = 16;
    const centerTop = (wrap.height - panel.height) / 2;
    const minTop = MARGIN;
    const maxTop = Math.max(MARGIN, wrap.height - panel.height - MARGIN);

    setPanelTop(Math.round(Math.min(Math.max(centerTop, minTop), maxTop)));
  }, [openDate, activeTab, selectedScheduleId, daySlots, slotLists, viewMonth]);

  useEffect(() => {
    if (!selectedScheduleId) return;

    const items = (pages ?? []).flatMap((p) => p.reservations ?? []);
    const merged = Array.from(new Map(items.map((r) => [r.id, r])).values());

    setSlotLists((prev) => {
      const cur = prev[selectedScheduleId] ?? { pending: [], confirmed: [], declined: [] };
      const prevList = cur[activeTab] ?? [];

      if (prevList.length === merged.length && prevList.every((x, i) => x.id === merged[i]?.id)) {
        return prev;
      }

      return {
        ...prev,
        [selectedScheduleId]: {
          ...cur,
          [activeTab]: merged,
        },
      };
    });
  }, [pages, activeTab, selectedScheduleId]);

  if (!myActs || myActs.activities.length === 0) {
    return (
      <div className="w-full">
        <h1 className="text-3xl font-bold">예약 현황</h1>
        <NotingPage />
      </div>
    );
  }

  return (
    <>
      <div className="flex w-[792px] flex-col gap-6">
        <div className="flex w-[768px] flex-col gap-8">
          <h1 className="text-3xl font-bold">예약 현황</h1>
          {myActs && myActs.activities.length > 0 && (
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
              />
            </Field>
          )}
        </div>
        {!myActs || myActs.activities.length === 0 ? (
          <NotingPage />
        ) : (
          <div ref={calendarWrapRef} className="relative w-[800px]">
            <Calendar
              dailyStatusMap={dailyStatusMap}
              year={Number(year)}
              month={Number(month)}
              onPrevMonth={() => setViewMonth((m) => m.subtract(1, "month"))}
              onNextMonth={() => setViewMonth((m) => m.add(1, "month"))}
              onSelectDate={(d) => {
                setOpenDate(d);
              }}
              onChangeMonth={(y, m) =>
                setViewMonth(() => dayjs(`${y}-${String(m).padStart(2, "0")}-01`))
              }
            />
            {openDate && (
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
                  className="absolute right-0 z-50 flex h-[700px] w-[420px] flex-col gap-4 overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-7 shadow-lg"
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
                  <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <div className="shrink-0 text-xl font-semibold">예약 날짜</div>
                    <div className="flex shrink-0 flex-col">
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
                      <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <span className="text-xl font-semibold">예약 내역</span>
                        <div
                          ref={listScrollRef}
                          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                        >
                          <ul className="flex flex-col gap-3.5">
                            {(slotLists[selectedScheduleId]?.[activeTab] ?? []).map((r) => (
                              <li
                                key={r.id}
                                className="rounded-4 border-brand-gray-300 flex h-[116px] justify-between border px-4 py-2"
                              >
                                <div className="flex flex-col gap-2.5">
                                  <div className="text-brand-gray-600 font-semibold">
                                    닉네임{" "}
                                    <span className="font-medium text-black">{r.nickname}</span>
                                  </div>
                                  <div className="text-brand-gray-600 font-semibold">
                                    인원{" "}
                                    <span className="font-medium text-black">{r.headCount}명</span>
                                  </div>
                                </div>
                                <div className="flex items-end gap-2">
                                  {activeTab === "pending" && (
                                    <>
                                      <button
                                        className="text-md h-fit w-fit rounded bg-black px-5 py-2.5 text-center text-white"
                                        disabled={hasConfirmed}
                                        onClick={() => confirmAndAutoDecline(r)}
                                      >
                                        승인하기
                                      </button>
                                      <button
                                        className="text-md h-fit w-fit rounded border px-5 py-2.5 text-center"
                                        onClick={() => decline(r)}
                                      >
                                        거절하기
                                      </button>
                                    </>
                                  )}
                                  {activeTab === "confirmed" && (
                                    <span className="bg-brand-orange-50 text-brand-orange-500 text-md rounded-3xl px-[15px] py-2.5 font-bold">
                                      예약 승인
                                    </span>
                                  )}

                                  {activeTab === "declined" && (
                                    <span className="bg-brand-red-50 text-brand-red-500 text-md rounded-3xl px-[15px] py-2.5 font-bold">
                                      예약 거절
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}

                            {(slotLists[selectedScheduleId]?.[activeTab] ?? []).length === 0 && (
                              <li className="rounded bg-gray-50 px-3 py-6 text-center text-sm text-gray-500">
                                내역이 없습니다.
                              </li>
                            )}
                            <li ref={targetRef} className="h-6" aria-hidden />
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {myActs && myActs.activities.length > 0 && (
          <>
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
          </>
        )}
      </div>
    </>
  );
}
