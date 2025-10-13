"use client";

import { useState } from "react";

import { sharedButtonClass } from "@/app/components/features/all/Categories";
import DropDown from "@/app/me/components/DropDown/Dropdown";
import Button from "@/components/ui/button/Button";

export default function ArrayActivities() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("최신순");

  const sorts = ["리뷰 많은 순", "가격 높은 순", "가격 낮은 순", "최신순"];

  const handleSelect = (sort: string) => {
    setSelectedSort(sort);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center">
      <div className="pointer-events-none absolute top-0 -left-12 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

      <DropDown handleClose={() => setIsOpen(false)}>
        <DropDown.Trigger onClick={() => setIsOpen((prev) => !prev)}>
          <Button variant="w" className={sharedButtonClass}>
            {selectedSort}
          </Button>
        </DropDown.Trigger>
        <DropDown.Menu isOpen={isOpen}>
          {sorts.map((sort) => (
            <DropDown.Item key={sort} onClick={() => handleSelect(sort)}>
              {sort}
            </DropDown.Item>
          ))}
        </DropDown.Menu>
      </DropDown>
    </div>
  );
}
