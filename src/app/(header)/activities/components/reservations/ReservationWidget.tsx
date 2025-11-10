"use client";

import React, { useState } from "react";
import { Drawer } from "vaul";

import { useReservationCore } from "@/app/(header)/activities/components/reservations/hooks/useReservationCore";
import ReservationButton from "@/app/(header)/activities/components/reservations/ReservationButton";
import ReservationContent from "@/app/(header)/activities/components/reservations/ReservationContent";
import { ReserveSummary } from "@/app/(header)/activities/components/reservations/types/summaryType";
import Button from "@/components/ui/button/Button";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerLayout } from "@/components/ui/modal";
import { Schedule } from "@/lib/api/activities/types";
import { useDevice } from "@/lib/hooks/useDevice";

import { useMyReservationsForActivity } from "./hooks/useMyReservationsForActivity";
import { useReservationSteps } from "./hooks/useReservationSteps";

export interface ReservationContentProps {
  activityId: number;
  title: string;
  price: number;
  schedules?: Schedule[];
  pendingDates?: string[];
  onSummaryChange?: (s: ReserveSummary) => void;
}

interface MobileProps {
  price: number;
  reservationProps: ReservationContentProps;
  triggerText?: string;
  capacityLabel?: string;
}

export const currency = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

export default function ReservationWidget({
  price,
  reservationProps,
  triggerText = "예약하기",
}: MobileProps) {
  const [open, setOpen] = useState(false);
  const { activityId, schedules, pendingDates = [], onSummaryChange } = reservationProps;
  const { isMobile, isPc } = useDevice();

  const { reservations, totalMembers, totalPrice, isLoading } =
    useMyReservationsForActivity(activityId);

  const core = useReservationCore({
    activityId,
    price,
    schedules,
    pendingDates,
    onSummaryChange,
  });

  const { steps } = useReservationSteps(core);

  const { selectedSlots, reserved, isPending, isReserveDisabled, handleReserve } = core;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Trigger = (
    <div className="fixed inset-x-0 bottom-0 z-60 h-[90px] items-center justify-between border-t border-black/10 bg-white pb-[calc(env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 py-3">
        <div className="min-w-0">
          {isLoading ? (
            <p className="text-[14px] text-gray-500">예약 정보를 불러오는 중...</p>
          ) : reservations.length > 0 ? (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-[18px] leading-none font-bold">₩ {currency(totalPrice)}</p>
                <span className="text-brand-deep-green-500/80 text-[14px] leading-none">
                  / 총 {totalMembers}명
                </span>
              </div>
              <p className="mt-1 truncate text-[13px] text-[#111]/60">
                {reservations.map((r) => r.date).join(", ")}
              </p>
            </>
          ) : (
            <p className="text-[14px] text-gray-500">예약 내역이 없습니다.</p>
          )}
        </div>

        <Drawer.Trigger asChild>
          <Button
            className="h-11 min-w-[110px] px-5 text-[15px] font-bold"
            aria-label="예약 폼 열기"
            onClick={handleOpen}
          >
            {triggerText}
          </Button>
        </Drawer.Trigger>
      </div>
    </div>
  );

  return (
    <>
      {isPc ? (
        <ReservationContent price={price} {...core} />
      ) : isMobile ? (
        <DrawerLayout steps={steps} isClose title="체험 예약" trigger={Trigger} isOpen={open}>
          <DrawerHeader />
          <DrawerBody frameClass="py-0" />
          <DrawerFooter isNext />
        </DrawerLayout>
      ) : (
        <DrawerLayout
          isClose
          triggerChildren={Trigger}
          title="체험 예약"
          isOpen={open}
          onClose={handleClose}
        >
          <DrawerHeader />
          <DrawerBody>
            <div
              className="mx-auto w-full overflow-y-auto px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]"
              style={{ maxHeight: "calc(90vh - 20px)" }}
            >
              <ReservationContent price={price} {...core} />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <ReservationButton
              reserved={reserved}
              isPending={isPending}
              isLoggedIn
              isReserveDisabled={isReserveDisabled}
              slotCount={selectedSlots.length}
              handleReserve={handleReserve}
            />
          </DrawerFooter>
        </DrawerLayout>
      )}
    </>
  );
}
