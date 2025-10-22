"use client";

import { useState } from "react";

import { Arrow } from "@/components/icons";
import PaginationButton from "@/components/ui/pagination/PaginationButton";
import SlideFrame from "@/components/ui/pagination/SlideFrame";
import { cn } from "@/lib/cn";

interface dataProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  className?: string;
}

export default function Pagination({ page, setPage, totalPages, className }: dataProps) {
  const pagesGroup = 5;

  const groupIndex = Math.floor((page - 1) / pagesGroup);
  const startPage = groupIndex * pagesGroup + 1;
  const endPage = Math.min(startPage + pagesGroup - 1, totalPages);

  const firstGroup = groupIndex === 0;
  const lastGroup = endPage >= totalPages;
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const [direction, setDirection] = useState<"left" | "right">("right");
  const arrowClass = cn("svg-fill hover:text-white");

  const handlePrevGroup = () => {
    if (!firstGroup) {
      setDirection("left");
      setPage(startPage - pagesGroup);
    }
  };

  const handleNextGroup = () => {
    if (!lastGroup) {
      setDirection("right");
      setPage(startPage + pagesGroup);
    }
  };

  return (
    <div className={cn("flex-center mt-4 gap-[10px]", className)}>
      <PaginationButton disabled={firstGroup} onClick={handlePrevGroup}>
        <Arrow.LeftFill className={cn("size-5", !firstGroup && arrowClass)} />
      </PaginationButton>

      <SlideFrame direction={direction} uniqueKey={startPage} className="flex items-center">
        <div className="flex gap-[10px]">
          {visiblePages.map((num) => {
            const isNum = page === num;

            return (
              <PaginationButton
                key={num}
                onClick={() => setPage(num)}
                aria-current={isNum ? "page" : undefined}
                className={cn("transition-colors", isNum && "bg-brand-deep-green-500 text-white")}
              >
                {num}
              </PaginationButton>
            );
          })}
        </div>
      </SlideFrame>

      <PaginationButton disabled={lastGroup} onClick={handleNextGroup}>
        <Arrow.RightFill className={cn("size-5", !lastGroup && arrowClass)} />
      </PaginationButton>
    </div>
  );
}
