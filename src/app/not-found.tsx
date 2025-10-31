import Link from "next/link";

import { Logo } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

export default function NotFound() {
  const buttonClass = cn(
    "inline-block h-12 w-full align-middle font-bold transition-base",
    "mobile:text-md mobile:font:nomal h-10",
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[400px] flex-col items-center justify-center gap-4 p-4">
      <h1
        className={cn(
          "text-brand-deep-green-500 transition-base flex items-center gap-2 text-9xl font-bold",
          "mobile:text-8xl",
        )}
      >
        4<Logo.LogoOnly className="mobile:size-18 transition-base size-24" />4
      </h1>
      <h2
        className={cn(
          "text-brand-deep-green-500 transition-base text-3xl font-bold break-keep",
          "mobile:text-xl",
        )}
      >
        페이지를 찾을 수 없습니다.
      </h2>
      <p className="text-brand-gray-600 mobile:text-md break-keep">
        입력하신 주소가 올바른지 확인해 주세요.
      </p>
      <Button className={buttonClass}>
        <Link href="/">홈으로 가기</Link>
      </Button>

      <Button variant="w" className={buttonClass}>
        <Link href="/login">로그인하러 가기</Link>
      </Button>
    </div>
  );
}
