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
}: footerProps) {
  const { onClose } = useDrawerContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onClose) {
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
  return (
    <div className={cn("flex w-full items-center justify-center", frameClass)}>
      {children ? (
        <Drawer.Close asChild>{children}</Drawer.Close>
      ) : (
        <Drawer.Close asChild>{FooterButton}</Drawer.Close>
      )}
    </div>
  );
}
