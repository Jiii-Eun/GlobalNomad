"use client";

import Image from "next/image";

import { testData } from "./testData/testData";
import ActivityHead from "../components/activity/ActivityHead";
import Map from "../components/activity/Map";
import ReservationContent from "../components/reservations/ReservationContent";
import Reviews from "../components/reviews/Reviews";

export default function ActivitiesDetailPage() {
  return (
    <>
      <main className="container-base mb-24 px-[24px]">
        <ActivityHead />
        <div
          className="tablet:h-[310px] tablet:gap-1 mobile:h-[310px] mobile:rounded-none mt-[42px] flex h-[540px] gap-2 overflow-hidden rounded-2xl"
          style={{ boxShadow: "0px 4px 12px rgba(17, 34, 17, 0.05)" }}
        >
          <div className="mobile:hidden h-full w-1/2 shrink-0">
            <Image
              src="/testimage.png" //{mockData.bannerImageUrl}
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
                {testData.description}
              </p>
            </div>
            <Map location={testData.address} />
            <Reviews
              averageRating={testData.rating}
              totalCount={testData.reviewCount}
              id={testData.id}
            />
          </div>

          <div>
            <ReservationContent />
          </div>
        </div>
      </main>
    </>
  );
}
