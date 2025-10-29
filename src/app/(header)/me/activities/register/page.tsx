// # 체험 등록 (/me/activities/register)
"use client";

import { useRouter } from "next/navigation";

import MyActivityForm from "@/app/(header)/me/activities/register/components/MyActivityForm";
import { useToast } from "@/components/ui/toast/useToast";
import { useCreateActivity } from "@/lib/api/activities/hooks";
import type { CreateActivityReq, CreateActivityRes } from "@/lib/api/activities/types";

export default function Register() {
  const { mutate: createActivity } = useCreateActivity();
  const { showToast } = useToast();
  const router = useRouter();

  return (
    <MyActivityForm<CreateActivityReq, CreateActivityRes>
      apiActivity={createActivity}
      onAfterSubmit={() => {
        showToast("register");
        router.push("/me/activities");
      }}
    />
  );
}
