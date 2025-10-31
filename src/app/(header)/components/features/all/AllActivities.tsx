import ActivitiesTitle from "@/app/(header)/components/features/all/ActivitiesTitle";
import AllActivitiesList from "@/app/(header)/components/features/all/AllActivitiesList";
import ArrayActivities from "@/app/(header)/components/features/all/ArrayActivities";
import Categories from "@/app/(header)/components/features/all/Categories";
import { InitActivityProps } from "@/app/(header)/components/features/best/BestActivities";

export default function AllActivities({ initialData }: InitActivityProps) {
  return (
    <div>
      <div className="mt-[60px] flex items-center justify-between">
        <Categories />
        <ArrayActivities />
      </div>

      <ActivitiesTitle />

      <AllActivitiesList initialData={initialData} />
    </div>
  );
}
