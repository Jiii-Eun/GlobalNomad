import { AnimatePresence, motion } from "framer-motion";

interface DropDownMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
  position?: string;
}

const DropDownMenu = ({ children, isOpen, position }: DropDownMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className={`${position} rounded-12 border-border-primary bg-background-secondary text-text-primary absolute z-10 w-120 overflow-hidden border`}
        initial={{ opacity: 0, scale: 0.5, x: 20, y: -50 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, x: 20, y: -50 }}
      >
        <ul className="text-center">{children}</ul>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DropDownMenu;
