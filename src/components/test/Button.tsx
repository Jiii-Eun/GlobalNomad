type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", children, ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded font-semibold";
  const styles = {
    primary: `${base} bg-blue-500 text-white hover:bg-blue-600`,
    secondary: `${base} bg-gray-200 text-gray-800 hover:bg-gray-300`,
  };

  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  );
}
