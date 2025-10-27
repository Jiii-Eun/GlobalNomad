// # 예약내역 (/me/reservations)
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ActivityCardBase from "@/app/components/features/ActivityCardBase";
import { Arrow } from "@/components/icons";
import DropDown from "@/components/ui/DropDown/Dropdown";
import { useMyReservations } from "@/lib/api/my-reservations/hooks";

export default function Reservations() {
  const { data } = useMyReservations({ size: 10 });
  const reserv = data?.reservations[0]; // 예약 상태 예시값
  const textProps = () => {
    const textPropsObj = { color: "", text: "-" };

    switch (reserv?.status) {
      case "pending":
        textPropsObj.color = "text-blue200";
        textPropsObj.text = "예약 완료";
        break;
      case "confirmed":
        textPropsObj.color = "text-[#FF7C1D]";
        textPropsObj.text = "예약 승인";
        break;
      case "declined":
        textPropsObj.color = "text-red100";
        textPropsObj.text = "예약 거절";
        break;
      case "canceled":
        textPropsObj.color = "text-gray500";
        textPropsObj.text = "예약 취소";
        break;
      case "completed":
        textPropsObj.color = "text-gray500";
        textPropsObj.text = "체험 완료";
        break;
    }

    return textPropsObj;
  };
  const [openId, setOpenId] = useState<number | null>(null);
  const toggleMenu = (id: number) => setOpenId((prev) => (prev === id ? null : id));
  const closeMenu = () => setOpenId(null);
  return (
    <>
      <main className="bg-[#FAFAFA] py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <div className="flex h-fit min-h-[800px] w-[800px] flex-col gap-10">
            <div className="flex justify-between">
              <p className="flex text-3xl font-bold">예약 내역</p>
              <div className="rounded-16 border border-[#0B3B2D] bg-white px-4 py-2">
                <DropDown handleClose={closeMenu}>
                  <DropDown.Trigger onClick={() => toggleMenu(0)}>
                    <div className="space-between mb-1 flex flex-row items-center">
                      <div className="text-2lg font-medium text-[#0B3B2D]" />
                      필터
                      <Arrow.DownFill className="svg-fill ml-12 h-5 w-6 text-[#0B3B2D]" />
                    </div>
                  </DropDown.Trigger>
                  <DropDown.Menu isOpen={openId === 0}>
                    <DropDown.Item onClick={() => undefined}>예약 신청</DropDown.Item>
                    <DropDown.Item onClick={() => undefined}>예약 취소</DropDown.Item>
                    <DropDown.Item onClick={() => undefined}>예약 승인</DropDown.Item>
                    <DropDown.Item onClick={() => undefined}>예약 거절</DropDown.Item>
                    <DropDown.Item onClick={() => undefined}>체험 완료</DropDown.Item>
                  </DropDown.Menu>
                </DropDown>
              </div>
            </div>
            <div>
              <ul className="flex list-none flex-col gap-6">
                <li
                  className="tablet:h-[156px] mobile:h-[128px] text-black200 flex h-[204px] max-w-[792px] rounded-[24px] bg-white text-[16px]"
                  style={{ boxShadow: "0px 4px 16px 0px rgba(17, 34, 17, 0.05)" }}
                >
                  <Link
                    href={`/activities/${reserv?.activity.id}`}
                    // href={`activities/${activityId}`}
                    className="tablet:h-[156px] mobile:h-[128px] text-black200 flex h-[204px] max-w-[792px] rounded-[24px] bg-white text-[16px]"
                  >
                    <div className="tablet:min-w-[156px] tablet:h-[156px] mobile:min-w-[128px] mobile:h-[128px] relative h-[204px] min-w-[204px]">
                      <Image
                        src={reserv?.activity.bannerImageUrl || "/testimage.png"}
                        alt="체험 이미지"
                        fill
                        object-fit="cover"
                        className="rounded-l-[24px]"
                      />
                    </div>
                    <div className="tablet:p-[12px] mobile:p-[9px] flex h-full w-full flex-col justify-between p-6 text-left">
                      <div>
                        <p className={`${textProps().color} mobile:text-[14px] font-bold`}>
                          {textProps().text}
                        </p>
                        <p className="tablet:text-[18px] mobile:text-[14px] tablet:m-0 mobile:mt-[5px] mt-2 text-[20px] font-bold">
                          {reserv?.activity.title}
                        </p>
                        <p className="tablet:text-[14px] mobile:text-[12px] tablet:mt-[5px] mobile:mt-[5px] mt-3 text-[18px]">
                          {reserv?.date} · {reserv?.startTime} - {reserv?.endTime} ·{" "}
                          {reserv?.headCount}명
                        </p>
                      </div>
                      <div className="mobile:h-[32px] tablet:mt-[12px] mobile:mt-[5px] mobile:mr-[3px] mt-4 flex h-10 items-center justify-between">
                        <p className="tablet:text-[20px] mobile:text-[16px] text-[24px] font-medium">
                          ₩{reserv?.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
