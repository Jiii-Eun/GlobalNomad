import { ScheduleTime } from "@/lib/api/activities/types";

export function mapSchedulesToSlots(schedules: ScheduleTime[] = []) {
  const toDate = (date: string, hhmm: string) => {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = hhmm.split(":").map(Number);
    const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
    if (hh === 24) dt.setDate(dt.getDate() + 1);
    return dt;
  };

  return schedules
    .map((s) => ({ start: toDate(s.date, s.startTime), end: toDate(s.date, s.endTime) }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}
