"use client";

import Image from "next/image";
import { useState } from "react";

export default function MainBanner() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`mobile:h-[240px] relative mx-auto h-[550px] w-full max-w-[1920px] overflow-hidden transition-[height] duration-500 ease-in-out`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "shimmer opacity-100"
        }`}
      />
      <Image
        src="/images/street-dance-banner.png"
        alt="10월에 가장 인기 있는 체험"
        fill
        className={`object-cover transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        priority
        onLoadingComplete={() => setIsLoaded(true)}
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="container-base tablet:pl-8 mobile:pl-6 tablet:gap-2 absolute inset-0 flex flex-col items-start justify-center gap-5 text-center text-white">
        <h2 className="mobile:text-2xl tablet:text-[54px] text-left text-[68px] font-bold">
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
