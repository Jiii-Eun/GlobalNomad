"use client";
import Image from "next/image";

import { Status } from "@/components/icons";

import { testReview } from "../../[id]/testData/testReview";

export function formatDate(dateString: string) {
  // 입력된 날짜 문자열을 Date 객체로 변환
  const date = new Date(dateString);

  // 연, 월, 일을 추출
  const year = date.getFullYear().toString(); // 연도의 마지막 두 자리
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = date.getDate().toString().padStart(2, "0"); // 일자를 2자리로 맞춤

  // 원하는 형식으로 포맷팅
  return `${year}.${month}.${day}`;
}
export default function ReviewContainer({ id }: { id: number }) {
  return (
    <div>
      {testReview &&
        testReview.reviews.map((item) => {
          const { user } = item;
          const { profileImageUrl, nickname } = user;
          return (
            <div
              className="border-brand-nomad-black/25 flex gap-4 border-t py-6 first:border-none first:pt-0"
              key={item.id}
            >
              <div
                style={{ minHeight: "45px", minWidth: "45px" }}
                className="relative size-[45px] overflow-hidden rounded-[45px] bg-[#E3E5E8]"
              >
                {profileImageUrl && (
                  <Image
                    src={profileImageUrl}
                    alt="기본프로필이미지"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* <div className="flex items-center gap-[3px]">
                    <Status.StarFill className="svg-fill text-brand-yellow-500 size-5" />
                    <p className="text-brand-nomad-black text-lg">{item.rating}</p>
                  </div> */}
                  <p className="text-brand-nomad-black text-lg font-normal">{nickname}</p>
                  <p>|</p>
                  <p className="text-brand-gray-600 text-lg font-normal">
                    {formatDate(item.updatedAt)}
                  </p>
                </div>
                <div className="text-brand-nomad-black text-lg">{item.content}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
