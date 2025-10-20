"use client";

import { useAtomValue } from "jotai";

import { activityKeywordAtom } from "@/lib/api/activities/atoms";

interface Props {
  defaultUI: React.ReactNode;
  keywordUI: React.ReactNode;
}

export default function FeaturesClient({ defaultUI, keywordUI }: Props) {
  const keyword = useAtomValue(activityKeywordAtom);

  // keyword가 비어 있으면 기본 화면, 존재하면 검색 결과
  return keyword && keyword.trim().length > 0 ? keywordUI : defaultUI;
}
