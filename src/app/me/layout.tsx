import { ReactNode } from "react";

import ProfileSidebar from "./components/ProfileSidebar";

export default function MyLayout({ children }: { children: ReactNode }) {
  const initialProfileUrl: string | null = null;
  return (
    <div className="tablet:p-6 mx-auto flex max-w-[1200px] gap-6 py-18">
      <ProfileSidebar initialProfileUrl={initialProfileUrl} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
