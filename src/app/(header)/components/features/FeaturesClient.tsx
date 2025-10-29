"use client";

import { useAtomValue } from "jotai";

import KeywordActivities from "@/app/(header)/components/features/all/KeywordActivities";
import { activityKeywordAtom } from "@/lib/api/activities/atoms";

export default function FeaturesClient({ children }: { children: React.ReactNode }) {
  const keyword = useAtomValue(activityKeywordAtom);

  if (Number(keyword?.trim().length) > 0) {
    return <KeywordActivities />;
  }

  return <>{children}</>;
}
