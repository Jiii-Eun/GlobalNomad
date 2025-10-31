"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/icons";

export default function HeaderLogo() {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.location.reload();
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
