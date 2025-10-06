import Button from "@/components/ui/button/Button";
import { useDrawerContext } from "@/components/ui/modal/DrawerContext";
import { cn } from "@/lib/cn";

interface footerProps {
  children?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  frameClass?: string;
  buttonClass?: string;
  isNext?: boolean;
}

export default function DrawerFooter({
  children,
  buttonText,
  onClick,
  isDisabled,
  frameClass,
  buttonClass,
  isNext,
}: footerProps) {
  const { nextStep } = useDrawerContext();
  const handleClick = () => {
    onClick?.();
    if (isNext && nextStep) {
      nextStep();
    }
  };

  return (
    <div className={cn("flex items-center justify-center", frameClass)}>
      {children ? (
        children
      ) : (
        <Button
          className={cn("flex-center h-13 w-full rounded-[6px]", buttonClass)}
          onClick={handleClick}
          isDisabled={isDisabled}
        >
          {buttonText ? buttonText : "확인"}
        </Button>
      )}
    </div>
  );
}
