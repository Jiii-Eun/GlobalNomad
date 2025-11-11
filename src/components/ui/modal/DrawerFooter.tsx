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
  currentStep?: number;
}

export default function DrawerFooter({
  children,
  buttonText,
  onClick,
  isDisabled,
  frameClass,
  buttonClass,
  isNext = false,
  currentStep,
}: footerProps) {
  const { nextStep, onClose, step, isLastStep } = useDrawerContext();

  const showChildren = step === currentStep;

  const Wrapper = isNext && !isLastStep ? "div" : Drawer.Close;

  const handleClick = () => {
    onClick?.();

    if (isNext && nextStep) {
      nextStep();
    }

    if (!isNext && onClose) {
      onClose();
    }
  };

  const FooterButton = (
    <Button
      className={cn("mobile:h-12 h-13 w-full", buttonClass)}
      onClick={handleClick}
      isDisabled={isDisabled}
    >
      {buttonText ?? "확인"}
    </Button>
  );

  const widthClass = "w-full";

  return (
    <div className={cn("flex w-full items-center justify-center", frameClass)}>
      {children ? (
        !currentStep || showChildren ? (
          <Wrapper className={widthClass}>{children}</Wrapper>
        ) : (
          <Wrapper className={widthClass} asChild>
            {FooterButton}
          </Wrapper>
        )
      ) : (
        <Wrapper className={widthClass} asChild>
          {FooterButton}
        </Wrapper>
      )}
    </div>
  );
}
