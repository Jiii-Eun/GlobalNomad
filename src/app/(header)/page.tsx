import Features from "@/app/(header)/components/features/Features";
import MainBannerClient from "@/app/(header)/components/hero/MainBannerClient";
import Search from "@/app/(header)/components/hero/Search";
import { getActivities } from "@/lib/api/activities/api";
import { GetActivitiesRes } from "@/lib/api/activities/types";

export const dynamic = "force-static";

export default async function Home() {
  const [latestRes, bestRes] = await Promise.all([
    getActivities({ method: "offset", sort: "latest", size: 20 }),
    getActivities({ method: "offset", sort: "most_reviewed", size: 20 }),
  ]);

  const latestData: GetActivitiesRes = latestRes;
  const bestData: GetActivitiesRes = bestRes;

  const activities = latestData.activities;

  const bestActivities = {
    ...bestData,
    activities: bestData.activities.slice(0, 3),
  };

  const allActivities = {
    ...latestData,
    activities: activities.slice(0, 8),
  };

  const bannerActivities = activities.sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <div>
      <MainBannerClient bannerActivities={bannerActivities} />
      <div className="container-base tablet:px-6 mobile:px-4 mb-52">
        <Search />
        <Features allActivities={allActivities} bestActivities={bestActivities} />
      </div>
    </div>
  );
}
