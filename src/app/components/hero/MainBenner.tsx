import Image from "next/image";

import { cn } from "@/lib/cn";

export default function MainBanner() {
  return (
    <div className="mobile:h-[240px] relative mx-auto h-[550px] w-full max-w-[1920px] overflow-hidden transition-[height] duration-700">
      <Image
        src="/images/street-dance-banner.png"
        alt="10월에 가장 인기 있는 체험"
        fill
        priority
        className="object-cover"
      />

      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.5)] transition-colors duration-700"
        aria-hidden="true"
      />

      <div
        className={cn(
          "container-base absolute inset-0",
          "flex flex-col items-start justify-center gap-5",
          "text-center text-white",
          "tablet:pl-8 mobile:pl-6 tablet:gap-2",
        )}
      >
        <h2
          className={cn(
            "transition-base text-left text-[68px] font-bold",
            "mobile:text-2xl tablet:text-[54px]",
          )}
        >
          함께 배우면 즐거운
          <br />
          스트릿 댄스
        </h2>
        <p className="mobile:text-md tablet:text-[20px] text-2xl">
          10월의 인기 체험을 지금 예약하세요
        </p>
      </div>
    </div>
  );
}
