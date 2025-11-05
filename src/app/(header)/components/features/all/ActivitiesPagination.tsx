import { useAtom } from "jotai";

import { ID_ALL_ACTIVITIES } from "@/app/(header)/components/features/all/AllActivities";
import Pagination from "@/components/ui/pagination/Pagination";
import { activityPageAtom } from "@/lib/api/activities/atoms";
import { GetActivitiesRes } from "@/lib/api/activities/types";

interface AllProps {
  size: number;
  data?: GetActivitiesRes;
}

export default function ActivitiesPagination({ size, data }: AllProps) {
  const [page, setPage] = useAtom(activityPageAtom);

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / size);

  return (
    <Pagination
      page={page}
      setPage={setPage}
      totalPages={totalPages}
      size={size}
      id={ID_ALL_ACTIVITIES}
    />
  );
}
