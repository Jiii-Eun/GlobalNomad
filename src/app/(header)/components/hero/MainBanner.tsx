import MainBannerClient from "@/app/(header)/components/hero/MainBannerClient";
import { getActivities } from "@/lib/api/activities/api";

export default async function MainBanner() {
  const res = await getActivities({ method: "offset", size: 10 });
  const randomFive = res.activities.sort(() => Math.random() - 0.5).slice(0, 5);

  return <MainBannerClient activities={randomFive} />;
}
