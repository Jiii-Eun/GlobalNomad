import Link from "next/link";

import { Logo } from "@/components/icons";
import AuthNav from "@/components/ui/header/AuthNav";
import Notification from "@/components/ui/header/Notification";
import UserMenu from "@/components/ui/header/UserMenu";
import { useGetMe } from "@/lib/api/users/hooks";

// MyNotifications 내 알림 리스트 조회 연동
export default function Header() {
  const { data: user } = useGetMe(true);

  const hasLogin = !!user;

  return (
    <div className="border-b-brand-gray-300 border-b">
      <div className="container-base mobile:px-5 tablet:px-6 flex h-[70px] items-center justify-between">
        <h1 className="w-[166px]">
          <Link href={"/"}>
            <Logo.Small />
          </Link>
        </h1>
        <div className="flex-center">
          {hasLogin ? (
            <>
              <Notification />
              <div className="mobile:mx-3 mx-[25px] h-[22px] w-[1px] bg-gray-300" />
              <UserMenu user={user} />
            </>
          ) : (
            <AuthNav />
          )}
        </div>
      </div>
    </div>
  );
}
