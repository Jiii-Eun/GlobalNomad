"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useActivityDetail } from "@/lib/api/activities/hooks";
import { useAuthStatus } from "@/lib/hooks/useAuthStatus";
import { useKakaoReady } from "@/lib/hooks/useKakaoReady";
import { useMyPendingDatesForActivity } from "@/lib/hooks/useMyPendingDatesForActivity";

import ActivityHead from "../components/activity/ActivityHead";
import ActivityImages from "../components/activity/ActivityImages";
import Map from "../components/activity/Map";
import ReservationWidgetContainerSelector from "../components/reservations/ReservationWidgetContainerSelector";
import Reviews from "../components/reviews/Reviews";

export default function ActivitiesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { data, error, isLoading } = useActivityDetail(numericId);
  const { pendingDates } = useMyPendingDatesForActivity(numericId);
  const { isLoggedIn } = useAuthStatus();
  const kakaoReady = useKakaoReady();

  if (!id || Number.isNaN(numericId)) {
    return <main className="container-base px-[24px]">잘못된 경로입니다.</main>;
  }
  if (isLoading) return <main className="container-base px-[24px]">로딩 중…</main>;
  if (error) return <main className="container-base px-[24px]">에러가 발생했습니다.</main>;
  if (!data) return <main className="container-base px-[24px]">데이터가 없습니다.</main>;

  const subImages: string[] = (data.subImages ?? [])
    .map((img) => img.imageUrl)
    .filter((src): src is string => Boolean(src))
    .filter((src) => src !== data.bannerImageUrl)
    .slice(0, 4);

  return (
    <main className="container-base mb-24 px-[24px]">
      <ActivityHead {...data} isLoggedIn={isLoggedIn} />

      <ActivityImages
        bannerImageUrl={data.bannerImageUrl}
        subImages={subImages}
        altPrefix={data.title}
      />

      {/* 본문 + (데스크톱) 예약 사이드바 */}
      <div className="mt-[50px] grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* 본문 */}
        <section className="min-w-0">
          <div className="border-brand-nomad-black/25 flex flex-col gap-[16px] border-t py-[40px]">
            <p className="text-brand-nomad-black text-xl font-bold">체험 설명</p>
            <p className="text-brand-nomad-black/75 text-lg whitespace-pre-wrap">
              {data.description}
            </p>
          </div>

          {!kakaoReady && <div className="h-[450px] w-full rounded-2xl bg-gray-100" />}
          {kakaoReady && <Map location={data.address} />}

          <Reviews averageRating={data?.rating} totalCount={data.reviewCount} id={data.id} />
        </section>

        {/* 데스크톱 우측 사이드 예약 */}
        <ReservationWidgetContainerSelector
          price={data.price}
          // capacityLabel={`총 ${data.capacity ?? 10}인`} // 있으면 표시
          reservationProps={{
            activityId: data.id,
            title: data.title,
            price: data.price,
            schedules: data.schedules,
            pendingDates: pendingDates,
            // onSummaryChange는 Mobile 컨테이너에서만 넣어줍니다.
          }}
        />
      </div>
    </main>
  );
}
