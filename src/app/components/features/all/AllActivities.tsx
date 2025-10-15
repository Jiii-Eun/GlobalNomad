import ActivitiesPagenation from "@/app/components/features/all/ActivitiesPagenation";
import AllActivitiesList from "@/app/components/features/all/AllActivitiesList";
import ArrayActivities from "@/app/components/features/all/ArrayActivities";
import Categories from "@/app/components/features/all/Categories";
import { cn } from "@/lib/cn";

export default function AllActivities() {
  return (
    <div className="">
      <div className="mt-[60px] flex justify-between">
        <Categories />
        <ArrayActivities />
      </div>

      <div className="mt-[35px] mb-8 flex justify-between">
        <h2 className={cn("text-4xl font-bold", "mobile:text-2lg")}>🛼 모든 체험</h2>
      </div>
      <AllActivitiesList />

      <ActivitiesPagenation />
    </div>
  );
}
