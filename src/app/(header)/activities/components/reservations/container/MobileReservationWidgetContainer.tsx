"use client";
import React, { useState } from "react";
import { Drawer } from "vaul";

import ReservationContent, { type ReservationContentProps } from "../ReservationContent";
import { useMyReservationsForActivity } from "../useMyReservationsForActivity";

const srOnly = "sr-only";
const currency = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

interface MobileProps {
  price: number;
  reservationProps: ReservationContentProps;
  triggerText?: string;
  capacityLabel?: string;
}

export default function MobileReservationWidgetContainer({
  price,
  reservationProps,
  triggerText = "예약하기",
  capacityLabel,
}: MobileProps) {
  const [open, setOpen] = useState(false);
  const { activityId } = reservationProps;

  // ✅ 해당 체험의 예약 내역 가져오기
  const { reservations, totalMembers, totalPrice, isLoading } =
    useMyReservationsForActivity(activityId);

  return (
    <div className="lg:hidden">
      <div className="h-[84px]" />

      <Drawer.Root open={open} onOpenChange={setOpen}>
        {/* 하단 고정 요약 바 */}
        <div className="fixed inset-x-0 bottom-0 z-[60] h-[90px] border-t border-black/10 bg-white pb-[calc(env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
            <div className="min-w-0">
              {isLoading ? (
                <p className="text-[14px] text-gray-500">예약 정보를 불러오는 중...</p>
              ) : reservations.length > 0 ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[18px] leading-none font-bold">₩ {currency(totalPrice)}</p>
                    <span className="text-[14px] leading-none text-[#0B3B2D]/80">
                      / 총 {totalMembers}명
                    </span>
                  </div>
                  {/* ✅ 예약 날짜들 출력 */}
                  <p className="mt-1 truncate text-[13px] text-[#111]/60">
                    {reservations.map((r) => r.date).join(", ")}
                  </p>
                </>
              ) : (
                <p className="text-[14px] text-gray-500">예약 내역이 없습니다.</p>
              )}
            </div>

            <Drawer.Trigger asChild>
              <button
                className="h-[44px] min-w-[110px] rounded-[10px] bg-[#0B3B2D] px-5 text-[15px] font-bold text-white hover:opacity-95"
                aria-label="예약 폼 열기"
              >
                {triggerText}
              </button>
            </Drawer.Trigger>
          </div>
        </div>

        {/* Drawer 내부 */}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[70] bg-black/40" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-[80] max-h-[90vh] rounded-t-2xl bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
            <Drawer.Title className={srOnly}>체험 예약</Drawer.Title>
            <div className="relative">
              <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-300" />
              <Drawer.Close asChild>
                <button
                  type="button"
                  aria-label="닫기"
                  className="absolute top-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/70 hover:bg-black/10"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </Drawer.Close>
            </div>

            <div
              className="mx-auto w-full max-w-[960px] overflow-y-auto px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]"
              style={{ maxHeight: "calc(90vh - 20px)" }}
            >
              <ReservationContent {...reservationProps} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
