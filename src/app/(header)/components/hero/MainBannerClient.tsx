import Image from "next/image";
import Link from "next/link";

import { EmblaCarousel } from "@/components/ui/embla-carousel/EmblaCarousel";
import { Activity } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";

interface BannerProps {
  activities: Activity[];
}

export default function MainBannerClient({ activities }: BannerProps) {
  return (
    <EmblaCarousel autoplayDelay={5000}>
      {activities.map((activity) => {
        const { id, bannerImageUrl, title, description } = activity;

        return (
          <div
            key={id}
            className="mobile:h-[240px] transition-base relative h-[550px] w-full flex-[0_0_100%]"
          >
            <Image src={bannerImageUrl} alt={title} fill priority={true} className="object-cover" />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
            <div className="container-base tablet:px-8 mobile:px-6 mobile:gap-1 absolute inset-0 flex flex-col justify-center gap-4 text-white">
              <h2 className="tablet:text-[54px] mobile:text-2xl tablet:max-w-3/5 transition-base max-w-1/2 text-[68px] leading-tight font-bold break-keep">
                {title}
              </h2>
              <p
                className={cn(
                  "mobile:text-md tablet:text-[20px] text-2xl font-bold",
                  "transition-all duration-300",
                  "line-clamp-1",
                )}
              >
                {description}
              </p>
              <div className="tablet:text-2lg mobile:text-md text-xl">이달의 추천 체험 🔥</div>
              <Link
                href={`/activities/${id}`}
                className={cn(
                  "rounded-12 flex items-center justify-center bg-white text-lg font-medium transition-all duration-150",
                  "bg-brand-deep-green-500 hover:bg-brand-nomad-black text-white",
                  "tablet:w-40 tablet:h-12 tablet:text-md tablet:mb-6 h-14 w-60",
                )}
              >
                자세히보기
              </Link>
            </div>
          </div>
        );
      })}
    </EmblaCarousel>
  );
}
