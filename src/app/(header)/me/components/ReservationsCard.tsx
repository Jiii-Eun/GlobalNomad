// ReservationsCard.tsx
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";

import Button from "@/components/ui/button/Button";
import { useToast } from "@/components/ui/toast/useToast";
import { useCancelMyReservation } from "@/lib/api/my-reservations/hooks";
import { MyReservation } from "@/lib/api/my-reservations/types";

import ReviewModal from "./Review/ReviewModal";

export type ReservationCardData = Pick<
  MyReservation,
  "id" | "status" | "activity" | "totalPrice" | "headCount" | "date" | "startTime" | "endTime"
> & {
  activity: Pick<MyReservation["activity"], "id" | "title" | "bannerImageUrl">;
};

export interface ReservationCardUIProps {
  cardClass?: string;
  contentClass?: string;
  imageClass?: string;
  titleClass?: string;
  priceClass?: string;
  variant?: "default" | "best";
  backgroundOverlay?: string;
  status?: "pending" | "confirmed" | "declined" | "canceled" | "completed";
  children?: React.ReactNode;
}

export type CardProps = ReservationCardData & ReservationCardUIProps;

export default function ReservationsCard({
  id,
  status,
  activity,
  totalPrice,
  headCount,
  date,
  startTime,
  endTime,
}: CardProps) {
  const { showToast } = useToast();
  const [reservStatus, setReservStatus] = useState<typeof status>(status);

  // 취소 API 훅: 성공/실패 토스트 + 로컬 상태 반영
  const { mutate: cancelReservation, isPending } = useCancelMyReservation(false, {
    onSuccess: () => {
      setReservStatus("canceled");
      showToast("trueCancel");
    },
    onError: () => {
      showToast("falseCancel");
    },
  });

  const textProps = () => {
    const textPropsObj: { color: string; text: string } = { color: "", text: "-" };
    switch (reservStatus) {
      case "pending":
        textPropsObj.color = "text-[#2EB4FF]";
        textPropsObj.text = "예약 완료";
        break;
      case "confirmed":
        textPropsObj.color = "text-[#FF7C1D]";
        textPropsObj.text = "예약 승인";
        break;
      case "declined":
        textPropsObj.color = "text-[#FF472E]";
        textPropsObj.text = "예약 거절";
        break;
      case "canceled":
        textPropsObj.color = "text-[#79747E]";
        textPropsObj.text = "예약 취소";
        break;
      case "completed":
        textPropsObj.color = "text-[#79747E]";
        textPropsObj.text = "체험 완료";
        break;
    }
    return textPropsObj;
  };

  // 종료 시간이 지났다면 완료 처리
  useEffect(() => {
    if (status === "confirmed") {
      const now = new Date();
      const endDateTime = new Date(`${date}T${endTime}`);
      if (now > endDateTime) setReservStatus("completed");
    }
  }, [date, endTime, status]);

  // 예약 취소 버튼: 확인 토스트 → 확인 시에만 실제 취소
  const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending || reservStatus !== "pending") return;

    // "isCancel" 토스트의 confirm 버튼(actionKey === 'confirm')에 매핑됨
    showToast("isCancel", () => {
      // 훅 시그니처에 맞춰 payload만 조정하면 됨
      cancelReservation({ reservationId: id, status: "canceled" });
    });
  };

  return (
    <>
      <li
        className="tablet:h-[156px] mobile:h-[128px] text-black200 flex h-[204px] max-w-[792px] rounded-[24px] bg-white text-[16px]"
        style={{ boxShadow: "0px 4px 16px 0px rgba(17, 34, 17, 0.05)" }}
      >
        <Link
          href={`/activities/${activity.id}`}
          className="tablet:max-w-[156px] mobile:max-w-[128px] max-w-[204px] rounded-[24px] bg-white text-[16px]"
        >
          <div className="tablet:min-w-[156px] tablet:h-[156px] mobile:min-w-[128px] mobile:h-[128px] relative h-[204px] min-w-[204px]">
            <Image
              src={activity.bannerImageUrl}
              alt={`${activity.title} 이미지`}
              fill
              priority
              className="rounded-l-[24px] object-cover"
            />
          </div>
        </Link>

        <div className="tablet:p-[12px] mobile:p-[9px] flex h-full w-full flex-col justify-between p-6 text-left">
          <div>
            <p className={`${textProps().color} mobile:text-[14px] font-bold`}>
              {textProps().text}
            </p>
            <p className="tablet:text-[18px] mobile:text-[14px] tablet:m-0 mobile:mt-[5px] mt-2 text-[20px] font-bold">
              {activity.title}
            </p>
            <p className="tablet:text-[14px] mobile:text-[12px] tablet:mt-[5px] mobile:mt-[5px] mt-3 text-[18px]">
              {date} · {startTime} - {endTime} · {headCount}명
            </p>
          </div>

          <div className="mobile:h-[32px] tablet:mt-[12px] mobile:mt-[5px] mobile:mr-[3px] mt-4 flex h-10 items-center justify-between">
            <p className="tablet:text-[20px] mobile:text-[16px] text-[24px] font-medium">
              ₩{totalPrice.toLocaleString()}
            </p>

            {reservStatus === "pending" && (
              <Button
                onClick={handleCancelClick}
                disabled={isPending}
                className="text-brand-nomad-black hover:bg-brand-nomad-black h-[40px] w-[144px] border bg-white text-lg font-bold hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "취소 중..." : "예약 취소"}
              </Button>
            )}

            {reservStatus === "completed" && (
              <ReviewModal
                title={activity.title}
                thumbnailUrl={activity.bannerImageUrl}
                dateText={`${date} (${startTime}~${endTime})`}
                startTime={startTime}
                endTime={endTime}
                priceText={totalPrice}
                reservationId={id}
                trigger={
                  <Button className="hover:text-brand-nomad-black bg-brand-nomad-black h-[40px] w-[144px] border text-lg font-bold text-white hover:bg-white">
                    후기 작성
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </li>
    </>
  );
}
