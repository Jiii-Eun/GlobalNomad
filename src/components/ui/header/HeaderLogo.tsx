"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/icons";
import { useResetActivityParams } from "@/components/ui/header/useResetActivityParams";

export default function HeaderLogo() {
  const pathname = usePathname();
  const resetActivityParams = useResetActivityParams();

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      resetActivityParams();
    }
  };

  return (
    <h1 className="w-[166px]">
      <Link href={"/"} onClick={handleClick}>
        <Logo.Small />
      </Link>
    </h1>
  );
}
