// # 내 체험 관리 (/me/activities)
import Image from "next/image";
import { Button } from "@/components/icons";

export default function Activities() {
  return (
    <>
      <header className="bg-white h-[70px]"></header>
      <main className="bg-[#FAFAFA] py-18">
        <div className="mx-auto max-w-[1320px]">
          <div className="bg-white w-[384px] flex flex-col gap-6 px-6 py-6 border border-[#DDDDDD] rounded-xl">
            <div className="w-full">
              <div className="relative w-fit mx-auto">
                <Image 
                  src="/profileImg.png"
                  alt="프로필 이미지"
                  width={160}
                  height={160}
                  className="rounded-full"
                  />
                  <Button.Edit className="w-11 h-11 absolute bottom-0 right-0 rounded-full"
                  />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div>내 정보</div>
              <div>예약 내역</div>
              <div>내 체험 관리</div>
              <div>예약 현황</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
