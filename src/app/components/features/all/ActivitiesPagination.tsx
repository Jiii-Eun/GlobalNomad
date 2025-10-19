"use client";

import { useAtom } from "jotai";

import { useActivityParams } from "@/app/components/useActivityParams";
import Pagination from "@/components/ui/pagination/Pagination";
import { activityPageAtom } from "@/lib/api/activities/atoms";
import { useActivities } from "@/lib/api/activities/hooks";

interface AllProps {
  size: number;
}

export default function ActivitiesPagination({ size }: AllProps) {
  const [page, setPage] = useAtom(activityPageAtom);
  const params = useActivityParams();

  const { data } = useActivities(params);

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / size);

  return <Pagination page={page} setPage={setPage} totalPages={totalPages} />;
}
