// 테스트용
import Link from "next/link";

import TestMotions from "@/app/test/TestMotions";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
      <TestMotions />
    </div>
  );
}
