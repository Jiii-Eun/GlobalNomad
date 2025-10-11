"use client";

import { useAtomValue } from "jotai";

import {
  activityCategoryAtom,
  activityKeywordAtom,
  activityMethodAtom,
  activityPageAtom,
  activitySizeAtom,
  activitySortAtom,
} from "@/lib/api/activities/atoms";
import { GetActivitiesReq } from "@/lib/api/activities/types";

export function useActivityParams(): GetActivitiesReq {
  const method = useAtomValue(activityMethodAtom);
  const category = useAtomValue(activityCategoryAtom);
  const keyword = useAtomValue(activityKeywordAtom);
  const sort = useAtomValue(activitySortAtom);
  const page = useAtomValue(activityPageAtom);
  const size = useAtomValue(activitySizeAtom);

  return { method, category, keyword, sort, page, size };
}
