"use client";
import Image from "next/image";
import { useState } from "react";

import ProfileSidebar from "@/app/me/components/ProfileSidebar";
import { Btn, Status } from "@/components/icons";
import { ActivityImageUploader } from "@/components/ui/image-uploader";
import TimeSlotPicker from "@/components/ui/timeSlot/TimeSlotPicker";

import CategorySelect from "./components/CategorySelect";

export default function Edit() {
  const [parentSelectedDate, setParentSelectedDate] = useState<Date | null>(null);
  const handleSelectedDateChange = (date: Date | null) => setParentSelectedDate(date);
  const selectedId = "";
  const [category, setCategory] = useState("");

  const [bannerImages, setBannerImages] = useState<(File | string)[]>([]);
  const [introImages, setIntroImages] = useState<(File | string)[]>([]);

  return (
    <>
      <main className="bg-[#FAFAFA] py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <ProfileSidebar initialProfileUrl="/profileImg.png" selectedActivityId={selectedId} />
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
              <CategorySelect
                name="category"
                value={category}
                onChange={setCategory}
                menuPositionClassName="left-0 top-full mt-2"
              />
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
              <div className="flex">
                <ActivityImageUploader type="sub" onChange={setIntroImages} />
                {/* <div className="relative">
                  <Image
                    src="/img2.png"
                    alt="테스트 이미지"
                    width={180}
                    height={180}
                    className="rounded-24 h-45 w-45"
                  />
                  <Status.CloseFill className="absolute top-0 right-0 h-10 w-10 translate-x-1/3 -translate-y-1/3" />
                </div> */}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">소개 이미지</h2>
              <div className="flex gap-6">
                <ActivityImageUploader type="banner" onChange={setBannerImages} />
              </div>
              <span className="text-2lg text-brand-gray-500 pl-2">
                *이미지는 최대 4개까지 등록 가능합니다.
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
