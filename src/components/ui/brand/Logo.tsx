"use client";

import Link from "next/link";

import MainLogo from "@/assets/brand/logo-big.svg";

interface LogoProps {
  href?: string;
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
}

export default function Logo({
  href = "/",
  width = 340,
  height = 192,
  ariaLabel = "GlobalNomad",
}: LogoProps) {
  return (
    <Link href={href} aria-label="홈으로 이동" className="block w-fit">
      <MainLogo
        className="mx-auto mb-14 block"
        role="img"
        aria-label={ariaLabel}
        width={width}
        height={height}
      />
    </Link>
  );
}
