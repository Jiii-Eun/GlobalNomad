import React from "react";

import { cn } from "@/lib/cn";

const ReservationWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "border-brand-gray-300 relative rounded-2xl border bg-white p-6 shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]",
        "tablet:shadow-none tablet:border-0 tablet:p-0",
      )}
    >
      {children}
    </div>
  );
};

export default ReservationWrap;
