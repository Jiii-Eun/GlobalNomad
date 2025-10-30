"use client";

import { ReactNode } from "react";

import { useGetMe } from "@/lib/api/users/hooks";

import ProfileSidebar from "./components/ProfileSidebar";

export default function MyLayout({ children }: { children: ReactNode }) {
  const { data: me, isLoading, isError } = useGetMe();

  if (isLoading) return null;
  if (isError) return <div>내 정보 불러오기 실패</div>;

  return (
    <div className="tablet:p-6 mx-auto flex max-w-[1200px] gap-6 py-18">
      <ProfileSidebar initialProfileUrl={me?.profileImageUrl} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
