import { useAtomValue } from "jotai";
import { useMemo } from "react";

import {
  activityCategoryAtom,
  activityKeywordAtom,
  activityMethodAtom,
  activityPageAtom,
  activitySizeAtom,
  activitySortAtom,
} from "@/lib/api/activities/atoms";
import { GetActivitiesReq } from "@/lib/api/activities/types";

export function useActivityParams(defaults?: Partial<GetActivitiesReq>): GetActivitiesReq {
  const method = useAtomValue(activityMethodAtom) ?? defaults?.method ?? "offset";
  const category = useAtomValue(activityCategoryAtom);
  const keyword = useAtomValue(activityKeywordAtom);
  const sort = useAtomValue(activitySortAtom) ?? defaults?.sort ?? "latest";
  const page = useAtomValue(activityPageAtom) ?? defaults?.page ?? 1;
  const size = useAtomValue(activitySizeAtom) ?? defaults?.size;

  return useMemo(
    () => ({ method, category, keyword, sort, page, size }),
    [method, category, keyword, sort, page, size],
  );
}
