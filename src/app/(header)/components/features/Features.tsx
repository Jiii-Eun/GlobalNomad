import AllActivities from "@/app/(header)/components/features/all/AllActivities";
import BestActivities from "@/app/(header)/components/features/best/BestActivities";
import FeaturesClient from "@/app/(header)/components/features/FeaturesClient";

export default function Features() {
  return (
    <FeaturesClient>
      <BestActivities />
      <AllActivities />
    </FeaturesClient>
  );
}
