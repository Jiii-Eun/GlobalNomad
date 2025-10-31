"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
