import AllActivities from "@/app/components/features/all/AllActivities";
import KeywordActivities from "@/app/components/features/all/KeywordActivities";
import BestActivities from "@/app/components/features/best/BestActivities";
import FeaturesClient from "@/app/components/features/FeaturesClient";

export default function Features() {
  return (
    <FeaturesClient
      defaultUI={
        <>
          <BestActivities />
          <AllActivities />
        </>
      }
      keywordUI={<KeywordActivities />}
    />
  );
}
