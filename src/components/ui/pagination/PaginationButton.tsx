import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

interface paginationprops {
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "none";
  onClick?: () => void;
  className?: string;
}

export default function PaginationButton({
  children,
  disabled = false,
  variant = "default",
  onClick,
  className,
}: paginationprops) {
  const isNone = variant === "none";

  const buttonClass = cn(
    "flex h-[55px] w-[55px] justify-center items-center bg-white rounded-[15px]",
    "mobile:h-10 mobile:w-10",
    !disabled && "hover:bg-brand-deep-green-50 hover:text-white hover:border-0",
  );

  const noneClass = cn("tablet:hidden border-0 bg-transparent hover:bg-transparent");

  return (
    <Button
      variant="w"
      isDisabled={disabled}
      onClick={onClick}
      className={cn(isNone ? noneClass : buttonClass, "disabled:bg-transparent", className)}
    >
      {children}
    </Button>
  );
}
