import { motion } from "framer-motion";

interface DropDownItemProps {
  children: React.ReactNode;

  onClick?: () => void;
}

const DropDownItem = ({ children, onClick }: DropDownItemProps) => (
  <motion.li
    whileHover={{ backgroundColor: "rgba(30, 162, 181, 0.2)" }}
    whileTap={{ scale: 0.9, backgroundColor: "rgba(25, 140, 160, 0.2)" }}
    className="rounded-12 text-md-regular cursor-pointer pt-12 pb-11"
    onClick={onClick}
  >
    {children}
  </motion.li>
);

export default DropDownItem;
