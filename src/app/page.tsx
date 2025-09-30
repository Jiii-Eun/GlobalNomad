import TestMotions from "@/app/components/TestMotion";
import { cn } from "@/lib/cn";

export default function Home() {
  return (
    <div>
      <h1
        className={cn(
          "p-4 rounded-lg",
          "bg-blue-600 text-purple-900",
          "text-3xl font bold",
          "hover:shadow-lg transition-all",
        )}
      >
        Home
      </h1>
      <TestMotions />
    </div>
  );
}
