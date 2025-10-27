"use client";

import dayjs from "dayjs";
import { useState, useMemo, useRef, useEffect } from "react";

import Calendar from "@/app/me/activities/schedule/components/Calendar";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import { getReservations, updateReservationStatus } from "@/lib/api/my-activities/api";
import {
  useMyActivities,
  useReservationDashboard,
  useReservedSchedule,
} from "@/lib/api/my-activities/hooks";
import type {
  GetReservationsRes,
  Reservation,
  ReservedScheduleItem,
} from "@/lib/api/my-activities/types";

export default function Schedule() {
  const { data: myActs } = useMyActivities({ size: 5 });
  const activityOtions =
    myActs?.activities.map((act) => ({ value: act.id, label: act.title })) ?? [];

  const [activityId, setActivityId] = useState<number | "">("");
  const [viewMonth, setViewMonth] = useState(() => dayjs());
  const year = String(viewMonth.year());
  const month = String(viewMonth.month());

  const { data: monthDash } = useReservationDashboard(
    Number(activityId || 0),
    year,
    month,
    !activityId,
  );

  const dailyStatusMap = useMemo(() => {
    const map = new Map<string, { pending: number; confirmed: number; completed: number }>();
    (monthDash ?? []).forEach((d) => {
      map.set(d.date, {
        pending: d.reservations.pending ?? 0,
        confirmed: d.reservations.confirmed ?? 0,
        completed: (d.reservations.completed ?? 0) + (d.reservations.declined ?? 0) * 0,
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
  }

  useEffect(() => {
    if (!daySlots || !openDate) return;
    (async () => {
      const now = dayjs();
      for (const s of daySlots) {
        const confirmedList = slotLists[s.scheduleId]?.confirmed ?? [];
        for (const r of confirmedList) {
          const end = dayjs(`${r.date} ${r.endTime}`);
          if (end.isBefore(now)) {
            await updateReservationStatus({
              activityId: r.activityId,
              reservationId: r.id,
              status: "completed",
            });
          }
        }
      }
    })();
  }, [openDate, daySlots, slotLists]);

  const confirmedExistsBySchedule = useMemo(() => {
    const map = new Map<number, boolean>();
    (daySlots ?? []).forEach((s) => {
      const has =
        (slotLists[s.scheduleId]?.confirmed.length ?? 0) > 0 || (s.count.confirmed ?? 0) > 0;
      map.set(s.scheduleId, has);
    });
    return map;
  }, [daySlots, slotLists]);

  return (
    <>
      <div className="flex w-[792px] flex-col gap-6">
        <div className="flex w-[768px] flex-col gap-8">
          <h1 className="text-3xl font-bold">에약 현황</h1>
          <Field id="activity" className="h-20">
            <Input
              as="select"
              id="activity"
              className="rounded-4 border border-gray-400 bg-white px-4 py-2"
              placeholderOption="내 체험 선택"
              options={activityOtions}
              value={activityId}
              onChange={(e) => setActivityId(Number((e.target as HTMLSelectElement).value))}
            ></Input>
          </Field>
        </div>
        <Calendar
          dailyStatusMap={dailyStatusMap}
          year={Number(year)}
          month={Number(month)}
          onPrevMonth={() => setViewMonth((m) => m.subtract(1, "month"))}
          onNextMonth={() => setViewMonth((m) => m.add(1, "month"))}
          onSelectDate={(d: string) => setOpenDate(d)}
        />
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
        {openDate && (
          <section className="rounded-4 mt-6 border border-gray-200 bg-white p-4">
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

            <div className="flex flex-col gap-6">
              {(daySlots ?? []).map((s: ReservedScheduleItem) => {
                const items = slotLists[s.scheduleId]?.[activeTab] ?? [];
                const hasConfirmed = confirmedExistsBySchedule.get(s.scheduleId) ?? false;

                return (
                  <div key={s.scheduleId} className="rounded border border-gray-200 p-3">
                    <div className="mb-2 text-sm text-gray-600">
                      {s.startTime} ~ {s.endTime}
                      <span className="ml-2">
                        (예약 {slotLists[s.scheduleId]?.pending.length ?? s.count.pending ?? 0} /
                        승인 {slotLists[s.scheduleId]?.confirmed.length ?? s.count.confirmed ?? 0})
                      </span>
                    </div>

                    <ul className="flex flex-col gap-2">
                      {items.map((r) => (
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
                      {items.length === 0 && (
                        <li className="rounded bg-gray-50 px-3 py-6 text-center text-sm text-gray-500">
                          내역이 없습니다.
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
