import { cn } from "@/lib/cn";

interface SkeletonListProps {
  length: number;
  className?: string;
}

export default function SkeletonList({ length, className }: SkeletonListProps) {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <div key={index} className={cn("shimmer rounded-[20px]", className)} />
      ))}
    </>
  );
}
