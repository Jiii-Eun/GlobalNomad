"use client";
import { useState } from "react";

import DropDown from "@/app/me/components/DropDown/Dropdown";

export default function Edit() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropDown handleClose={() => setIsOpen(false)}>
        <DropDown.Trigger onClick={() => setIsOpen((v) => !v)}>⋮</DropDown.Trigger>
        <DropDown.Menu isOpen={isOpen}>
          <DropDown.Item onClick={() => setIsOpen(false)}>예약 신청</DropDown.Item>
          <DropDown.Item onClick={() => setIsOpen(false)}>예약 취소</DropDown.Item>
          <DropDown.Item onClick={() => setIsOpen(false)}>예약 승인</DropDown.Item>
          <DropDown.Item onClick={() => setIsOpen(false)}>예약 거절</DropDown.Item>
          <DropDown.Item onClick={() => setIsOpen(false)}>체험 완료</DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </>
  );
}
