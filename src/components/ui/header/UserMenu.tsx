"use client";

import Image from "next/image";
import { useState } from "react";

import { UserRes } from "@/lib/api/users/types";

interface UserMenuProps {
  user: UserRes | undefined;
}

// 공통 드롭다운으로 변경
export default function UserMenu({ user }: UserMenuProps) {
  const userProfile = user?.profileImageUrl;
  const userNick = user?.nickname;

  const [isUserMenu, setIsUserMenu] = useState(false);

  const onToggleUserMenu = () => setIsUserMenu((prev) => !prev);

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
        <button onClick={onToggleUserMenu} className="text-md ml-2.5 font-medium">
          {userNick}
        </button>
      </div>
    </>
  );
}
