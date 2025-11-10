import React from "react";

const ReservationWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-brand-gray-300 relative flex flex-col rounded-2xl border bg-white p-6 shadow-[0_4px_16px_0_rgba(17,34,17,0.05)]">
      {children}
    </div>
  );
};

export default ReservationWrap;
