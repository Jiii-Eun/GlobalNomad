"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";

import DropDown from "@/components/ui/DropDown/Dropdown";
import { activitySortAtom } from "@/lib/api/activities/atoms";
import { ActivitySort } from "@/lib/api/activities/types";

export default function ArrayActivities() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("최신순");

  const sortMap: Record<string, ActivitySort> = {
    "리뷰 많은 순": "most_reviewed",
    "가격 높은 순": "price_desc",
    "가격 낮은 순": "price_asc",
    최신순: "latest",
  };

  const sorts = Object.keys(sortMap);

  const setSort = useSetAtom(activitySortAtom);

  const handleSelect = (sortLabel: string) => {
    setSelectedSort(sortLabel);
    setSort(sortMap[sortLabel]);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center">
      <div className="pointer-events-none absolute top-0 -left-12 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

      <DropDown handleClose={() => setIsOpen(false)}>
        <DropDown.Trigger
          onClick={() => setIsOpen((prev) => !prev)}
          customButton={selectedSort}
          isOpen={isOpen}
        />

        <DropDown.Menu isOpen={isOpen}>
          {sorts.map((sortLabel) => (
            <DropDown.Item key={sortLabel} onClick={() => handleSelect(sortLabel)}>
              {sortLabel}
            </DropDown.Item>
          ))}
        </DropDown.Menu>
      </DropDown>
    </div>
  );
}
