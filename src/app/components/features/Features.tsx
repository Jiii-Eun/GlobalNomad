import AllActivities from "@/app/components/features/all/AllActivities";
import BestActivities from "@/app/components/features/best/BestActivities";
import FeaturesClient from "@/app/components/features/FeaturesClient";

export default function Features() {
  return (
    <FeaturesClient>
      <BestActivities />
      <AllActivities />
    </FeaturesClient>
  );
}
