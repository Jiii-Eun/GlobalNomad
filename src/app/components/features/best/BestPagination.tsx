"use client";

import { useState } from "react";

import Pagination from "@/components/ui/pagination/Pagination";

export default function BestPagination() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex items-center">
      <Pagination page={page} setPage={setPage} totalPages={3} variant="none" />
    </div>
  );
}
