import { headers } from "next/headers";

import AllActivities from "@/app/(header)/components/features/all/AllActivities";
import BestActivities from "@/app/(header)/components/features/best/BestActivities";
import FeaturesClient from "@/app/(header)/components/features/FeaturesClient";
import { getActivities } from "@/lib/api/activities/api";

export default async function Features() {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isMobile = /mobile|iphone|ipad|android/i.test(userAgent);

  const [bestRes, allRes] = await Promise.all([
    getActivities({ method: "offset", sort: "most_reviewed", size: 3 }),
    getActivities({ method: "offset", sort: "latest", size: isMobile ? 4 : 8 }),
  ]);

  return (
    <FeaturesClient>
      <BestActivities initialData={bestRes} />
      <AllActivities initialData={allRes} />
    </FeaturesClient>
  );
}
