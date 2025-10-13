import { Arrow } from "@/components/icons";
import PaginationButton from "@/components/ui/pagination/PaginationButton";
import { cn } from "@/lib/cn";

interface dataProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  className?: string;
}

export default function Pagination({ page, setPage, totalPages, className }: dataProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const firstPage = page === 1;
  const lastPage = page === totalPages;

  const arrowClass = cn("svg-fill hover:text-white");

  return (
    <div className={cn("mt-4 flex justify-center gap-[10px]", className)}>
      <PaginationButton disabled={firstPage} onClick={() => setPage(page - 1)}>
        <Arrow.LeftFill className={cn("size-5", !firstPage && arrowClass)} />
      </PaginationButton>
      {pages.map((num) => (
        <PaginationButton
          key={num}
          onClick={() => setPage(num)}
          aria-current={page === num ? "page" : undefined}
          className={cn(page === num && "bg-brand-deep-green-500 text-white")}
        >
          {num}
        </PaginationButton>
      ))}

      <PaginationButton disabled={lastPage} onClick={() => setPage(page + 1)}>
        <Arrow.RightFill className={cn("size-5", !lastPage && arrowClass)} />
      </PaginationButton>
    </div>
  );
}
