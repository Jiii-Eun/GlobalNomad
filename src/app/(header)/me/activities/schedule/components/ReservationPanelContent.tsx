import { Arrow } from "@/components/icons";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import type { Reservation } from "@/lib/api/my-activities/types";

type TabKey = "pending" | "confirmed" | "declined";

interface SlotCount {
  pending: number;
  confirmed: number;
  declined: number;
}

interface DaySlot {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count?: Partial<SlotCount>;
}

interface ReservationPanelContentProps {
  openDate: string;

  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;

  daySlots: DaySlot[] | undefined;

  selectedScheduleId: number | null;
  setSelectedScheduleId: (id: number | null) => void;

  tabLabel: (k: TabKey) => string;

  slotLists: Record<
    number,
    {
      pending: Reservation[];
      confirmed: Reservation[];
      declined: Reservation[];
    }
  >;

  confirmAndAutoDecline: (r: Reservation) => void;
  decline: (r: Reservation) => void;
  hasConfirmed: boolean;

  // 여기! Ref 타입은 React.RefObject로만 표기.
  listScrollRef: React.RefObject<HTMLDivElement | null>;
  targetRef: (node: HTMLLIElement | null) => void;
}

export default function ReservationPanelContent({
  openDate,
  activeTab,
  setActiveTab,
  daySlots,
  selectedScheduleId,
  setSelectedScheduleId,
  tabLabel,
  slotLists,
  confirmAndAutoDecline,
  decline,
  hasConfirmed,
  listScrollRef,
  targetRef,
}: ReservationPanelContentProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 상단 (제목/탭) */}
      <div className="border-brand-gray-200 flex flex-col gap-10 border-b">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">예약 정보</div>
          {/* 닫기 버튼은 wrapper(데스크탑 모달 / DrawerHeader) 쪽에서 넣는다 */}
        </div>

        <div className="flex gap-3">
          {(["pending", "confirmed", "declined"] as const).map((k) => (
            <button
              key={k}
              type="button"
              className={`rounded px-3 py-1 text-xl ${
                activeTab === k ? "bg-black text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab(k)}
            >
              {tabLabel(k)}
            </button>
          ))}
        </div>
      </div>

      {/* 날짜 / 시간 슬롯 선택 영역 */}
      <div className="flex min-h-0 flex-col gap-4">
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

        {/* 예약 내역 리스트 (선택한 슬롯 기준) */}
        {selectedScheduleId && (
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <span className="text-xl font-semibold">예약 내역</span>

            <div ref={listScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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

                {/* 무한스크롤 관찰 대상 */}
                <li ref={targetRef} className="h-6" aria-hidden />
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
