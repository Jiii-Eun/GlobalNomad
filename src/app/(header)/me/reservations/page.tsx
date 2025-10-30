// # 예약내역 (/me/reservations)
"use client";

import { useEffect, useState } from "react";

import { Arrow, Misc } from "@/components/icons";
import DropDown from "@/components/ui/DropDown/Dropdown";
import { useMyReservations } from "@/lib/api/my-reservations/hooks";

import ReservationsCard from "../components/ReservationsCard";

interface Activity {
  bannerImageUrl: string;
  title: string;
  id: number;
}

interface Reservation {
  id: number;
  activity: Activity;
  status: "pending" | "canceled" | "confirmed" | "declined" | "completed";
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
}

const statusArr: ("pending" | "confirmed" | "declined" | "canceled" | "completed")[] = [
  "pending",
  "canceled",
  "confirmed",
  "declined",
  "completed",
];

const ITEMS_PER_PAGE = 5; // 페이지당 표시할 항목 수

export default function Reservations() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1); // 현재 페이지 상태 추가
  const [isOpen, setIsOpen] = useState(false);

  const { data, error, isLoading } = useMyReservations({ size: 6 });
  const [reservations, setReservations] = useState<Reservation[]>(data?.reservations || []);

  // const reservation = data?.reservations;
  const filter = ["예약 완료", "예약 취소", "예약 승인", "예약 거절", "체험 완료"];

  const handleSelect = (index: number) => {
    setIsOpen(false);
    setSelectedIndex(index);
    setPage(1); // 필터 변경 시 페이지를 1로 초기화
  };

  const listItem = filter;

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (!data) return;

    const filteredReservations =
      selectedIndex !== null
        ? data.reservations
            .filter((item) => item.status === statusArr[selectedIndex])
            .sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : data.reservations.sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setReservations((prevReservations) => [
      ...(page === 1 ? [] : prevReservations), // 페이지 1이면 기존 데이터 초기화
      ...filteredReservations.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    ]);
  }, [data, selectedIndex, page]);
  // const reserv = data?.reservations; // 예약 상태 예시값

  return (
    <>
      <main className="bg-[#FAFAFA] py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <div className="flex h-fit min-h-[800px] w-[800px] flex-col gap-10">
            <div className="flex justify-between">
              <p className="flex text-3xl font-bold">예약 내역</p>
              <div className="rounded-16 border border-[#0B3B2D] bg-white px-4 py-2">
                <DropDown handleClose={() => setIsOpen(false)}>
                  <DropDown.Trigger onClick={() => setIsOpen((prev) => !prev)} isOpen={isOpen}>
                    <div className="space-between mb-1 flex flex-row items-center">
                      <div className="text-2lg font-medium text-[#0B3B2D]" />
                      필터
                      <Arrow.DownFill className="svg-fill ml-12 h-5 w-6 text-[#0B3B2D]" />
                    </div>
                  </DropDown.Trigger>
                  <DropDown.Menu isOpen={isOpen}>
                    {listItem.map((item, index) => (
                      <DropDown.Item key={index} onClick={() => handleSelect(index)}>
                        {item}
                      </DropDown.Item>
                    ))}
                  </DropDown.Menu>
                </DropDown>
              </div>
            </div>
            <div>
              {isLoading && <p>Loading...</p>}
              {data?.totalCount === undefined && (
                <div className="mt-[90px] flex flex-grow flex-col items-center gap-5">
                  <Misc.NotingPage className="h-[178px] w-[130px]" />
                  <p className="text-2xl font-medium text-[#79747E]">아직 등록한 체험이 없어요</p>
                </div>
              )}
              <ul className="flex list-none flex-col gap-6">
                {reservations?.map((item) => (
                  <ReservationsCard key={item.id} {...item} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
