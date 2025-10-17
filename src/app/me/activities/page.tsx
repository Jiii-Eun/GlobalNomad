// # 내 체험 관리 (/me/activities)
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Btn, MeIcon, Status, Misc } from "@/components/icons";
import { useAlertToast } from "@/components/ui/toast/useAlertToast";
import { useMyActivities } from "@/lib/api/my-activities/hooks";
import type { GetMyActivitiesReq } from "@/lib/api/my-activities/types";

import FormatNumber from "../components/formatNumber";
import { mockMyExperiences } from "./mock/myExperiences";
import DropDown from "../components/DropDown/Dropdown";
import NotingPage from "../components/NotingPage";
import ProfileSidebar from "../components/ProfileSidebar";

interface ActivitiesRes {
  items: typeof mockMyExperiences;
  totalCount: number;
}

const TARGET_USER_ID = 2688;

const PENDING_DELETE_KEY = "pendingDeleteActivityId";

export default function Activities() {
  const router = useRouter();
  const { openAlertToast } = useAlertToast();
  const [targetId, setTargetId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const toggleMenu = (id: number) => setOpenId((prev) => (prev === id ? null : id));
  const closeMenu = () => setOpenId(null);
  const selectedActivityId = "";

  const moveEdit = (id: number) => {
    closeMenu();
    router.push(`/me/activities/${id}/edit`);
  };

  // const params: GetMyActivitiesReq = { teamId: "17-3", size: 5 };
  // const { data, isLoading, isError } = useMyActivities(params);

  // const items = data?.activities ?? [];
  const hasData = mockMyExperiences.length > 0;

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

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const pending = window.localStorage.getItem(PENDING_DELETE_KEY);
  //   if (!pending) return;

  //   const id = Number(pending);
  //   if (!Number.isNaN(id)) {
  //     handleConfirmDelete(id).finally(() => {
  //       try {
  //         window.localStorage.removeItem(PENDING_DELETE_KEY);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     });
  //   } else {
  //     try {
  //       window.localStorage.removeItem(PENDING_DELETE_KEY);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }, []);

  return (
    <>
      <main className="bg-brand-gray-100 py-18">
        <div className="mx-auto flex max-w-[1320px] gap-5">
          <ProfileSidebar
            initialProfileUrl="/profileImg.png"
            selectedActivityId={selectedActivityId}
          />
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
              {hasData ? (
                <ul className="flex list-none flex-col gap-6">
                  {mockMyExperiences.map((item) => (
                    <li key={item.id} className="flex h-[204px] w-[800px] rounded-3xl bg-white">
                      <div className="h-[204px] w-[204px] overflow-hidden rounded-l-3xl">
                        <Image
                          src={item.thumbnail}
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
                            {item.rating} ({item.reviewsCount})
                          </span>
                        </div>
                        <div className="flex h-full flex-col justify-between text-xl font-bold">
                          {item.title}
                          <div className="text-brand-gray-800 flex justify-between text-2xl font-medium">
                            ₩{FormatNumber(item.pricePerPerson)} / 인
                            <div className="relative">
                              <DropDown handleClose={closeMenu}>
                                <DropDown.Trigger onClick={() => toggleMenu(item.id)}>
                                  <Misc.MenuDot className="h-10 w-10" />
                                </DropDown.Trigger>
                                <DropDown.Menu isOpen={openId === item.id}>
                                  <DropDown.Item onClick={() => moveEdit(item.id)}>
                                    수정하기
                                  </DropDown.Item>
                                  <DropDown.Item onClick={() => openDelete(item.id)}>
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
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
