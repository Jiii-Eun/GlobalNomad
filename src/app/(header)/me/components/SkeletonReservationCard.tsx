import BackgroundImage from "@/components/ui/BackgroundImage";

// components/Reservations/SkeletonReservationCard.tsx
export default function SkeletonReservationCard() {
  return (
    <li
      className="tablet:h-[156px] mobile:h-[128px] flex h-[204px] max-w-[792px] animate-pulse rounded-[24px] bg-white"
      style={{ boxShadow: "0px 4px 16px 0px rgba(17, 34, 17, 0.05)" }}
      aria-hidden
    >
      {/* 이미지 자리 */}

      <div className="tablet:min-w-[156px] tablet:h-[156px] mobile:min-w-[128px] mobile:h-[128px] relative h-[204px] min-w-[204px] overflow-hidden rounded-l-[24px]">
        <BackgroundImage className="rounded-4 h-full w-full overflow-hidden" />
      </div>

      {/* 텍스트/버튼 자리 */}
      <div className="tablet:p-[12px] mobile:p-[9px] flex h-full w-full flex-col justify-between p-6">
        <div className="space-y-3">
          <BackgroundImage className="h-4 w-24 overflow-hidden rounded" />
          <BackgroundImage className="h-6 w-3/5 overflow-hidden rounded" />
          <BackgroundImage className="h-5 w-2/3 overflow-hidden rounded" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <BackgroundImage className="h-6 w-28 overflow-hidden rounded" />
        </div>
      </div>
    </li>
  );
}
