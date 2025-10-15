"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import DropDown from "@/app/me/components/DropDown/Dropdown";
import { useLogout } from "@/lib/api/auth/hooks";
import { UserRes } from "@/lib/api/users/types";

interface UserMenuProps {
  user: UserRes | undefined;
}

export default function UserMenu({ user }: UserMenuProps) {
  const userProfile = user?.profileImageUrl;
  const userNick = user?.nickname;

  const [isUserMenu, setIsUserMenu] = useState(false);

  const { mutate: logout } = useLogout();

  const onToggleUserMenu = () => setIsUserMenu((prev) => !prev);

  const handleCloseUserMenu = () => setIsUserMenu(false);

  const handleLogout = () => {
    setIsUserMenu(false);
    logout();
  };

  return (
    <>
      <div className="flex-center">
        <Image
          src={userProfile || "/mock/default-profile.png"}
          alt=""
          width={32}
          height={32}
          className="rounded-full border object-cover"
        />

        <DropDown handleClose={handleCloseUserMenu}>
          <DropDown.Trigger onClick={onToggleUserMenu}>
            <div className="text-md ml-2.5 font-medium">{userNick}</div>
          </DropDown.Trigger>

          <DropDown.Menu isOpen={isUserMenu}>
            <DropDown.Item onClick={handleCloseUserMenu}>
              <Link href="/me">마이 페이지</Link>
            </DropDown.Item>
            {/* 로그아웃 구현 */}
            <DropDown.Item onClick={handleLogout}>
              <div className="cursor-pointer">로그아웃</div>
            </DropDown.Item>
          </DropDown.Menu>
        </DropDown>
      </div>
    </>
  );
}
