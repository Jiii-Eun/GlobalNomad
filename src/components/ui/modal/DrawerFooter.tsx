import { Drawer } from "vaul";

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
  isNext = false,
}: footerProps) {
  const { nextStep } = useDrawerContext();

  const handleClick = () => {
    onClick?.();
    if (isNext && nextStep) {
      nextStep();
    }
  };

  const Wrapper = isNext ? "div" : Drawer.Close;

  return (
    <Wrapper className={cn("flex w-full items-center justify-center", frameClass)}>
      {children ? (
        children
      ) : (
        <Button
          className={cn("mobile:h-12 h-13 w-full", buttonClass)}
          onClick={handleClick}
          isDisabled={isDisabled}
        >
          {buttonText ?? "확인"}
        </Button>
      )}
    </Wrapper>
  );
}
