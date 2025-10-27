import { Misc } from "@/components/icons";

export default function NotingPage() {
  return (
    <div className="mx-auto flex max-w-[300px] flex-col">
      <Misc.NotingPage className="h-60 w-60" />
      <span className="text-brand-gray-700 text-2xl font-medium">아직 등록된 체험이 없어요</span>
    </div>
  );
}
