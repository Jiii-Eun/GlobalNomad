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
  titleClass?: string;
  priceClass?: string;

  variant?: "default" | "best";
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
  variant = "default",
  backgroundOverlay,
  children,
}: Props) {
  const best = variant === "best";

  return (
    <div
      className={cn(
        "text-black-200 tablet:hover:-translate-y-3 mobile:hover:-translate-y-2 duration-500 hover:-translate-y-5",
        best && "relative text-white",
      )}
    >
      <Link href={`/activities/${id}`}>
        <div
          className={cn(
            "relative block aspect-square w-full overflow-hidden rounded-[20px]",
            best && "",
          )}
        >
          <BackgroundImage src={bannerImageUrl} alt={title} overlay={backgroundOverlay} />
        </div>

        {children && <div className="absolute inset-0 z-20">{children}</div>}
      </Link>

      <div className={cn("mt-4", best && "absolute bottom-[30px] left-5 max-w-3/4")}>
        <div className="flex items-center gap-1 text-base">
          <Status.StarFill className="size-5" />
          <span>{rating}</span>
          <span className="text-brand-gray-500">({reviewCount})</span>
        </div>

        <Link href={`/activities/${id}`} className="mt-1 line-clamp-2 block overflow-hidden">
          <span
            className={cn(
              "text-2xl font-bold",
              best && "mobile:text-2lg text-3xl font-bold text-white",
            )}
          >
            {title}
          </span>
        </Link>

        <div
          className={cn(
            "mobile:text-xl mt-3 text-2xl font-bold",
            best && "mobile:text-2lg text-xl",
          )}
        >
          ₩ {price.toLocaleString("ko-KR")}
          <span
            className={cn(
              "text-brand-gray-900 mobile:text-lg text-xl font-normal",
              best && "text-md text-brand-gray-700",
            )}
          >
            / 인
          </span>
        </div>
      </div>
    </div>
  );
}
