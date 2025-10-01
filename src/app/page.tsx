import Link from "next/link";

import TestMotions from "@/app/components/TestMotion";
import { cn } from "@/lib/cn";

export default function Home() {
  return (
    <div>
      <h1
        className={cn(
          "rounded-lg p-4",
          "text-brand-green-500 bg-brand-blue-500",
          "text-3xl font-bold",
          "transition-all hover:shadow-lg",
        )}
      >
        Home
      </h1>
      <Link href={"/login"}>login</Link>
      <Link href={"/signup"}>sign up</Link>
      <TestMotions />
    </div>
  );
}
