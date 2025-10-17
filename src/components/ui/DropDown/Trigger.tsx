interface DropDownTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const DropDownTrigger = ({ children, onClick, className }: DropDownTriggerProps) => (
  <button
    type="button"
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Escape") {
        onClick();
      }
    }}
    className={className}
  >
    {children}
  </button>
);

export default DropDownTrigger;
