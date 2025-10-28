import Link from "next/link";
import React from "react";

import { Status } from "@/components/icons";
import BackgroundImage from "@/components/ui/BackgroundImage";
import { Activity } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";

type CardProps = Pick<
  Activity,
  "id" | "title" | "price" | "bannerImageUrl" | "rating" | "reviewCount"
> & {
  cardClass?: string;
  contentClass?: string;
  imageClass?: string;
  titleClass?: string;
  priceClass?: string;
  variant?: "default" | "best";
  backgroundOverlay?: string;
  children?: React.ReactNode;
};

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
}: CardProps) {
  const best = variant === "best";

  return (
    <div
      className={cn(
        "text-black-200 tablet:hover:-translate-y-3 mobile:hover:-translate-y-2 duration-500 hover:-translate-y-5",
      )}
    >
      <Link href={`/activities/${id}`} className={cn("relative", best && "text-white")}>
        <div
          className={cn(
            "relative block aspect-square w-full overflow-hidden rounded-[20px]",
            best && "",
          )}
        >
          <BackgroundImage src={bannerImageUrl} alt={title} overlay={backgroundOverlay} />
        </div>

        {children && <div className="absolute inset-0 z-20">{children}</div>}

        <div className={cn("mt-4", best && "absolute bottom-[30px] left-5 max-w-3/4")}>
          <div className="flex items-center gap-1 text-base">
            <Status.StarFill className="size-5" />
            <span>{rating}</span>
            <span className={cn("text-brand-gray-500", best && "text-white")}>({reviewCount})</span>
          </div>

          <span
            className={cn(
              "mt-2.5 block text-2xl font-bold break-keep",
              best && "mobile:text-2lg text-3xl font-bold",
            )}
          >
            {title}
          </span>

          <div
            className={cn(
              "mobile:text-xl mt-3 text-2xl font-bold",
              best && "mobile:text-2lg text-xl",
            )}
          >
            ₩ {price.toLocaleString("ko-KR")}{" "}
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
      </Link>
    </div>
  );
}
