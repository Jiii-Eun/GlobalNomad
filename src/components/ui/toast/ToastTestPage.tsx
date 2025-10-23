"use client";

import Button from "@/components/ui/button/Button";
import { useTestToast } from "@/components/ui/toast/useTestToast";
import { useToast } from "@/components/ui/toast/useToast";

export default function ToastTestPage() {
  const { showToast } = useToast();

  const { showCustomToast } = useTestToast();

  const handleConfirmResult = async (type: "cancel" | "delete") => {
    const isSuccess = Math.random() > 0.5;
    const result = isSuccess ? `${type}` : `false${type}`;
    console.log(`${type} 결과: ${result}`);
    showToast(result as any);
  };

  return (
    <div className="flex flex-col gap-5 p-10">
      <h1 className="text-xl font-bold">🧪 Toast Playground</h1>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => showToast("password")}>Password</Button>
        <Button onClick={() => showToast("email")}>Email</Button>
        <Button onClick={() => showToast("signup")}>Signup</Button>
        <Button onClick={() => showToast("reserveDone")}>ReserveDone</Button>
      </div>

      {/* 취소, 삭제 클릭시 실패 / 성공 토스트 추가연결 필요 */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="w"
          onClick={() => showToast("isCancel", () => handleConfirmResult("cancel"))}
        >
          isCancel
        </Button>
        <Button
          variant="w"
          onClick={() => showToast("isDelete", () => handleConfirmResult("delete"))}
        >
          isDelete
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => showToast("cancel")}>✅ Cancel</Button>
        <Button onClick={() => showToast("falsecancel")}>❌ FalseCancel</Button>
        <Button onClick={() => showToast("delete")}>✅ Delete</Button>
        <Button onClick={() => showToast("falsedelete")}>❌ FalseDelete</Button>
      </div>

      <div className="flex flex-col gap-5 p-10">
        <h1 className="text-xl font-bold">🧪 Toast Playground</h1>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => showToast("signup")}>Signup</Button>
          <Button onClick={() => showToast("reserveDone")}>ReserveDone</Button>
        </div>

        <div className="border-t pt-4">
          <p className="mb-2 font-semibold">🎨 Custom Toast Example</p>
          <Button variant="b" onClick={showCustomToast}>
            커스텀 토스트 열기
          </Button>
        </div>
      </div>
    </div>
  );
}
