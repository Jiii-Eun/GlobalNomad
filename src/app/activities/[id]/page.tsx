"use client";

import Image from "next/image";

import { Status, Misc } from "@/components/icons";

import ReservationContent from "../components/reservations/ReservationContent";

export default function ActivitiesDetailPage({ params }: { params: { id: number } }) {
  return (
    <>
      <main className="mx-auto mb-24 max-w-[1200px] px-[24px]">
        <div>
          <div className="mt-[78px] flex max-w-[1200px] items-center justify-between">
            <div className="flex flex-col">
              <div className="text-nomad-black text-body2-regular">문화 · 예술</div>
              <p className="mt-2.5 mb-4 text-3xl">함께 배우면 즐거운 스트릿 댄스</p>
              <div className="flex gap-[12px]">
                <div className="flex items-center gap-[6px]">
                  <Status.StarFill className="svg-fill text-brand-yellow-500 h-5 w-5" />
                  <p className="text-body2-regular text-nomad-black">5 (6)</p>
                </div>
                <div className="flex items-center gap-[6px]">
                  <Misc.Location className="svg-fill h-5 w-5" />
                  <p className="text-body2-regular text-nomad-black">
                    서울특별시 강남구 테헤란로 427{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="tablet:h-[310px] tablet:gap-1 mobile:h-[310px] mobile:rounded-none mt-[42px] flex h-[540px] gap-2 overflow-hidden rounded-2xl"
          style={{ boxShadow: "0px 4px 12px rgba(17, 34, 17, 0.05)" }}
        >
          <div className="mobile:hidden bg-custom-gradient2 pc:w-[600px] pc:h-[540px] h-full w-full flex-shrink-0">
            <Image
              src="/testimage.png"
              alt="배너이미지"
              width={600}
              height={540}
              className="h-full w-full object-cover"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <div className="mt-[50px] flex gap-5">
          <div className={`flex w-full flex-col`}>
            <div className="border-gray200 flex flex-col gap-[16px] border-t py-[40px]">
              <p className="text-h3-bold text-nomad-black">체험 설명</p>
              <p className="text-body1-regular text-nomad-black whitespace-pre-wrap">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae, eligendi! Doloribus
                ipsam ducimus quia, iusto magni recusandae consequatur. Velit, ipsum vero omnis
                consequatur facere maxime quis harum delectus repudiandae quod.
              </p>
            </div>
            <div className="border-gray200 flex flex-col gap-[16px] border-t py-[40px]">
              <Image
                src="/testmapimg.png"
                alt="배너이미지"
                width={600}
                height={540}
                className="h-full w-full object-cover"
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <div className="border-gray200 flex flex-col gap-6 border-t py-[40px]">
              <p className="text-h3-bold text-nomad-black">후기</p>
              <div className="flex items-center gap-4">
                <p className="text-nomad-black text-[50px] leading-normal font-semibold">5</p>
                <div className="flex flex-col gap-[8px]">
                  <p className="text-h4-regular text-nomad-black">만족</p>
                  <div className="flex items-center gap-[6px]">
                    <Status.StarFill className="svg-fill text-brand-yellow-500 h-5 w-5" />
                    <p className="text-body2-regular text-nomad-black">10개 후기</p>
                  </div>
                </div>
              </div>
              <div className="text-h2 text-gray600 flex items-center">아직 후기가 없어요.</div>
            </div>
          </div>

          <div>
            <ReservationContent />
          </div>
        </div>
      </main>
    </>
  );
}
