"use client";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

// import useClickOutside from "@/app/(header)/me/components/DropDown/useClickOutside";
import { Misc } from "@/components/icons";

export default function Menu({ id: activityId }: { id: number }) {
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // 메뉴 열고 닫기
  const handleKebabToggle = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const handleDeletePopupOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="relative">
      <span
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isKebabOpen}
        aria-label="메뉴 열기"
        onClick={(e) => {
          e.stopPropagation();
          handleKebabToggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            handleKebabToggle();
          }
        }}
        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
      >
        <Misc.MenuDot className="svg-fill text-gray600 h-6 w-6" />
      </span>
      {isKebabOpen && (
        <div
          className="border-gray200 absolute right-0 z-[1] w-40 rounded-md border bg-white"
          ref={ref}
        >
          <div
            className="text-h4-regular text-gray600 hover:bg-green400 hover:text-green200 cursor-pointer px-[46px] py-[18px]"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/activities/register/${activityId}`);
            }}
          >
            수정하기
          </div>
          <div
            className="border-gray200 text-h4-regular text-gray600 hover:bg-green400 hover:text-green200 cursor-pointer border-t px-[46px] py-[18px]"
            onClick={handleDeletePopupOpen}
          >
            삭제하기
          </div>
        </div>
      )}
    </div>
  );
}
