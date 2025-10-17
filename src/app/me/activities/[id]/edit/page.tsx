"use client";
import Image from "next/image";
import { useState } from "react";

import TimeSlotPicker from "@/app/me/components/TimeSlotPicker";
import { Btn, MeIcon, Status } from "@/components/icons";

export default function Edit() {
  const [parentSelectedDate, setParentSelectedDate] = useState<Date | null>(null);
  const handleSelectedDateChange = (date: Date | null) => setParentSelectedDate(date);

  return (
    <>
      <main className="bg-brand-gray-100 py-18">
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
              <div className="bg-brand-deep-green-50 flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Schedule className="text-brand-black-100 h-6 w-6" />
                <div className="text-brand-black-100 text-left font-bold">내 체험 관리</div>
              </div>
              <div className="flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Register className="h-6 w-6" />
                <div className="text-brand-gray-700 text-left font-bold">예약 현황</div>
              </div>
            </div>
          </div>
          <div className="flex w-[792px] flex-col gap-6">
            <div className="flex w-[800px] justify-between text-3xl font-bold">
              내 체험 등록
              <button className="rounded-4 bg-brand-nomad-black text-brand-gray-100 h-12 w-30 px-4 py-2 text-lg">
                등록하기
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="제목"
                className="rounded-4 border border-gray-400 bg-white px-4 py-2"
              />
              <select className="rounded-4 border border-gray-400 bg-white px-4 py-2">
                <option value="" className="text-gray-200">
                  카테고리
                </option>
                <option value="culture">문화 체험</option>
                <option value="sports">스포츠</option>
                <option value="music">음악</option>
                <option value="cooking">요리</option>
              </select>
              <textarea
                placeholder="설명"
                className="rounded-4 h-[346px] border border-gray-400 bg-white px-4 py-2"
              />
              <div className="flex flex-col">
                <label>가격</label>
                <input
                  type="text"
                  id="price"
                  placeholder="가격"
                  className="rounded-4 border border-gray-400 bg-white px-4 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label>주소</label>
                <input
                  type="text"
                  placeholder="주소"
                  className="rounded-4 border border-gray-400 bg-white px-4 py-2"
                />
              </div>
            </div>
            <TimeSlotPicker
              selectDate={parentSelectedDate}
              onSelectedDateChange={handleSelectedDateChange}
            />
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">배너 이미지</h2>
              <div className="flex gap-6">
                <Btn.AddImage className="h-45 w-45" />
                <div className="relative">
                  <Image
                    src="/img2.png"
                    alt="테스트 이미지"
                    width={180}
                    height={180}
                    className="rounded-24 h-45 w-45"
                  />
                  <Status.CloseFill className="absolute top-0 right-0 h-10 w-10 translate-x-1/3 -translate-y-1/3" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">소개 이미지</h2>
              <div className="flex gap-6">
                <Btn.AddImage className="h-45 w-45" />
              </div>
              <span className="text-2lg text-brand-gray-700 pl-2">
                *이미지는 최대 4개까지 등록 가능합니다.
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
