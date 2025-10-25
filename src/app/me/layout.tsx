import { ReactNode } from "react";

import ProfileSidebar from "./components/ProfileSidebar";

export default function MyLayout({ children }: { children: ReactNode }) {
  const initialProfileUrl: string | null = null;
  const selectedActivityId = null;
  return (
    <div>
      <main className="bg-brand-gray-100 py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <ProfileSidebar initialProfileUrl={initialProfileUrl} />
          {children}
        </div>
      </main>
    </div>
  );
}
