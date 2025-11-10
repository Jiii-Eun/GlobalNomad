"use client";
import { useAtom } from "jotai";
import Image from "next/image";
import { useEffect, useMemo } from "react";

import Pagination from "@/components/ui/pagination/Pagination";
import { activityPageAtom } from "@/lib/api/activities/atoms";
import { useActivityReviews } from "@/lib/api/activities/hooks";

export function formatDate(dateString: string) {
  const d = new Date(dateString);
  const y = d.getFullYear().toString();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}.${m}.${day}`;
}
const PAGE_SIZE = 3;
export default function ReviewContainer({ id }: { id: number }) {
  const [page, setPage] = useAtom(activityPageAtom);

  // ---- 서버 연동 시 사용 예 ----
  const { data, isLoading } = useActivityReviews(id, page, PAGE_SIZE, false);
  const reviews = data?.reviews ?? [];
  const totalCount = data?.totalCount ?? 0;

  // ---- MOCK 데이터 ----
  // const reviews = testReview?.reviews ?? [];
  // const totalCount = reviews.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // (선택) 액티비티가 바뀌면 페이지 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [id, setPage]);

  // 현재 페이지 범위를 1 ~ totalPages로 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    else if (page < 1) setPage(1);
  }, [page, totalPages, setPage]);

  // 현재 페이지의 아이템만 잘라서 렌더
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [reviews, page]);

  // if (totalCount === 0) {
  //   return <p className="text-brand-gray-600 py-6">아직 등록된 후기가 없습니다.</p>;
  // }

  return (
    <div>
      {pageItems.map((item) => {
        const { user } = item;
        const { profileImageUrl, nickname } = user;
        return (
          <div
            key={item.id}
            className="border-brand-nomad-black/25 flex gap-4 border-t py-6 first:border-none first:pt-0"
          >
            <div
              style={{ minHeight: 45, minWidth: 45 }}
              className="relative size-[45px] overflow-hidden rounded-[45px] bg-[#E3E5E8]"
            >
              {profileImageUrl && (
                <Image
                  src={profileImageUrl}
                  alt="프로필 이미지"
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-brand-nomad-black text-lg font-normal">{nickname}</p>
                <span className="text-brand-gray-400">|</span>
                <p className="text-brand-gray-600 text-lg font-normal">
                  {formatDate(item.updatedAt)}
                </p>
              </div>
              <div className="text-brand-nomad-black text-lg">{item.content}</div>
            </div>
          </div>
        );
      })}

      <Pagination page={page} setPage={setPage} totalPages={totalPages} size={PAGE_SIZE} />
    </div>
  );
}
