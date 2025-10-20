import Image from "next/image";

import { EmblaCarousel } from "@/components/ui/embla-carousel/EmblaCarousel";
import { getActivities } from "@/lib/api/activities/api";

export default async function MainBanner() {
  const res = await getActivities({ method: "cursor", size: 20 });
  const randomFive = res.activities.sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <EmblaCarousel autoplayDelay={5000}>
      {randomFive.map((activity) => (
        <div
          key={activity.id}
          className="mobile:h-[240px] relative h-[550px] w-full flex-[0_0_100%]"
        >
          <Image
            src={activity.bannerImageUrl}
            alt={activity.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
          <div className="container-base tablet:pl-8 mobile:pl-6 mobile:gap-0 absolute inset-0 flex flex-col justify-center gap-4 text-white">
            <h2 className="tablet:text-[54px] mobile:text-2xl tablet:max-w-4/5 max-w-1/2 text-[68px] leading-tight font-bold break-keep">
              {activity.title}
            </h2>
            <p className="tablet:text-[20px] mobile:text-md text-2xl font-bold">
              {activity.description}
            </p>
            <div className="tablet:text-2lg mobile:text-md text-xl">이달의 추천 체험 🔥</div>
          </div>
        </div>
      ))}
    </EmblaCarousel>
  );
}
