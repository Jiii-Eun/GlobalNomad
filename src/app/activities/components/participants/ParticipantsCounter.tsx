import React from "react";

import { Btn } from "@/components/icons";

const ParticipantsCounter = ({
  count,
  handleCountPlus,
  handleCountMinus,
}: {
  count: number;
  handleCountPlus: () => void;
  handleCountMinus: () => void;
}) => (
  <div className="border-t-gray200 tablet:border-none mobile:border-none flex flex-col gap-[12px] border-t pt-[1.2rem]">
    <p className="text-h3-bold text-nomad-black mobile:text-h2">참여 인원 수</p>
    <div className="border-gray200 shadow-custom flex w-[120px] justify-between rounded-md border bg-white">
      <button onClick={handleCountMinus} disabled={count <= 1}>
        <Btn.Remove className="m-[10px] h-[20px] w-[20px]" />
      </button>
      <div className="text-gray600 flex w-[40px] items-center justify-center p-[8px] text-[var(--text-md)]">
        {count}
      </div>
      <button onClick={handleCountPlus}>
        <Btn.Add className="m-[10px] h-[20px] w-[20px]" />
      </button>
    </div>
  </div>
);

export default ParticipantsCounter;
