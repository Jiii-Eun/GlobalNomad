import Features from "@/app/components/features/Features";
import MainBenner from "@/app/components/hero/MainBenner";
import Search from "@/app/components/hero/Search";

export default function Home() {
  return (
    <div>
      <MainBenner />
      <div className="container-base tablet:px-6 mobile:px-4 mb-52">
        <Search />
        <Features />
      </div>
    </div>
  );
}
