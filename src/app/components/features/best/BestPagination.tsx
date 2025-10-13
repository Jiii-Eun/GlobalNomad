"use client";

import { useState } from "react";

import { Arrow } from "@/components/icons";
import PaginationButton from "@/components/ui/pagination/PaginationButton";

interface PaginationProps {
  totalCount: number;
}

export default function BestPagination({ totalCount }: PaginationProps) {
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const totalPages = Math.ceil(totalCount / pageSize);

  const firstPage = page === 1;
  const lastPage = page === totalPages;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <PaginationButton onClick={handlePrev} disabled={firstPage} variant="none">
        <Arrow.Left className="size-11" />
      </PaginationButton>
      <PaginationButton onClick={handleNext} disabled={lastPage} variant="none">
        <Arrow.Right className="size-11" />
      </PaginationButton>
    </div>
  );
}
