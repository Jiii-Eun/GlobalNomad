import React from "react";

const ReservationWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="border-gray200 tablet:w-[251px] relative flex w-96 flex-col rounded-2xl border bg-white p-6"
      style={{ boxShadow: "0px 4px 16px rgba(17, 34, 17, 0.05)" }}
    >
      {children}
    </div>
  );
};

export default ReservationWrap;
