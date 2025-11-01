"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useActivityDetail } from "@/lib/api/activities/hooks";
import { useKakaoReady } from "@/lib/hooks/useKakaoReady";
import { useMyPendingDatesForActivity } from "@/lib/hooks/useMyPendingDatesForActivity";

import ActivityHead from "../components/activity/ActivityHead";
import Map from "../components/activity/Map";
import { CalendarProvider } from "../components/calendar/Calendar.provider";
import ReservationContent from "../components/reservations/ReservationContent";
import Reviews from "../components/reviews/Reviews";

export default function ActivitiesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { data, error, isLoading } = useActivityDetail(numericId);
  //로그인한 유저의 'pending' 예약 날짜 수집
  const { pendingDates } = useMyPendingDatesForActivity(numericId);
  const kakaoReady = useKakaoReady();

  if (!id || Number.isNaN(numericId)) {
    return <main className="container-base px-[24px]">잘못된 경로입니다.</main>;
  }

  if (isLoading) {
    return <main className="container-base px-[24px]">로딩 중…</main>;
  }
  if (error) {
    return <main className="container-base px-[24px]">에러가 발생했습니다.</main>;
  }
  if (!data) {
    return <main className="container-base px-[24px]">데이터가 없습니다.</main>;
  }

  return (
    <>
      <main className="container-base mb-24 px-[24px]">
        <ActivityHead {...data} />
        <div
          className="tablet:h-[310px] tablet:gap-1 mobile:h-[310px] mobile:rounded-none mt-[42px] flex h-[540px] gap-2 overflow-hidden rounded-2xl"
          style={{ boxShadow: "0px 4px 12px rgba(17, 34, 17, 0.05)" }}
        >
          <div className="mobile:hidden h-full w-1/2 shrink-0">
            <Image
              src={data.bannerImageUrl}
              alt="체험 메인이미지"
              width={600}
              height={540}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="tablet:h-[310px] mobile:w-full h-[540px] w-1/2">
            <div className="mobile:hidden tablet:gap-1 grid h-full grid-cols-2 grid-rows-2 gap-2">
              <Image
                src="/testimage.png"
                alt="체험사진"
                width={595}
                height={263}
                className="col-span-2 row-span-1 h-full w-full object-cover"
              />
              <Image
                src="/testimage.png"
                alt="체험사진"
                width={595}
                height={263}
                className="col-span-2 row-span-1 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-[50px] flex gap-5">
          <div className={`flex w-full flex-col`}>
            <div className="border-brand-nomad-black/25 flex flex-col gap-[16px] border-t py-[40px]">
              <p className="text-brand-nomad-black text-xl font-bold">체험 설명</p>
              <p className="text-brand-nomad-black/75 text-lg whitespace-pre-wrap">
                {data.description}
              </p>
            </div>
            <>
              {!kakaoReady && <div className="h-[450px] w-full rounded-2xl bg-gray-100" />}
              {kakaoReady && <Map location={data.address} />}
            </>
            <Reviews averageRating={data?.rating} totalCount={data.reviewCount} id={data.id} />
          </div>

          <div>
            <CalendarProvider activityId={data.id}>
              <ReservationContent
                activityId={data.id}
                title={data.title}
                price={data.price}
                schedules={data.schedules}
                pendingDates={pendingDates}
              />
            </CalendarProvider>
          </div>
        </div>
      </main>
    </>
  );
}
