"use client";

import { useState } from "react";

import { Misc } from "@/components/icons";

// 공통 드롭다운으로 변경
export default function Notification() {
  const [isNotification, setIsNotification] = useState(false);

  const onToggleNotification = () => setIsNotification((prev) => !prev);

  return (
    <button onClick={onToggleNotification}>
      <Misc.NotificationBell className="size-5" />
    </button>
  );
}
