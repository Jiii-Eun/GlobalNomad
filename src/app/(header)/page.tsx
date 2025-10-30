import Features from "@/app/(header)/components/features/Features";
import MainBanner from "@/app/(header)/components/hero/MainBanner";
import Search from "@/app/(header)/components/hero/Search";

export const dynamic = "force-static";

export default function Home() {
  return (
    <div>
      <MainBanner />
      <div className="container-base tablet:px-6 mobile:px-4 mb-52">
        <Search />
        <Features />
      </div>
    </div>
  );
}
