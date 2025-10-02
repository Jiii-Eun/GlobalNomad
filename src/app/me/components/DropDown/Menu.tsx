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
        className={`${position} absolute z-10 box-content w-[160px] overflow-hidden rounded-[5px] border border-[#DDDDDD] bg-white`}
        initial={{ opacity: 0, scale: 0.5, x: 20, y: -50 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, x: 20, y: -50 }}
      >
        <ul className="divide-y divide-[#DDDDDD] text-center">{children}</ul>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DropDownMenu;
