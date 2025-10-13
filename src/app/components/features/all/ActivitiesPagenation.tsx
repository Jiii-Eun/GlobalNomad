"use client";

import { useState } from "react";

import Pagination from "@/components/ui/pagination/Pagination";

export default function ActivitiesPagenation() {
  const [page, setPage] = useState(1);
  return (
    <>
      <Pagination page={page} setPage={setPage} totalPages={9} />
    </>
  );
}
