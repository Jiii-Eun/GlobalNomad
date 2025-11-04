"use client";

import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  activityCategoryAtom,
  activityKeywordAtom,
  activityPageAtom,
} from "@/lib/api/activities/atoms";
import { ActivityCategorySchema, ActivityCategory } from "@/lib/api/activities/types";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function useSyncActivityParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useAtom(activityCategoryAtom);
  const [keyword, setKeyword] = useAtom(activityKeywordAtom);
  const [page, setPage] = useAtom(activityPageAtom);

  const syncFromURL = () => {
    const params =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : searchParams;

    const cParam = params.get("category");
    const kParam = params.get("keyword");
    const pParam = Number(params.get("page") ?? "1");

    const c =
      cParam && ActivityCategorySchema.safeParse(cParam).success
        ? (cParam as ActivityCategory)
        : undefined;

    setCategory(c);
    setKeyword(kParam ?? undefined);
    setPage(pParam);
  };

  useEffect(() => {
    syncFromURL();
  }, []);

  useEffect(() => {
    const handlePopState = () => syncFromURL();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (debouncedKeyword) params.set("keyword", debouncedKeyword);
    if (page && page !== 1) params.set("page", String(page));

    router.push(`?${params.toString()}`);
  }, [category, debouncedKeyword, page]);
}
