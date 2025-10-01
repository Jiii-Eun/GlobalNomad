import Link from "next/link";

import { Arrow, Button } from "@/components/icons";
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
      <Arrow.DownFill className="svg-fill svg-stroke text-brand-red-500 hover:text-brand-blue-500 h-20 w-20" />
      <Button.Add className="h-8 w-8" />
      <Button.Add className="svg-fill hover:text-brand-blue-500 h-6 w-6" />
    </div>
  );
}
