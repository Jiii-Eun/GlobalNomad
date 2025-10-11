import Link from "next/link";

import BestActivities from "@/app/conponents/BestActivities";
import MainBenner from "@/app/conponents/MainBenner";
import Search from "@/app/conponents/Search";
import { Arrow, Btn } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import TestImageUploader from "@/components/ui/image-uploader/TestImageUploader";
import TestDrawer from "@/components/ui/modal/TestDrawer";
import TestTime from "@/components/ui/modal/TestTime";
import ToastTestPage from "@/components/ui/toast/ToastTestPage";
import { cn } from "@/lib/cn";

export default function Home() {
  return (
    <div>
      <MainBenner />
      <div className="container-base tablet:px-6 mobile:px-4">
        <Search />
        <BestActivities />
      </div>

      <h1
        className={cn(
          "mt-5 rounded-lg p-4",
          "text-brand-green-500 bg-brand-blue-500",
          "text-3xl font-bold",
          "transition-all hover:shadow-lg",
        )}
      >
        Home
      </h1>
      <Link href={"/login"} className="mobile:text-9xl text-xl">
        login
      </Link>
      <Link href={"/signup"}>sign up</Link>
      <Arrow.DownFill className="svg-fill svg-stroke text-brand-red-500 hover:text-brand-blue-500 h-20 w-20" />
      <Btn.Add className="h-8 w-8" />
      <Btn.Add className="svg-fill hover:text-brand-blue-500 h-6 w-6" />
      <ToastTestPage />
      <Button>테스트 버튼 확인</Button>
      <TestDrawer />
      <TestTime />
      <TestImageUploader />
    </div>
  );
}
