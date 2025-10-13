import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

interface paginationprops {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function PaginationButton({
  children,
  disabled = false,
  onClick,
  className,
}: paginationprops) {
  const buttonClass = cn(
    "flex h-[55px] w-[55px] justify-center items-center bg-white rounded-[15px]",
    "disabled:opacity-50 disabled:cursor-default disabled:border-brand-gray-300",
    "mobile:h-10 mobile:w-10",
    !disabled && "hover:bg-brand-deep-green-50 hover:text-white hover:border-0",
  );

  return (
    <Button
      variant="w"
      disabled={disabled}
      onClick={onClick}
      className={cn(buttonClass, className)}
    >
      {children}
    </Button>
  );
}
