import BackgroundImage from "@/components/ui/BackgroundImage";
import AuthNav from "@/components/ui/header/AuthNav";
import HeaderLogo from "@/components/ui/header/HeaderLogo";
import Notification from "@/components/ui/header/Notification";
import UserMenu from "@/components/ui/header/UserMenu";
import { useGetMe } from "@/lib/api/users/hooks";

export default function Header() {
  const { data: user, isLoading } = useGetMe();

  const hasLogin = !!user;

  return (
    <div className="border-b-brand-gray-300 border-b">
      <div className="container-base mobile:px-5 tablet:px-6 flex h-[70px] items-center justify-between">
        <HeaderLogo />
        <div className="flex-center">
          {isLoading ? (
            <BackgroundImage className="rounded-4 h-9 w-40 overflow-hidden" />
          ) : hasLogin ? (
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
