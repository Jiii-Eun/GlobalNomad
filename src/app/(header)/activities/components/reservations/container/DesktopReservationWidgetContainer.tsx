"use client";
import React from "react";

import type { ReservationContentProps } from "../ReservationContent";
import ReservationContent from "../ReservationContent";

function currency(n: number) {
  return new Intl.NumberFormat("ko-KR").format(n);
}

interface DesktopProps {
  price: number;
  reservationProps: ReservationContentProps; // CalendarProvider는 바깥에서 감싸도 되고, 여기선 Content만
  stickyTop?: number; // px
}

export default function DesktopReservationWidgetContainer({
  price,
  reservationProps,
  stickyTop = 96,
}: DesktopProps) {
  return (
    <aside
      className="rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(17,34,17,0.05)]"
      style={{ position: "sticky", top: stickyTop }}
      aria-label="예약 사이드 카드"
    >
      {/* (원하면 가격 헤더 등 넣기)
      <div className="mb-4 flex items-baseline gap-2">
        <p className="text-2xl font-bold">₩ {currency(price)}</p>
        <span className="text-sm text-gray-500">/ 인</span>
      </div>
      */}
      <ReservationContent {...reservationProps} />
    </aside>
  );
}
