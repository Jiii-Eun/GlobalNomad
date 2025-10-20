"use client";
import { enUS, Locale } from "date-fns/locale";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import ReservationWrap from "./ReservationWrap";
import ParticipantsCounter from "../participants/ParticipantsCounter";

const ReservationContent = () => {
  const [members, onChangeMembers] = React.useState(1);

  const price = 100000;
  const formatWage = (wage: number) => {
    return wage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCountPlus = () => {
    onChangeMembers(members + 1);
  };
  const handleCountMinus = () => {
    onChangeMembers(members > 1 ? members - 1 : 1);
  };

  const customLocale: Locale = {
    ...enUS,
    localize: {
      ...enUS.localize,
      day: (n: number) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n],
    },
    options: {
      ...enUS.options,
      weekStartsOn: 0, // 0은 일요일, 1은 월요일
    },
  };

  return (
    <ReservationWrap>
      <div className="flex flex-row items-center gap-5">
        <p className="text-brand-black text-3xl font-bold">{formatWage(price)}</p>
        <p className="text-brand-gray-900 text-xl">/ 인</p>
      </div>
      {/* datepicker */}

      <div className="mt-4 border-t border-[#DDDDDD]">
        <p className="text-brand-nomad-black mt-4 mb-4 text-xl font-bold">날짜</p>
        <div className="flex justify-center">
          <DatePicker
            inline
            autoComplete="off"
            locale={customLocale}
            minDate={new Date()} //이전날짜 선택못함
          />
        </div>
      </div>

      <div className="mobile:mt-7 mt-4 flex flex-col gap-3.5">
        <p className="text-brand-nomad-black text-2lg mobile:text-h2 font-bold">예약 가능한 시간</p>
        <button
          className={`active:bg-brand-deep-green-500 border-brand-nomad-black bg-brand-nomad-black mr-[1.2rem] mb-[1.2rem] rounded-lg border px-[1.2rem] py-[1rem] text-base font-medium text-white active:text-white`}
        >
          14:00~15:00
        </button>
        <button
          className={`border-brand-nomad-black active:bg-brand-black text-nomad-black text-brand-nomad-black mr-[1.2rem] mb-[1.2rem] rounded-lg border bg-white px-[1.2rem] py-[1rem] text-base font-medium active:text-white`}
        >
          14:00~15:00
        </button>

        <div>
          <div className="text-h4-regular text-brand-nomad-black mb-4">
            예약가능한 시간이 없습니다
          </div>
        </div>
      </div>
      <ParticipantsCounter
        count={members}
        handleCountPlus={handleCountPlus}
        handleCountMinus={handleCountMinus}
      />
      <button
        className="mobile:w-[full] mobile:m-0 mobile:py-[1rem] text-body1-bold my-7 w-full cursor-not-allowed rounded-md bg-[var(--color-brand-black)] px-4 py-[1.4rem] text-white"
        type="submit"
      >
        예약하기
      </button>
    </ReservationWrap>
  );
};
export default ReservationContent;
