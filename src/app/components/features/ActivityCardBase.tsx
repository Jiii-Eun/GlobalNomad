"use client";

import Link from "next/link";
import React from "react";

import BackgroundImage from "@/app/components/BackgroundImage";
import { Status } from "@/components/icons";
import { cn } from "@/lib/cn";

interface Props {
  id: number;
  title: string;
  price: number;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;

  cardClass?: string;
  contentClass?: string;
  imageClass?: string;
  backgroundOverlay?: string;
  children?: React.ReactNode;
}

export default function ActivityCardBase({
  id,
  title,
  price,
  bannerImageUrl,
  rating,
  reviewCount,
  cardClass,
  contentClass,
  imageClass,
  backgroundOverlay,
  children,
}: Props) {
  return (
    <div
      className={cn(
        "text-black-200 tablet:hover:-translate-y-3 mobile:hover:-translate-y-2 duration-500 hover:-translate-y-5",
        cardClass,
      )}
    >
      <Link href={`/activities/${id}`}>
        <div
          className={cn(
            "relative block aspect-square w-full overflow-hidden rounded-[20px]",
            imageClass,
          )}
        >
          <BackgroundImage src={bannerImageUrl} alt={title} overlay={backgroundOverlay} />
        </div>

        {children && <div className="absolute inset-0 z-20">{children}</div>}
      </Link>

      <div className={cn("mt-4", contentClass)}>
        <div className="flex items-center gap-1 text-base">
          <Status.StarFill className="h-5 w-5" />
          <span>{rating}</span>
          <span className="text-brand-gray-500">({reviewCount})</span>
        </div>

        <Link
          href={`/activities/${id}`}
          className="mt-1 line-clamp-2 block overflow-hidden text-2xl font-bold"
        >
          {title}
        </Link>

        <div className="mobile:text-xl mt-3 text-3xl">
          ₩ {price.toLocaleString("ko-KR")}
          <span className="text-gray400 mobile:text-base text-xl">/ 인</span>
        </div>
      </div>
    </div>
  );
}
