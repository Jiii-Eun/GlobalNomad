"use client";

import Button from "@/components/ui/button/Button";
import { DrawerLayout, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/ui/modal";

export default function TestDrawer() {
  const steps = [
    <div key="step1" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">1단계 — 예약 정보 입력</h2>
      <p className="text-gray-600">예약자 이름과 연락처를 입력해주세요.</p>
      <input
        type="text"
        placeholder="이름"
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />
      <input
        type="text"
        placeholder="연락처"
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>,

    <div key="step2" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">2단계 — 일정 선택</h2>
      <p className="text-gray-600">참여하실 날짜를 선택해주세요.</p>
      <input type="date" className="w-full rounded-md border border-gray-300 px-3 py-2" />
    </div>,

    <div key="step3" className="flex flex-col gap-4 text-center">
      <h2 className="text-lg font-semibold">3단계 — 예약 완료</h2>
      <p className="text-gray-600">입력하신 정보로 예약이 완료되었습니다 🎉</p>
    </div>,
  ];

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <DrawerLayout
        trigger={<Button variant="g">테스트 Drawer 열기</Button>}
        title="예약하기 테스트"
        steps={steps}
        isClose
      >
        <DrawerHeader />
        <DrawerBody />
        <DrawerFooter isNext={true} />
      </DrawerLayout>
    </main>
  );
}
