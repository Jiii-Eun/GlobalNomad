"use client";

import { useEffect, useState } from "react";

import { Arrow } from "@/components/icons";
import PaginationButton from "@/components/ui/pagination/PaginationButton";
import { cn } from "@/lib/cn";

interface dataProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  className?: string;
  size?: number;
}

export default function Pagination({ page, setPage, totalPages, className, size }: dataProps) {
  const pagesGroup = 5;

  const [groupIndex, setGroupIndex] = useState(0);
  const startPage = groupIndex * pagesGroup + 1;
  const endPage = Math.min(startPage + pagesGroup - 1, totalPages);

  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  const firstGroup = groupIndex === 0;
  const lastGroup = endPage >= totalPages;

  const arrowButtonClass = "hover:bg-transparent";

  const handlePrevGroup = () => {
    if (!firstGroup) {
      setGroupIndex((prev) => prev - 1);
    }
  };

  const handleNextGroup = () => {
    if (!lastGroup) {
      setGroupIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
    setGroupIndex(0);
  }, [size, setPage]);

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex-center mt-4 gap-[10px]", className)}>
      <PaginationButton
        disabled={firstGroup}
        onClick={handlePrevGroup}
        className={arrowButtonClass}
      >
        <Arrow.LeftFill className={cn("size-5", !firstGroup)} />
      </PaginationButton>

      <div className="flex gap-[10px]">
        {visiblePages.map((num) => {
          const isNum = page === num;

          return (
            <PaginationButton
              key={num}
              onClick={() => setPage(num)}
              aria-current={isNum ? "page" : undefined}
              className={cn(
                "transition-colors",
                isNum && "bg-brand-deep-green-500 text-white",
                "hover:border-0 hover:text-white",
              )}
            >
              {num}
            </PaginationButton>
          );
        })}
      </div>

      <PaginationButton disabled={lastGroup} onClick={handleNextGroup} className={arrowButtonClass}>
        <Arrow.RightFill className={cn("size-5", !lastGroup)} />
      </PaginationButton>
    </div>
  );
}
