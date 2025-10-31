import React from "react";

const ReservationWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex w-96 flex-col rounded-2xl border border-[#DDDDDD] bg-white p-6 shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]">
      {children}
    </div>
  );
};

export default ReservationWrap;
