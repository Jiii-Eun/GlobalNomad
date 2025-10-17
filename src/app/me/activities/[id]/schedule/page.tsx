"use client";
import Image from "next/image";

import Calendar from "@/app/me/components/Calendar";
import { Btn, MeIcon } from "@/components/icons";

export default function Schedule() {
  return (
    <>
      <main className="bg-[#FAFAFA] py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <div className="flex h-fit w-[384px] flex-col gap-6 rounded-xl border border-[#DDDDDD] bg-white px-6 py-6">
            <div className="w-full">
              <div className="relative mx-auto w-fit">
                <Image
                  src="/profileImg.png"
                  alt="프로필 이미지"
                  width={160}
                  height={160}
                  className="rounded-full"
                />
                <Btn.Edit className="absolute right-0 bottom-0 h-11 w-11 rounded-full" />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Me className="h-6 w-6" />
                <div className="text-brand-gray-700 text-left font-bold">내 정보</div>
              </div>
              <div className="flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Reservations className="h-6 w-6" />
                <div className="text-brand-gray-700 text-left font-bold">예약 내역</div>
              </div>
              <div className="flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Reservations className="h-6 w-6" />
                <div className="text-brand-gray-700 text-left font-bold">내 체험 관리</div>
              </div>
              <div className="bg-brand-deep-green-50 flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Register className="text-brand-black-100 h-6 w-6" />
                <div className="text-brand-black-100 text-left font-bold">예약 현황</div>
              </div>
            </div>
          </div>
          <div className="flex w-[792px] flex-col gap-6">
            <div className="flex w-[768px] flex-col gap-8">
              <h1 className="text-3xl font-bold">에약 현황</h1>
              <select className="rounded-4 border border-gray-400 bg-white px-4 py-2">
                <option value="">카테고리</option>
                <option value="culture">문화 체험</option>
                <option value="sports">스포츠</option>
                <option value="music">음악</option>
                <option value="cooking">요리</option>
              </select>
            </div>
            <Calendar />
          </div>
        </div>
      </main>
    </>
  );
}
