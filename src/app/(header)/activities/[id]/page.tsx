"use client";

import { useParams } from "next/navigation";

import ReservationWidget from "@/app/(header)/activities/components/reservations/ReservationWidget";
import { useActivityDetail } from "@/lib/api/activities/hooks";
import { useAuthStatus } from "@/lib/hooks/useAuthStatus";
import { useKakaoReady } from "@/lib/hooks/useKakaoReady";
import { useMyPendingDatesForActivity } from "@/lib/hooks/useMyPendingDatesForActivity";

import ActivityHead from "../components/activity/ActivityHead";
import ActivityImages from "../components/activity/ActivityImages";
import Map from "../components/activity/Map";
import Reviews from "../components/reviews/Reviews";

export default function ActivitiesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { data, error, isLoading } = useActivityDetail(numericId);
  const { pendingDates } = useMyPendingDatesForActivity(numericId);
  const { isLoggedIn } = useAuthStatus();
  const kakaoReady = useKakaoReady();

  const contanerBase = "container-base px-5";

  if (!id || Number.isNaN(numericId)) {
    return <main className={contanerBase}>잘못된 경로입니다.</main>;
  }
  if (isLoading) return <main className={contanerBase}>로딩 중…</main>;
  if (error) return <main className={contanerBase}>에러가 발생했습니다.</main>;
  if (!data) return <main className={contanerBase}>데이터가 없습니다.</main>;

  const {
    bannerImageUrl,
    subImages: dataSubImages,
    title,
    description,
    address,
    rating,
    reviewCount,
    id: dataId,
    price,
    schedules,
  } = data;

  const subImages: string[] = (dataSubImages ?? [])
    .map((img) => img.imageUrl)
    .filter((src): src is string => Boolean(src))
    .filter((src) => src !== data.bannerImageUrl)
    .slice(0, 4);

  return (
    <main className="container-base mb-24 px-[24px]">
      <ActivityHead {...data} isLoggedIn={isLoggedIn} />

      <ActivityImages bannerImageUrl={bannerImageUrl} subImages={subImages} altPrefix={title} />

      {/* 본문 + (데스크톱) 예약 사이드바 */}
      <div className="tablet:block mt-[50px] grid grid-cols-[1fr_384px] gap-5">
        {/* 본문 */}
        <section>
          <div className="border-brand-nomad-black/25 flex flex-col gap-4 border-t py-10">
            <p className="text-brand-nomad-black text-xl font-bold">체험 설명</p>
            <p className="text-brand-nomad-black/75 truncate text-lg break-keep whitespace-pre-wrap">
              {description}
            </p>
          </div>

          {!kakaoReady && <div className="h-[450px] w-full rounded-2xl bg-gray-100" />}
          {kakaoReady && <Map location={address} />}

          <Reviews averageRating={rating} totalCount={reviewCount} id={dataId} />
        </section>

        {/* 데스크톱 우측 사이드 예약 */}
        <div className="h-full">
          <ReservationWidget
            price={price}
            // capacityLabel={`총 ${data.capacity ?? 10}인`} // 있으면 표시
            reservationProps={{
              activityId: dataId,
              title: title,
              price: price,
              schedules: schedules,
              pendingDates: pendingDates,
              // onSummaryChange는 Mobile 컨테이너에서만 넣어줍니다.
            }}
          />
        </div>
      </div>
    </main>
  );
}
