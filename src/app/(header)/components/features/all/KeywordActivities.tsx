"use client";

import { useAtomValue } from "jotai";

import AllActivitiesList from "@/app/(header)/components/features/all/AllActivitiesList";
import ArrayActivities from "@/app/(header)/components/features/all/ArrayActivities";
import { useActivityParams } from "@/app/(header)/components/useActivityParams";
import { activityKeywordAtom } from "@/lib/api/activities/atoms";
import { useActivities } from "@/lib/api/activities/hooks";
import { cn } from "@/lib/cn";

export default function KeywordActivities() {
  const keyword = useAtomValue(activityKeywordAtom);

  const params = useActivityParams();
  const { data } = useActivities(params);

  const totalCount = data?.totalCount;

  return (
    <div>
      <div className={cn("mt-[60px] text-3xl font-normal", "mobile:text-2xl")}>
        <span className="font-bold">&quot; {keyword} &quot; </span>
        (으)로 검색한 결과입니다.
      </div>

      <div className="mt-3 text-lg">총 {totalCount}개의 결과</div>

      <div className="-mt-4 mb-12 flex items-center justify-end">
        <ArrayActivities />
      </div>

      <AllActivitiesList />

      {totalCount === 0 && (
        <p className="text-brand-gray-500 col-span-full py-10 text-center">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
