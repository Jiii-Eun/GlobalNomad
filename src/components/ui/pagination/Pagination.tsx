import { Arrow } from "@/components/icons";
import PaginationButton from "@/components/ui/pagination/PaginationButton";
import { cn } from "@/lib/cn";

interface dataProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  className?: string;
  variant?: "default" | "none";
}

export default function Pagination({
  page,
  setPage,
  totalPages,
  className,
  variant = "default",
}: dataProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const firstPage = page === 1;
  const lastPage = page === totalPages;

  const isNone = variant === "none";

  const handlePrev = () => {
    setPage(page - 1);
  };
  const handleNext = () => {
    setPage(page + 1);
  };

  const arrowClass = cn("svg-fill hover:text-white");

  return (
    <div className={cn("mt-4 flex justify-center gap-[10px]", className)}>
      <PaginationButton
        disabled={firstPage}
        onClick={handlePrev}
        variant={isNone ? "none" : "default"}
      >
        {isNone ? (
          <Arrow.Left className="size-11" />
        ) : (
          <Arrow.LeftFill className={cn("size-5", !firstPage && arrowClass)} />
        )}
      </PaginationButton>
      {!isNone &&
        pages.map((num) => {
          const isNum = page === num;

          return (
            <PaginationButton
              key={num}
              onClick={() => setPage(num)}
              aria-current={isNum ? "page" : undefined}
              className={cn(isNum && "bg-brand-deep-green-500 text-white")}
            >
              {num}
            </PaginationButton>
          );
        })}

      <PaginationButton
        disabled={lastPage}
        onClick={handleNext}
        variant={isNone ? "none" : "default"}
      >
        {isNone ? (
          <Arrow.Right className="size-11" />
        ) : (
          <Arrow.RightFill className={cn("size-5", !lastPage && arrowClass)} />
        )}
      </PaginationButton>
    </div>
  );
}
