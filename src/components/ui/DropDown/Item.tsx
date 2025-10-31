import { motion } from "motion/react";

import { cn } from "@/lib/cn";

interface DropDownItemProps {
  children: React.ReactNode;
  className?: string;

  onClick?: () => void;
}

const DropDownItem = ({ children, onClick, className }: DropDownItemProps) => (
  <motion.li
    whileHover={{ backgroundColor: "rgba(30, 162, 181, 0.2)" }}
    whileTap={{ scale: 0.9, backgroundColor: "rgba(25, 140, 160, 0.2)" }}
    className={cn(
      "text-2lg w-full overflow-hidden px-4 py-[14px] text-ellipsis whitespace-nowrap",
      className,
    )}
    onClick={onClick}
  >
    {children}
  </motion.li>
);

export default DropDownItem;
