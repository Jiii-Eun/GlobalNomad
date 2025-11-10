import AllActivities from "@/app/(header)/components/features/all/AllActivities";
import BestActivities from "@/app/(header)/components/features/best/BestActivities";
import FeaturesClient from "@/app/(header)/components/features/FeaturesClient";
import { GetActivitiesRes } from "@/lib/api/activities/types";

interface FeatureProps {
  allActivities?: GetActivitiesRes;
  bestActivities?: GetActivitiesRes;
}

export default async function Features({ allActivities, bestActivities }: FeatureProps) {
  return (
    <FeaturesClient>
      <BestActivities initialData={bestActivities} />
      <AllActivities initialData={allActivities} />
    </FeaturesClient>
  );
}
