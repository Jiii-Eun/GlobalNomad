"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";

import Button from "@/components/ui/button/Button";
import { activityCategoryAtom, activityPageAtom } from "@/lib/api/activities/atoms";
import { ActivityCategory, ActivityCategorySchema } from "@/lib/api/activities/types";
import { cn } from "@/lib/cn";

export const sharedButtonClass = "text-2lg h-[58px] w-[127px] rounded-[15px] whitespace-nowrap";

export default function Categories() {
  const categories = ["모두", ...ActivityCategorySchema.options] as const;
  const [selected, setSelected] = useState("모두");

  const setCategory = useSetAtom(activityCategoryAtom);
  const setPage = useSetAtom(activityPageAtom);

  const handleSelect = (category: "모두" | ActivityCategory) => {
    setSelected(category);

    setCategory(category === "모두" ? undefined : category);

    setPage(1);
  };

  return (
    <div className="scrollbar-hide w-full overflow-x-auto">
      <div className="flex min-w-max gap-4 px-2">
        {categories.map((category) => {
          const isSelected = selected === category;

          return (
            <Button
              key={category}
              variant="w"
              onClick={() => handleSelect(category)}
              className={cn(
                sharedButtonClass,
                "mobile:w-[100px] mobile:h-[41px] tablet:w-[120px]",
                isSelected && "bg-brand-deep-green-500 text-white",
                "hover:text-brand-nomad-black hover:border-0 hover:font-bold",
              )}
            >
              {category}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
