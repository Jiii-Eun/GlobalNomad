"use client";
import React from "react";

import { useDevice } from "@/lib/hooks/useDevice";

import DesktopReservationWidgetContainer from "./container/DesktopReservationWidgetContainer";
import MobileReservationWidgetContainer from "./container/MobileReservationWidgetContainer";
import type { ReservationContentProps } from "./ReservationContent";

interface SelectorProps {
  price: number;
  reservationProps: ReservationContentProps; // ReservationContent에 그대로 전달
  capacityLabel?: string; // 모바일 하단바에만 쓰고, PC에선 필요 시 직접 표시
}

export default function ReservationWidgetContainerSelector({
  price,
  reservationProps,
  capacityLabel,
}: SelectorProps) {
  const { isPc } = useDevice();
  // const isMobile = useMediaQuery("(max-width: 1023px)"); // 필요 시

  if (isPc) {
    return <DesktopReservationWidgetContainer price={price} reservationProps={reservationProps} />;
  }

  return (
    <MobileReservationWidgetContainer
      price={price}
      reservationProps={reservationProps}
      capacityLabel={capacityLabel}
    />
  );
}
