"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Status } from "@/components/icons";

interface Props {
  id: number;
  title: string;
  price: number;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
}

const ActivityCardBase = ({ id, title, price, bannerImageUrl, rating, reviewCount }: Props) => {
  return (
    <div className="text-black200 tablet:hover:-translate-y-3 mobile:hover:-translate-y-2 duration-500 hover:-translate-y-5">
      <Link href={`/activities/${id}`} className="block overflow-hidden rounded-3xl">
        <div className="bg-custom-gradient2 pc:w-[283px] pc:h-[283px] mobile:w-[168px] mobile:h-[168px] absolute z-10 h-[224px] w-[224px]" />
        <Image src={bannerImageUrl} alt={title} width={283} height={283} className="object-cover" />
      </Link>
      <div className="mt-[16px] flex gap-[5px] text-base">
        <Status.StarFill className="svg-fill text-brand-yellow-500 h-5 w-5" />
        {rating} <span className="gray400">({reviewCount})</span>
      </div>
      <Link
        href={`/activities/${id}`}
        className="block overflow-hidden rounded-3xl text-2xl font-bold"
      >
        {title}
      </Link>
      <div className="mobile:text-xl mt-[15px] text-3xl">
        ₩ {price.toLocaleString("ko-KR")}{" "}
        <span className="text-gray400 mobile:text-base text-xl">/ 인</span>
      </div>
    </div>
  );
};

export default ActivityCardBase;
