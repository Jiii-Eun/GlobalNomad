// # 내 체험 관리 (/me/activities)
"use client";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useRef } from "react";

import { Status, Misc } from "@/components/icons";
import { useAlertToast } from "@/components/ui/toast/useAlertToast";
import { getMyActivities } from "@/lib/api/my-activities/api";
import { useDeleteMyActivity } from "@/lib/api/my-activities/hooks";
import type {
  GetMyActivitiesReq,
  GetMyActivitiesRes,
  DeleteActivityReq,
} from "@/lib/api/my-activities/types";
import { useInfiniteScrollQuery } from "@/lib/hooks/useInfiniteScroll";

import DropDown from "../../../components/ui/DropDown/Dropdown";
import FormatNumber from "../components/formatNumber";
import NotingPage from "../components/NotingPage";

function deriveNextCursor(items: { id?: number; createdAt?: string }[], fallback?: number | null) {
  if (!items || items.length === 0) return null;
  const last = items[items.length - 1];
  if (typeof last.id === "number") return last.id;
  if (typeof last.createdAt === "string") {
    const t = Date.parse(last.createdAt);
    if (!Number.isNaN(t)) return t;
  }
  return fallback ?? null;
}

async function getMyActivitiesSafe(params: GetMyActivitiesReq): Promise<GetMyActivitiesRes> {
  const res = await getMyActivities(params);
  const size = params.size ?? 10;
  const items = res.activities ?? [];

  if (items.length < size) return { ...res, cursorId: null };
  const next = deriveNextCursor(items, res.cursorId ?? null);
  return { ...res, cursorId: next };
}

export default function Activities() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { openAlertToast } = useAlertToast();
  const [targetId, setTargetId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const toggleMenu = (id: number) => setOpenId((prev) => (prev === id ? null : id));
  const closeMenu = () => setOpenId(null);

  const moveEdit = (id: number) => {
    closeMenu();
    router.push(`/me/activities/${id}/edit`);
  };

  const PAGE_SIZE = 5 as const;
  const QUERY_KEY = ["myActivities", "infinite", { size: 5 }] as const;

  interface MyActivitiesInfiniteData {
    pages: GetMyActivitiesRes[];
    pageParams: (number | null)[];
  }

  const {
    data: pages,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    targetRef,
  } = useInfiniteScrollQuery<GetMyActivitiesRes, GetMyActivitiesReq>({
    queryKey: QUERY_KEY,
    fetchFn: getMyActivitiesSafe,
    initialParams: {},
    enabled: true,
    size: PAGE_SIZE,
  });

  const items = useMemo(() => {
    const flat = (pages ?? []).flatMap((p) => p.activities ?? []);

    const seen = new Set<number>();
    const deduped = flat.filter((a) => {
      if (typeof a.id !== "number") return true;
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });

    return deduped.sort((a, b) => {
      const at = Date.parse(a.createdAt);
      const bt = Date.parse(b.createdAt);
      if (!Number.isNaN(bt - at) && bt !== at) return bt - at;
      return (b.id ?? 0) - (a.id ?? 0);
    });
  }, [pages]);

  const isEnd = !hasNextPage;

  console.log({
    hasNextPage, // react-query가 보는 다음 페이지 유무
    lastCursor: pages?.at(-1)?.cursorId, // 서버가 내려준 마지막 cursorId
    lastCount: pages?.at(-1)?.activities?.length,
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = useDeleteMyActivity(false, {
    onSuccess: (_data: null, variables: DeleteActivityReq) => {
      queryClient.setQueryData<MyActivitiesInfiniteData>(QUERY_KEY, (prev) => {
        if (!prev) return prev;

        const nextPages: GetMyActivitiesRes[] = prev.pages.map((pg) => ({
          ...pg,
          activities: pg.activities.filter((a) => a.id !== variables.activityId),
        }));

        return { ...prev, pages: nextPages };
      });

      // (선택) 서버와 재동기화가 필요하면 invalidate를 추가
      // queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const openDelete = (id: number) => {
    setTargetId(id);
    closeMenu();

    const url = new URL(window.location.href);
    url.searchParams.set("confirmDelete", String(id));
    router.replace(`${url.pathname}?${url.searchParams.toString()}`);

    openAlertToast("isDelete");
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteMutate({ activityId: id });
    setTargetId(null);
  };

  return (
    <>
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
          {isLoading && <div>불러오는 중…</div>}
          {isError && <div>목록을 불러오지 못했습니다.</div>}
          {!isLoading && !isError && items.length === 0 && <NotingPage />}

          {items.length > 0 && (
            <ul className="flex list-none flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex h-[204px] w-[800px] rounded-3xl bg-white">
                  <div className="h-[204px] w-[204px] overflow-hidden rounded-l-3xl">
                    <Image
                      src={item.bannerImageUrl}
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
                        {item.rating} ({item.reviewCount})
                      </span>
                    </div>
                    <div className="flex h-full flex-col justify-between text-xl font-bold">
                      {item.title}
                      <div className="text-brand-gray-800 flex justify-between text-2xl font-medium">
                        ₩{FormatNumber(item.price)} / 인
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
              {hasNextPage && <li ref={targetRef} className="h-24 w-full" />}
              {!isEnd && isFetchingNextPage && <li>더 불러오는 중…</li>}
              {isEnd && <li className="text-center text-sm text-gray-500">마지막입니다</li>}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
