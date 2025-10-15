// # 내 체험 관리 (/me/activities)
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Btn, MeIcon, Status, Misc } from "@/components/icons";
import { useAlertToast } from "@/components/ui/toast/useAlertToast";
import { getMyActivities } from "@/lib/api/my-activities/api";
import { useFetchQuery } from "@/lib/hooks/useFetchQuery";

import { mockMyExperiences } from "./mock/myExperiences";
import DropDown from "../components/DropDown/Dropdown";
import NotingPage from "../components/NotingPage";

interface ActivitiesRes {
  items: typeof mockMyExperiences;
  totalCount: number;
}

const PENDING_DELETE_KEY = "pendingDeleteActivityId";

export default function Activities() {
  const router = useRouter();
  const { openAlertToast } = useAlertToast();
  const [targetId, setTargetId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const toggleMenu = (id: number) => setOpenId((prev) => (prev === id ? null : id));
  const closeMenu = () => setOpenId(null);

  const moveEdit = (id: number) => {
    closeMenu();
    router.push(`/me/activities/${id}/edit`);
  };

  const { data, isLoading, isError } = useFetchQuery<ActivitiesRes>(
    ["activities", "mock"],
    undefined,
    {
      mockData: {
        items: mockMyExperiences,
        totalCount: mockMyExperiences.length,
      },
      staleTime: 60_000,
    },
  );

  const items = data?.items ?? [];
  const hasData = items.length > 0;

  const openDelete = (id: number) => {
    setTargetId(id);
    closeMenu();

    const url = new URL(window.location.href);
    url.searchParams.set("confirmDelete", String(id));
    router.replace(`${url.pathname}?${url.searchParams.toString()}`);

    openAlertToast("isDelete");
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      // TODO: 실제 삭제 API 연동
      // await deleteMyActivity(id);
      // TODO: 성공 후 refetch/낙관적 갱신 등
      // queryClient.invalidateQueries({ queryKey: ["activities"] });
    } catch (e) {
      console.error(e);
    } finally {
      setTargetId(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pending = window.localStorage.getItem(PENDING_DELETE_KEY);
    if (!pending) return;

    const id = Number(pending);
    if (!Number.isNaN(id)) {
      handleConfirmDelete(id).finally(() => {
        try {
          window.localStorage.removeItem(PENDING_DELETE_KEY);
        } catch (e) {
          console.log(e);
        }
      });
    } else {
      try {
        window.localStorage.removeItem(PENDING_DELETE_KEY);
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  return (
    <>
      <main className="bg-brand-gray-100 py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <div className="flex h-fit w-[384px] flex-col gap-6 rounded-xl border border-[#DDDDDD] bg-white px-6 py-6">
            <div className="w-full">
              <div className="relative mx-auto w-fit">
                <Image
                  src="/profileImg.png"
                  alt="프로필 이미지"
                  width={160}
                  height={160}
                  className="rounded-full"
                />
                <Btn.Edit className="absolute right-0 bottom-0 h-11 w-11 rounded-full" />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Me className="h-6 w-6" />
                <div className="text-brand-gray-700 text-left font-bold">내 정보</div>
              </div>
              <div className="flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Reservations className="h-6 w-6" />
                <div className="text-brand-gray-700 text-left font-bold">예약 내역</div>
              </div>
              <div className="bg-brand-deep-green-50 flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Schedule className="text-brand-black-100 h-6 w-6" />
                <div className="text-brand-black-100 text-left font-bold">내 체험 관리</div>
              </div>
              <div className="flex gap-2 rounded-xl px-2 py-[9px]">
                <MeIcon.Register className="h-6 w-6" />
                <div className="text-brand-gray-700 text-left font-bold">예약 현황</div>
              </div>
            </div>
          </div>
          <div className="flex h-fit min-h-[800px] w-[800px] flex-col gap-10">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold">내 체험 관리</h1>
              <Link
                href="./activities/register"
                className="text-brand-gray-100 rounded-4 w-[120px] bg-black px-4 py-2 text-center text-lg"
              >
                체험 등록하기
              </Link>
            </div>
            <div>
              {!isLoading &&
                !isError &&
                (hasData ? (
                  <ul className="flex list-none flex-col gap-6">
                    {mockMyExperiences.map((exp) => (
                      <li key={exp.id} className="flex h-[204px] w-[800px] rounded-3xl bg-white">
                        <div className="h-[204px] w-[204px] overflow-hidden rounded-l-3xl">
                          <Image
                            src={exp.thumbnail}
                            alt="썸네일"
                            width={204}
                            height={204}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex w-full flex-col gap-1.5 px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <Status.StarFill className="h-[19px] w-[19px]" />
                            <span>
                              {exp.rating} ({exp.reviewsCount})
                            </span>
                          </div>
                          <div className="flex h-full flex-col justify-between text-xl font-bold">
                            {exp.title}
                            <div className="text-brand-gray-800 flex justify-between text-2xl font-medium">
                              ₩{exp.pricePerPerson} / 인
                              <div className="relative">
                                <DropDown handleClose={closeMenu}>
                                  <DropDown.Trigger onClick={() => toggleMenu(exp.id)}>
                                    <Misc.MenuDot className="h-10 w-10" />
                                  </DropDown.Trigger>
                                  <DropDown.Menu isOpen={openId === exp.id}>
                                    <DropDown.Item onClick={() => moveEdit(exp.id)}>
                                      수정하기
                                    </DropDown.Item>
                                    <DropDown.Item onClick={() => openDelete(exp.id)}>
                                      삭제하기
                                    </DropDown.Item>
                                  </DropDown.Menu>
                                </DropDown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <NotingPage />
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
