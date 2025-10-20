interface DropDownTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
}

const DropDownTrigger = ({ children, onClick }: DropDownTriggerProps) => (
  <button
    type="button"
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Escape") {
        onClick();
      }
    }}
  >
    {children}
  </button>
);

export default DropDownTrigger;
