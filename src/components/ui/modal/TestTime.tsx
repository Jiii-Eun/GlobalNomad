"use client";

import { useState } from "react";

import Button from "@/components/ui/button/Button";
import DrawerBody from "@/components/ui/modal/DrawerBody";
import DrawerFooter from "@/components/ui/modal/DrawerFooter";
import DrawerHeader from "@/components/ui/modal/DrawerHeader";
import DrawerLayout from "@/components/ui/modal/DrawerLayout";
import { useDevice } from "@/lib/hooks/useDevice";

export default function TestTime() {
  const [people, setPeople] = useState(10);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { isMobile } = useDevice();

  // --- 개별 Step UI ---
  const StepTime = (
    <div className="flex flex-col gap-4">
      <h3 className="mb-2 text-lg font-semibold">예약 가능한 시간</h3>
      {["14:00~15:00", "15:00~16:00"].map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? "g" : "w"}
          className="h-12 text-lg"
          onClick={() => setSelectedTime(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  );

  const StepPeople = (
    <div className="flex flex-col gap-4">
      <h3 className="mb-2 text-lg font-semibold">참여 인원 수</h3>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="w"
          className="h-10 w-10 text-xl"
          onClick={() => setPeople((prev) => Math.max(1, prev - 1))}
        >
          -
        </Button>
        <span className="w-10 text-center text-lg font-semibold">{people}</span>
        <Button
          variant="w"
          className="h-10 w-10 text-xl"
          onClick={() => setPeople((prev) => prev + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );

  // --- Step 배열 (모바일에서만 사용) ---
  const steps = [StepTime, StepPeople];

  return (
    <DrawerLayout
      trigger={<Button variant="b">예약하기</Button>}
      title="날짜"
      width="full"
      steps={isMobile ? steps : undefined} // 모바일일 때만 StepSlider 활성화
    >
      <DrawerHeader />
      <DrawerBody frameClass="flex flex-col gap-8">
        {isMobile ? null : ( // 📱 모바일: StepSlider 내부에서 자동 렌더링됨
          // 💻 태블릿 이상: 두 스텝 콘텐츠 모두 표시
          <div className="grid grid-cols-2 gap-8">
            {StepTime}
            {StepPeople}
          </div>
        )}
      </DrawerBody>

      <DrawerFooter
        buttonText="확인"
        isNext={isMobile} // 모바일일 때만 다음 스텝 이동
        onClick={() => {
          if (!isMobile) console.log("예약 완료:", selectedTime, people);
        }}
      />
    </DrawerLayout>
  );
}
