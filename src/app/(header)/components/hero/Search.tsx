import SearchForm from "@/app/(header)/components/hero/SearchForm";
import { cn } from "@/lib/cn";

export default function Search() {
  return (
    <div className="relative z-20 -mt-10">
      <div
        className={cn(
          "text-brand-black rounded-16 shadow-green bg-white px-6 py-8",
          "mobile:max-h-[129px] mobile:py-2 h-[184px]",
        )}
      >
        <p className="mb-5 text-xl font-bold">무엇을 체험하고 싶으신가요?</p>
        <SearchForm />
      </div>
    </div>
  );
}
