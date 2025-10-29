"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Status } from "@/components/icons";

import Menu from "./menu/Menu";

// import Menu from "@/components/activity/Menu";

// import { ActivitiesExperienceType } from "./ExperienceType";

interface ExperienceType {
  id: number;
  title: string;
  totalPrice: number;
  bannerImageUrl: string;
  activityId: number;
}

export interface ActivitiesExperienceType extends ExperienceType {
  rating: number;
  reviewCount: number;
}

export interface ReservationsExperienceType extends ExperienceType {
  date: string;
  startTime: string;
  endTime: string;
  headCount: number;
  experienceStatus: string;
  reviewSubmitted: boolean;
}

const ActivitiesExperience = ({
  id,
  bannerImageUrl,
  rating,
  reviewCount,
  title,
  totalPrice,
  activityId = 0,
}: ActivitiesExperienceType) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`activities/${activityId}`)}
      className="tablet:h-[156px] mobile:h-[128px] text-black200 flex h-[204px] max-w-[792px] rounded-[24px] bg-white text-[16px]"
      style={{ boxShadow: "0px 4px 16px 0px rgba(17, 34, 17, 0.05)" }}
    >
      <div className="tablet:min-w-[156px] tablet:h-[156px] mobile:min-w-[128px] mobile:h-[128px] relative h-[204px] min-w-[204px]">
        <Image
          src={bannerImageUrl}
          alt="체험 이미지"
          fill
          object-fit="cover"
          className="rounded-l-[24px]"
        />
      </div>
      <div className="tablet:p-[12px] mobile:p-[9px] flex h-full w-full flex-col justify-between p-6 text-left">
        <div>
          <div className="flex gap-[6px]">
            <Status.StarFill className="svg-fill text-brand-yellow-500 h-5 w-5" />
            <span>
              {rating} ({reviewCount})
            </span>
          </div>
          <p className="tablet:text-[18px] mobile:text-[14px] tablet:m-0 mobile:mt-[5px] mt-2 text-[20px] font-bold">
            {title}
          </p>
        </div>
        <div className="mobile:h-[32px] tablet:mt-[12px] mobile:mt-[5px] mobile:mr-[3px] mt-4 flex h-10 items-center justify-between">
          <p className="tablet:text-[20px] mobile:text-[16px] text-[24px] font-medium">
            ₩{totalPrice.toLocaleString("ko-KR")} /인
          </p>
          <div className="">
            <Menu id={id} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default ActivitiesExperience;
