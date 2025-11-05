"use client";

import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

import Calendar from "@/app/(header)/me/activities/schedule/components/Calendar";
import { Arrow } from "@/components/icons";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import {
  getReservations,
  updateReservationStatus,
  getReservedSchedule,
} from "@/lib/api/my-activities/api";
import {
  useReservationDashboard,
  useMyActivities,
  useReservedSchedule,
} from "@/lib/api/my-activities/hooks";
import type { Reservation } from "@/lib/api/my-activities/types";
import { useInfiniteScrollQuery } from "@/lib/hooks/useInfiniteScroll";

import { DesktopReservationPanel } from "./components/DesktopReservationPanel";
import { MobileReservationDrawer } from "./components/MobileReservationDrawer";
import ReservationPanelContent from "./components/ReservationPanelContent";
import { useIsTabletOrBelow } from "./components/useTabletOrBelow";
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
  const [countsByDate, setCountsByDate] = useState<
    Map<string, { pending: number; confirmed: number; declined: number }>
  >(new Map());

  const isTabletOrBelow = useIsTabletOrBelow();

  const { data: monthDash } = useReservationDashboard(Number(activityId || 0), year, month, false, {
    enabled: !!activityId,
  });

  const dailyStatusMap = useMemo(() => {
    const map = new Map<
      string,
      { pending: number; confirmed: number; declined: number; completed: number }
    >();
    (monthDash ?? []).forEach((d) => {
      map.set(d.date, {
        pending: d.reservations.pending ?? 0,
        confirmed: d.reservations.confirmed ?? 0,
        declined: d.reservations.declined ?? 0,
        completed: d.reservations.completed ?? 0,
      });
    });
    const ym = `${year}-${String(month).padStart(2, "0")}-`;
    for (const [date, totals] of countsByDate.entries()) {
      if (!date.startsWith(ym)) continue;
      const prev = map.get(date) ?? { pending: 0, confirmed: 0, declined: 0, completed: 0 };
      map.set(date, {
        ...prev,
        pending: totals.pending,
        confirmed: totals.confirmed,
        declined: totals.declined,
      });
    }

    return map;
  }, [monthDash, countsByDate, year, month]);

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

  function sumReservedSchedule(
    slots: {
      count?: { pending?: number; confirmed?: number; declined?: number };
    }[] = [],
  ) {
    return slots.reduce(
      (acc, s) => {
        acc.pending += s.count?.pending ?? 0;
        acc.confirmed += s.count?.confirmed ?? 0;
        acc.declined += s.count?.declined ?? 0;
        return acc;
      },
      { pending: 0, confirmed: 0, declined: 0 } as {
        pending: number;
        confirmed: number;
        declined: number;
      },
    );
  }

  async function fetchInChunks<T>(tasks: (() => Promise<T>)[], chunkSize = 5) {
    const out: T[] = [];
    for (let i = 0; i < tasks.length; i += chunkSize) {
      const slice = tasks.slice(i, i + chunkSize);
      const results = await Promise.all(slice.map((fn) => fn()));
      out.push(...results);
    }
    return out;
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
    if (!openDate || !daySlots) return;
    const total = sumReservedSchedule(daySlots);
    setCountsByDate((prev) => {
      const next = new Map(prev);
      next.set(openDate, total);
      return next;
    });
  }, [openDate, daySlots]);

  useEffect(() => {
    if (!activityId || !monthDash) return;
    const targetDates = (monthDash ?? [])
      .filter((d) => (d.reservations.pending ?? 0) + (d.reservations.confirmed ?? 0) > 0)
      .map((d) => d.date);

    if (targetDates.length === 0) {
      setCountsByDate(new Map());
      return;
    }

    const needDates = targetDates.filter((date) => !countsByDate.has(date));
    if (needDates.length === 0) return;

    let aborted = false;
    (async () => {
      try {
        const tasks = needDates.map((date) => async () => {
          const slots = await getReservedSchedule({ activityId: Number(activityId), date });
          const totals = sumReservedSchedule(slots ?? []);
          return { date, totals };
        });

        const results = await fetchInChunks(tasks, 5);

        if (aborted) return;

        setCountsByDate((prev) => {
          const next = new Map(prev);
          for (const { date, totals } of results) {
            next.set(date, totals);
          }
          return next;
        });
      } catch (e) {
        // 네트워크 오류 나는 날짜가 있어도 전체 중단하지 않도록 try/catch (여기선 단순 무시)
        // 필요시 토스트/로그 추가
      }
    })();

    return () => {
      aborted = true;
    };
  }, [activityId, monthDash]);

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
      <div className="mobile:max-w-[744px] tablet:max-w-[792px] flex w-full flex-col gap-6">
        <div className="tablet:max-w-[768px] flex w-full flex-col gap-8">
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
          <div ref={calendarWrapRef} className="relative w-full">
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
            {openDate &&
              (isTabletOrBelow ? (
                <MobileReservationDrawer open={!!openDate} onClose={() => setOpenDate(null)}>
                  <ReservationPanelContent
                    openDate={openDate}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    daySlots={daySlots}
                    selectedScheduleId={selectedScheduleId}
                    setSelectedScheduleId={setSelectedScheduleId}
                    tabLabel={tabLabel}
                    slotLists={slotLists}
                    confirmAndAutoDecline={confirmAndAutoDecline}
                    decline={decline}
                    hasConfirmed={hasConfirmed}
                    listScrollRef={listScrollRef}
                    targetRef={targetRef}
                  />
                </MobileReservationDrawer>
              ) : (
                <DesktopReservationPanel
                  onClose={() => setOpenDate(null)}
                  panelRef={panelRef}
                  panelTop={panelTop}
                >
                  <ReservationPanelContent
                    openDate={openDate}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    daySlots={daySlots}
                    selectedScheduleId={selectedScheduleId}
                    setSelectedScheduleId={setSelectedScheduleId}
                    tabLabel={tabLabel}
                    slotLists={slotLists}
                    confirmAndAutoDecline={confirmAndAutoDecline}
                    decline={decline}
                    hasConfirmed={hasConfirmed}
                    listScrollRef={listScrollRef}
                    targetRef={targetRef}
                    onClose={() => setOpenDate(null)}
                  />
                </DesktopReservationPanel>
              ))}
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
