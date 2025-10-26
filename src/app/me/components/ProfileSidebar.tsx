"use client";

import { usePathname, useRouter } from "next/navigation";

import SettingsIcon from "@/assets/icons/me-sns/me-register.svg";
import ReceiptIcon from "@/assets/icons/me-sns/me-reservations.svg";
import CalendarIcon from "@/assets/icons/me-sns/me-schedule.svg";
import UserIcon from "@/assets/icons/me-sns/me.svg";
import { ProfileImageUploader } from "@/components/ui/image-uploader";

type ItemKey = "me" | "reservations" | "experiences" | "calendar";

export default function ProfileSidebar({
  initialProfileUrl,
  selectedActivityId,
}: {
  initialProfileUrl?: string | null;
  selectedActivityId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 탭 계산
  const active: ItemKey =
    pathname.includes("/me/activities/") && pathname.endsWith("/schedule")
      ? "calendar"
      : pathname.startsWith("/me/reservations")
        ? "reservations"
        : pathname.startsWith("/me/activities")
          ? "experiences"
          : "me";

  // 라우팅 경로
  const toPath = (k: ItemKey) => {
    switch (k) {
      case "me":
        return "/me";
      case "reservations":
        return "/me/reservations";
      case "experiences":
        return "/me/activities";
      case "calendar":
        return selectedActivityId
          ? `/me/activities/${selectedActivityId}/schedule`
          : "/me/activities";
    }
  };

  const go = (k: ItemKey) => {
    if (k === "calendar" && !selectedActivityId) return;
    router.push(toPath(k));
  };

  const items: { k: ItemKey; label: string; icon: React.ReactNode }[] = [
    { k: "me", label: "내 정보", icon: <UserIcon className="svg-fill h-6 w-6" /> },
    { k: "reservations", label: "예약 내역", icon: <ReceiptIcon className="svg-fill h-6 w-6" /> },
    {
      k: "experiences",
      label: "내 체험 관리",
      icon: <SettingsIcon className="svg-fill h-6 w-6" />,
    },
    { k: "calendar", label: "예약 현황", icon: <CalendarIcon className="svg-fill h-6 w-6" /> },
  ];

  const Item = ({ k, label, icon }: { k: ItemKey; label: string; icon: React.ReactNode }) => {
    const isActive = active === k;
    return (
      <button
        type="button"
        onClick={() => go(k)}
        className={[
          "rounded-12 flex w-full items-center gap-3.5 border-none px-4 py-[9px] text-left transition",
          isActive ? "bg-brand-gray-300/50" : "hover:bg-brand-gray-200 bg-white",
          isActive ? "text-brand-nomad-black" : "text-[#A4A1AA]",
        ].join(" ")}
      >
        <span className="text-lg">{icon}</span>
        <span className="text-lg font-bold">{label}</span>
      </button>
    );
  };

  return (
    <aside className="rounded-12 border-brand-gray-300 mobile:hidden h-fit w-full max-w-96 shrink-0 border bg-white p-6">
      <div className="flex w-full flex-col items-center gap-6">
        <ProfileImageUploader initialUrl={initialProfileUrl} />
      </div>

      <nav className="mt-6 space-y-2">
        {items.map((it) => (
          <Item key={it.k} k={it.k} label={it.label} icon={it.icon} />
        ))}
      </nav>
    </aside>
  );
}
