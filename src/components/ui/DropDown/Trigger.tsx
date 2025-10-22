import { sharedButtonClass } from "@/app/components/features/all/Categories";
import { Arrow } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

interface DropDownTriggerProps {
  children?: React.ReactNode;
  onClick: () => void;
  customButton?: string;
  customClass?: string;
  isOpen?: boolean;
  className?: string;
}

const DropDownTrigger = ({
  children,
  onClick,
  customButton,
  customClass,
  isOpen,
}: DropDownTriggerProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClick();
    }
  };

  if (customButton) {
    return (
      <Button
        variant="w"
        onKeyDown={handleKeyDown}
        onClick={onClick}
        className={cn(
          sharedButtonClass,
          "w-40",
          "flex gap-2 px-5 hover:bg-transparent",
          customClass,
        )}
      >
        {customButton}
        <Arrow.DownFill
          className={cn("size-[22px] transition-transform duration-300", isOpen && "rotate-180")}
        />
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClick();
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
};

export default DropDownTrigger;
