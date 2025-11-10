import React from "react";

import { Btn } from "@/components/icons";

export interface MemberProps {
  members: number;
}

export interface ParticipantsProps extends MemberProps {
  handleCountPlus: () => void;
  handleCountMinus: () => void;
}

const ParticipantsCounter = ({
  members: count,
  handleCountPlus,
  handleCountMinus,
}: ParticipantsProps) => (
  <div className="tablet:border-none mobile:border-none flex flex-col gap-[12px] border-t border-[#DDDDDD] pt-[1.2rem]">
    <p className="text-brand-nomad-black mobile:text-h2 text-2lg font-bold">참여 인원 수</p>
    <div className="flex w-[120px] justify-between rounded-md border border-[#CDD0DC] bg-white shadow-[0_2px_4px_0_rgba(5,16,55,0.06)]">
      <button onClick={handleCountMinus} disabled={count <= 1}>
        <Btn.Remove className="m-[10px] size-[20px]" />
      </button>
      <div className="text-shadow-brand-gray-900 text-md flex w-[40px] items-center justify-center p-[8px] font-normal">
        {count}
      </div>
      <button onClick={handleCountPlus}>
        <Btn.Add className="m-[10px] size-[20px]" />
      </button>
    </div>
  </div>
);

export default ParticipantsCounter;
