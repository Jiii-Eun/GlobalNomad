import useClickOutside from "@/lib/hooks/useClickOutside";

import DropDownItem from "./Item";
import DropDownMenu from "./Menu";
import DropDownTrigger from "./Trigger";

interface DropDownProps {
  children: React.ReactNode;
  handleClose: () => void;
}

const DropDown = ({ children, handleClose }: DropDownProps) => {
  const dropDownRef = useClickOutside(handleClose);

  return (
    <div ref={dropDownRef} className="relative">
      {children}
    </div>
  );
};

DropDown.Item = DropDownItem;
DropDown.Menu = DropDownMenu;
DropDown.Trigger = DropDownTrigger;

export default DropDown;
