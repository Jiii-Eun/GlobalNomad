"use client";

import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  activityCategoryAtom,
  activityKeywordAtom,
  activitySortAtom,
  activityPageAtom,
  activitySizeAtom,
} from "@/lib/api/activities/atoms";
import {
  ActivityCategorySchema,
  ActivitySortSchema,
  ActivityCategory,
  ActivitySort,
} from "@/lib/api/activities/types";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function useSyncActivityParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useAtom(activityCategoryAtom);
  const [keyword, setKeyword] = useAtom(activityKeywordAtom);
  const [sort, setSort] = useAtom(activitySortAtom);
  const [page, setPage] = useAtom(activityPageAtom);
  const [size, setSize] = useAtom(activitySizeAtom);

  useEffect(() => {
    const cParam = searchParams.get("category");
    const sParam = searchParams.get("sort");
    const kParam = searchParams.get("keyword");
    const pParam = Number(searchParams.get("page") ?? "1");
    const szParam = Number(searchParams.get("size") ?? "8");

    const c =
      cParam && ActivityCategorySchema.safeParse(cParam).success
        ? (cParam as ActivityCategory)
        : undefined;

    const s =
      sParam && ActivitySortSchema.safeParse(sParam).success ? (sParam as ActivitySort) : "latest";

    setCategory(c);
    setKeyword(kParam ?? undefined);
    setSort(s);
    setPage(pParam);
    setSize(szParam);
  }, []);

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (debouncedKeyword) params.set("keyword", debouncedKeyword);
    if (sort) params.set("sort", sort);
    if (page && page !== 1) params.set("page", String(page));
    if (size && size !== 8) params.set("size", String(size));

    router.push(`?${params.toString()}`);
  }, [category, debouncedKeyword, sort, page, size]);
}
