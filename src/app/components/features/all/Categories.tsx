"use client";

import { useState } from "react";

import Button from "@/components/ui/button/Button";
import { ActivityCategorySchema } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";

export const sharedButtonClass = cn(
  "text-2lg h-[58px] w-[127px] rounded-[15px] whitespace-nowrap",
  "mobile:w-[100px] mobile:h-[41px] tablet:w-[120px]",
);

export default function Categories() {
  const categories = ["모두", ...ActivityCategorySchema.options];
  const [selected, setSelected] = useState("모두");

  return (
    // 케러셀 활용
    <div className="scrollbar-hide scrollbar-hide w-full overflow-x-auto">
      <div className="flex min-w-max gap-4 px-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="w"
            onClick={() => setSelected(category)}
            className={cn(sharedButtonClass, "hover:border-0 hover:text-white")}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
