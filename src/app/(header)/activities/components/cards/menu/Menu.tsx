"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Misc } from "@/components/icons";
import DropDown from "@/components/ui/DropDown/Dropdown";
import { useToast } from "@/components/ui/toast/useToast";
import { useDeleteMyActivity } from "@/lib/api/my-activities/hooks";
import { useGetMe } from "@/lib/api/users/hooks"; // ✅ 현재 로그인 유저 정보 훅

interface MenuProps {
  id: number; // 체험 ID
  activityOwnerId: number; // 체험 생성자 ID
}

export default function Menu({ id: activityId, activityOwnerId }: MenuProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // ✅ 로그인 유저 정보 가져오기
  const { data: me, isLoading: isMeLoading } = useGetMe();

  const [openId, setOpenId] = useState<number | null>(null);
  const toggleMenu = (id: number) => setOpenId((prev) => (prev === id ? null : id));
  const closeMenu = () => setOpenId(null);

  // ✅ 삭제 훅
  const { mutateAsync: deleteMutate, isPending: isDeleting } = useDeleteMyActivity(false, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myActivities"] });
      router.push("/"); // ✅ 삭제 후 홈으로 이동
    },
  });

  const moveEdit = (id: number) => {
    closeMenu();
    router.push(`/me/activities/${id}/edit`);
  };

  const openDelete = (id: number) => {
    closeMenu();
    showToast("isDelete", async () => {
      try {
        await deleteMutate({ activityId: id });
        showToast("trueDelete");
      } catch (err) {
        showToast("falseDelete");
      }
    });
  };

  // ✅ 로딩 중이면 아무것도 안보여줌
  if (isMeLoading) return null;

  // ✅ 로그인 유저가 생성자가 아닌 경우 메뉴 미표시
  if (!me || me.id !== activityOwnerId) return null;

  // ✅ 동일 유저일 때만 표시
  return (
    <div className="relative">
      <DropDown handleClose={closeMenu}>
        <DropDown.Trigger onClick={() => toggleMenu(activityId)}>
          <Misc.MenuDot className="mobile:h-8 mobile:w-8 h-10 w-10 cursor-pointer" />
        </DropDown.Trigger>

        <DropDown.Menu isOpen={openId === activityId}>
          <DropDown.Item onClick={() => moveEdit(activityId)} className="cursor-pointer">
            수정하기
          </DropDown.Item>
          <DropDown.Item
            onClick={() => openDelete(activityId)}
            className="text-brand-red-500 cursor-pointer"
          >
            {isDeleting ? "삭제 중..." : "삭제하기"}
          </DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </div>
  );
}
