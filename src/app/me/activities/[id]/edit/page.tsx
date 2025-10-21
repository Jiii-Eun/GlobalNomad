"use client";
import { useState } from "react";

import { Arrow } from "@/components/icons";
import { ActivityImageUploader } from "@/components/ui/image-uploader";
import Field from "@/components/ui/input/Field";
import Input from "@/components/ui/input/Input";
import TimeSlotPicker from "@/components/ui/timeSlot/TimeSlotPicker";

export default function Edit() {
  const [parentSelectedDate, setParentSelectedDate] = useState<Date | null>(null);
  const handleSelectedDateChange = (date: Date | null) => setParentSelectedDate(date);

  const [bannerImages, setBannerImages] = useState<(File | string)[]>([]);
  const [introImages, setIntroImages] = useState<(File | string)[]>([]);

  return (
    <>
      <div className="flex w-[792px] flex-col gap-6">
        <div className="flex w-[800px] justify-between text-3xl font-bold">
          내 체험 수정
          <button className="rounded-4 bg-brand-nomad-black text-brand-gray-100 h-12 w-30 px-4 py-2 text-lg">
            수정하기
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <Field id="title" className="h-[80px]">
            <Input
              id="title"
              type="text"
              placeholder="제목"
              className="rounded-4 border border-gray-400 bg-white px-4 py-2"
              // aria-invalid={!!errors.title}
            />
          </Field>
          <Field id="category" className="h-[80px]">
            <Input
              as="select"
              id="category"
              required
              defaultValue=""
              className="rounded-4 invalid:text-brand-gray-500 appearance-none border border-gray-400 bg-white py-2 pr-[44px] pl-4"
              rightIcon={<Arrow.Down className="pointer-events-none h-6 w-6" />}
              // aria-invalid={!!errors.category}
              placeholderOption="카테고리"
              options={[
                { value: "culture", label: "문화 예술" },
                { value: "sports", label: "스포츠" },
                { value: "food", label: "삭음료" },
                { value: "tour", label: "투어" },
                { value: "travel", label: "관광" },
                { value: "wellbeing", label: "웰빙" },
              ]}
            />
          </Field>
          <Field id="description">
            <Input
              id="description"
              as="textarea"
              placeholder="설명"
              className="rounded-4 border border-gray-400 bg-white px-4 py-2"
              // aria-invalid={!!errors.description}
            />
          </Field>
          <div className="flex flex-col">
            <label>가격</label>
            <input
              type="text"
              id="price"
              placeholder="가격"
              className="rounded-4 border border-gray-400 bg-white px-4 py-2"
            />
          </div>
          <Field id="address" label="주소" className="text-brand-black h-[80px] text-2xl font-bold">
            <Input
              id="address"
              type="text"
              placeholder="주소를 입력해주세요"
              className="rounded-4 border border-gray-400 bg-white px-4 py-2"
              // aria-invalid={!!errors.address}
            />
          </Field>
        </div>
        <TimeSlotPicker
          selectDate={parentSelectedDate}
          onSelectedDateChange={handleSelectedDateChange}
        />
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">배너 이미지</h2>
          <div className="flex">
            <ActivityImageUploader type="banner" onChange={setBannerImages} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">소개 이미지</h2>
          <div className="flex gap-6">
            <ActivityImageUploader type="sub" onChange={setIntroImages} />
          </div>
          <span className="text-2lg text-brand-gray-800 pl-2">
            *이미지는 최대 4개까지 등록 가능합니다.
          </span>
        </div>
      </div>
    </>
  );
}
