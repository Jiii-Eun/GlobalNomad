"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { Misc } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import {
  activityCategoryAtom,
  activityKeywordAtom,
  activityPageAtom,
} from "@/lib/api/activities/atoms";
import { cn } from "@/lib/cn";

export default function SearchForm() {
  const [globalKeyword, setGlobalKeyword] = useAtom(activityKeywordAtom);
  const setCategory = useSetAtom(activityCategoryAtom);
  const setPage = useSetAtom(activityPageAtom);

  const [keyword, setKeyword] = useState(globalKeyword ?? "");

  useEffect(() => {
    setKeyword(globalKeyword ?? "");
  }, [globalKeyword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = keyword.trim();
    setGlobalKeyword(trimmed.length > 0 ? trimmed : undefined);

    setPage(1);
    setCategory(undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value);

  const isActive = keyword.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-brand-gray-300 flex h-14 items-center gap-3 bg-white"
    >
      <div className="rounded-4 border-brand-gray-800 relative flex h-full flex-1 items-center border">
        <Misc.Search className="text-brand-gray-500 size-12" />

        <input
          id="search"
          type="text"
          value={keyword}
          onChange={handleChange}
          className="peer h-full w-full px-2 text-base outline-none"
        />

        <label
          htmlFor="search"
          className={cn(
            "absolute cursor-text bg-white transition-all duration-200",
            "mobile:left-8 top-1/2 left-12 -translate-y-1/2 px-2",
            "text-brand-gray-700 mobile:text-md text-lg font-normal",
            "peer-focus:top-0 peer-focus:text-sm",
            isActive && "top-0 text-sm",
          )}
        >
          내가 원하는 체험은
        </label>
      </div>

      <Button type="submit" className="mobile:max-w-24 h-full w-full max-w-[136px]">
        검색하기
      </Button>
    </form>
  );
}
