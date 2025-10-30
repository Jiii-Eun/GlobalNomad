"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Arrow, Misc } from "@/components/icons";
import DropDown from "@/components/ui/DropDown/Dropdown";
import { getMyReservations } from "@/lib/api/my-reservations/api";
import type { GetMyResvsReq, GetMyResvsRes } from "@/lib/api/my-reservations/types";
import { useInfiniteScrollQuery } from "@/lib/hooks/useInfiniteScroll";

import ReservationsCard from "../components/ReservationsCard";

type ReservationStatus = "pending" | "canceled" | "confirmed" | "declined" | "completed";

const STATUS_LABELS = ["예약 완료", "예약 취소", "예약 승인", "예약 거절", "체험 완료"] as const;
const STATUS_KEYS: readonly ReservationStatus[] = [
  "pending",
  "canceled",
  "confirmed",
  "declined",
  "completed",
];

export default function Reservations() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 🚀 IntersectionObserver 내장 훅 사용
  // 훅 쓰는 컴포넌트 파일
  const status = selectedIndex === null ? undefined : STATUS_KEYS[selectedIndex];

  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    targetRef,
    error,
  } = useInfiniteScrollQuery<GetMyResvsRes, GetMyResvsReq>({
    queryKey: ["myReservations", { status: status ?? "__ALL__", size: 6 }],
    fetchFn: async (params) => {
      console.log("[REQ]", params); // ★ 보낸 쿼리 기록
      const res = await getMyReservations(params);
      console.log("[RES]", {
        cursorId: res.cursorId,
        count: res.reservations?.length,
        ids: res.reservations?.map((r) => r.id),
      }); // ★ 받은 응답 요약
      return res;
    },
    initialParams: {
      size: 6,
      // status: selectedIndex === null ? undefined : STATUS_KEYS[selectedIndex],
      // status,
    },
    enabled: true,
    size: 6,
  });

  const allReservations = useMemo(() => pages.flatMap((p) => p.reservations ?? []), [pages]);

  const queryClient = useQueryClient();

  const handleSelect = (index: number | null) => {
    setSelectedIndex(index);
    setIsOpen(false);
    // 필터 변경 시 진행중 요청/캐시 리셋
    queryClient.cancelQueries({ queryKey: ["myReservations"] });
    queryClient.removeQueries({ queryKey: ["myReservations"] });
  };

  if (error) {
    return (
      <main className="bg-[#FAFAFA] py-18">
        <div className="text-center text-red-600">예약 내역을 불러오는 중 오류가 발생했습니다.</div>
      </main>
    );
  }

  return (
    <main className="bg-[#FAFAFA] py-18">
      <div className="mx-auto flex max-w-[1320px] gap-5">
        <div className="flex h-fit min-h-[800px] w-[800px] flex-col gap-10">
          {/* 헤더 */}
          <div className="flex justify-between">
            <p className="text-3xl font-bold">예약 내역</p>
            <div className="rounded-16 border border-[#0B3B2D] bg-white px-4 py-2">
              <DropDown handleClose={() => setIsOpen(false)}>
                <DropDown.Trigger onClick={() => setIsOpen((prev) => !prev)} isOpen={isOpen}>
                  <div className="flex items-center gap-2">
                    <span className="text-2lg font-medium text-[#0B3B2D]">
                      {selectedIndex === null ? "필터" : STATUS_LABELS[selectedIndex]}
                    </span>
                    <Arrow.DownFill className="h-5 w-6 text-[#0B3B2D]" />
                  </div>
                </DropDown.Trigger>
                <DropDown.Menu isOpen={isOpen}>
                  {STATUS_LABELS.map((label, index) => (
                    <DropDown.Item key={index} onClick={() => handleSelect(index)}>
                      {label}
                    </DropDown.Item>
                  ))}
                  <DropDown.Item onClick={() => handleSelect(null)}>전체 보기</DropDown.Item>
                </DropDown.Menu>
              </DropDown>
            </div>
          </div>

          {/* 본문 */}
          {isLoading && <p className="text-center text-gray-500">Loading...</p>}

          {!isLoading && allReservations.length === 0 && (
            <div className="mt-[90px] flex flex-col items-center gap-5">
              <Misc.NotingPage className="h-[178px] w-[130px]" />
              <p className="text-2xl font-medium text-[#79747E]">아직 등록한 체험이 없어요</p>
            </div>
          )}

          <ul className="flex list-none flex-col gap-6">
            {allReservations.map((item) => (
              <ReservationsCard key={item.id} {...item} />
            ))}
          </ul>

          {/* 무한 스크롤 트리거 */}
          {hasNextPage && <div ref={targetRef} className="h-10 w-full" aria-hidden />}

          {/* 상태 안내 */}
          {isFetchingNextPage && <p className="mt-4 text-center text-gray-500">더 불러오는 중…</p>}

          {/* ✅ 모든 데이터를 다 불러왔을 때 표시 */}
          {!hasNextPage && allReservations.length > 0 && (
            <p className="mt-6 text-center text-lg font-medium text-gray-400">마지막 입니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}
