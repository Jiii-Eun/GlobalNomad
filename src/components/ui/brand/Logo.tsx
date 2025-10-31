"use client";

import Link from "next/link";

import MainLogo from "@/assets/brand/logo-big.svg";

interface LogoProps {
  href?: string;
  width?: number;
  height?: number;
  ariaLabel?: string;
}

export default function Logo({ href = "/", ariaLabel = "GlobalNomad" }: LogoProps) {
  return (
    <Link href={href} aria-label="홈으로 이동" className="mx-auto block w-fit">
      <MainLogo
        className={[
          "f-auto block",
          "mb-14 w-[340px]",
          "tablet:w-[340px] tablet:mb-14",
          "mobile:w-[270px] mobile:mb-6",
        ].join(" ")}
        role="img"
        aria-label={ariaLabel}
      />
    </Link>
  );
}
