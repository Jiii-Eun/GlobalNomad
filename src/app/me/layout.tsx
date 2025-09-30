import { ReactNode } from "react";

export default function MyLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
