"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import MyActivityForm from "@/app/me/activities/register/components/MyActivityForm";
import Toast from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast/useToast";
import { useActivityDetail } from "@/lib/api/activities/hooks";
import { useUpdateMyActivity } from "@/lib/api/my-activities/hooks";
import type { UpdateActivityReq, UpdateActivityRes } from "@/lib/api/my-activities/types";

export type UpdateActivityFormValues = UpdateActivityReq & {
  subImageIds?: number[];
  scheduleIds?: number[];
  subImageUrls?: string[];
};

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const activityId = Number(id);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: updateActivity } = useUpdateMyActivity(false);
  const [defaultValues, setDefaultValues] = useState<UpdateActivityFormValues | null>(null);

  const { data: detail, isLoading } = useActivityDetail(activityId, false, {
    onError: (error) => {
      console.error(error);
      <Toast message="체험 정보를 불러오지 못했습니다." />;
    },
  });

  useEffect(() => {
    if (!detail) return;

    const { title, description, price, address, category, bannerImageUrl, subImages, schedules } =
      detail;
    const subImage = subImages?.map((sub) => sub.imageUrl) ?? [];
    const subImageIds = subImages?.map((sub) => sub.id) ?? [];
    const scheduleIds = schedules?.map((schedule) => schedule.id) ?? [];

    setDefaultValues({
      activityId,
      title,
      description,
      price,
      address,
      category,
      bannerImageUrl,
      subImageUrlsToAdd: [],
      subImageUrls: subImage ?? [],
      subImageIdsToRemove: [],
      subImageIds: subImageIds,
      schedulesToAdd: schedules ?? [],
      scheduleIdsToRemove: [],
      scheduleIds: scheduleIds,
    });
  }, [detail, activityId]);

  if (isLoading) return <div>불러오는 중...</div>;

  if (!detail || !defaultValues) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <MyActivityForm<UpdateActivityReq, UpdateActivityRes>
      defaultValues={defaultValues}
      isEdit
      apiActivity={updateActivity}
      onAfterSubmit={() => {
        queryClient.invalidateQueries({ queryKey: ["activityDetail", activityId] });
        showToast("update");
        router.push("/me/activities");
      }}
    />
  );
}
