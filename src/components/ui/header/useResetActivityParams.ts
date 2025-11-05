"use client";

import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

import {
  activityCategoryAtom,
  activityKeywordAtom,
  activitySortAtom,
  activityPageAtom,
} from "@/lib/api/activities/atoms";

export function useResetActivityParams() {
  const router = useRouter();
  const setCategory = useSetAtom(activityCategoryAtom);
  const setKeyword = useSetAtom(activityKeywordAtom);
  const setSort = useSetAtom(activitySortAtom);
  const setPage = useSetAtom(activityPageAtom);

  const resetParams = () => {
    setCategory(undefined);
    setKeyword(undefined);
    setSort("latest");
    setPage(1);

    router.push("/");
  };

  return resetParams;
}
