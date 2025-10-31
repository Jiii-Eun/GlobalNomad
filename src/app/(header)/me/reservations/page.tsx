// /me/reservations/page.tsx (또는 해당 컴포넌트 파일)
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Arrow, Misc } from "@/components/icons";
import DropDown from "@/components/ui/DropDown/Dropdown";
import { getMyReservations } from "@/lib/api/my-reservations/api";
import type { GetMyResvsReq, GetMyResvsRes } from "@/lib/api/my-reservations/types";
import { useInfiniteScrollQuery } from "@/lib/hooks/useInfiniteScroll";

import ReservationsCard from "../components/ReservationsCard";
import SkeletonReservationCard from "../components/SkeletonReservationCard";

// ---- Status 정의
type ReservationStatus = "pending" | "canceled" | "confirmed" | "declined" | "completed";
const STATUS_LABELS = ["예약 완료", "예약 취소", "예약 승인", "예약 거절", "체험 완료"] as const;
const STATUS_KEYS: readonly ReservationStatus[] = [
  "pending",
  "canceled",
  "confirmed",
  "declined",
  "completed",
];

// ---- 다음 커서 계산 유틸 (id 우선, 없으면 createdAt)
function deriveNextCursor(items: { id?: number; createdAt?: string }[], fallback?: number | null) {
  if (!items || items.length === 0) return null;
  const last = items[items.length - 1];
  if (typeof last.id === "number") return last.id;
  if (typeof last.createdAt === "string") {
    const t = Date.parse(last.createdAt);
    if (!Number.isNaN(t)) return t;
  }
  return fallback ?? null;
}

// ---- 안전 fetch: size 기준으로 더 없음(null) 처리 + next cursor 계산
async function getMyReservationsSafe(params: GetMyResvsReq): Promise<GetMyResvsRes> {
  const res = await getMyReservations(params);
  const size = params.size ?? 10;
  const items = res.reservations ?? [];

  if (items.length < size) return { ...res, cursorId: null };

  const next = deriveNextCursor(items, res.cursorId ?? null);
  return { ...res, cursorId: next };
}

export default function Reservations() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // 선택된 상태(없으면 전체)
  const status = selectedIndex === null ? undefined : STATUS_KEYS[selectedIndex];

  // 페이지 사이즈 & 쿼리키 (status를 포함해야 필터 변경 시 새 쿼리로 전환됨)
  const PAGE_SIZE = 6 as const;
  const QUERY_KEY = [
    "myReservations",
    "infinite",
    { status: status ?? "__ALL__", size: PAGE_SIZE },
  ] as const;

  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    targetRef,
    isError,
  } = useInfiniteScrollQuery<GetMyResvsRes, GetMyResvsReq>({
    queryKey: QUERY_KEY,
    fetchFn: getMyReservationsSafe,
    initialParams: {
      size: PAGE_SIZE,
      ...(status ? { status } : {}), // 전체 보기일 땐 status 생략
    },
    enabled: true,
    size: PAGE_SIZE,
  });

  // 평평하게 펼치고(필요시 중복 제거 가능), 그대로 카드에 전달
  const allReservations = useMemo(() => {
    const flat = (pages ?? []).flatMap((p) => p.reservations ?? []);
    // id 중복 방지(서버 페이지 경계에서 중복될 수 있을 때)
    const seen = new Set<number>();
    return flat.filter((r) => {
      if (typeof r.id !== "number") return true;
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [pages]);

  // 필터 선택 시: 드롭닫고, 이전 쿼리 정리(선택) → status가 포함된 QUERY_KEY가 바뀌므로 자동 리셋됨
  const handleSelect = (index: number | null) => {
    setSelectedIndex(index);
    setIsOpen(false);
    // 선택: 혹시 진행중 요청/캐시를 바로 정리하고 싶다면 아래 두 줄 유지
    queryClient.cancelQueries({ queryKey: ["myReservations", "infinite"] });
    queryClient.removeQueries({ queryKey: ["myReservations", "infinite"] });
  };

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

          {isLoading && (
            <ul className="flex list-none flex-col gap-6">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonReservationCard key={`skel-first-${i}`} />
              ))}
            </ul>
          )}
          {isError && (
            <div className="text-center text-red-600">
              예약 내역을 불러오는 중 오류가 발생했습니다.
            </div>
          )}

          {!isLoading && !isError && allReservations.length === 0 && (
            <div className="mt-[90px] flex flex-col items-center gap-5">
              <Misc.NotingPage className="h-[178px] w-[130px]" />
              <p className="text-2xl font-medium text-[#79747E]">아직 등록한 체험이 없어요</p>
            </div>
          )}

          {allReservations.length > 0 && (
            <>
              <ul className="flex list-none flex-col gap-6">
                {allReservations.map((item) => (
                  <ReservationsCard key={item.id} {...item} />
                ))}

                {/* 다음 페이지 로딩 중: 하단에 스켈레톤 2~3개 */}
                {isFetchingNextPage &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonReservationCard key={`skel-more-${i}`} />
                  ))}

                {/* 인터섹션 옵저버 트리거 */}
                {hasNextPage && <li ref={targetRef} className="h-24 w-full" aria-hidden />}
              </ul>

              {/* 안내 문구 */}
              {!hasNextPage && (
                <p className="mt-6 text-center text-lg font-medium text-gray-400">마지막 입니다.</p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
