"use client";
import { useState } from "react";

import DropDown from "@/app/me/components/DropDown/Dropdown";

export default function Edit() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropDown handleClose={() => setOpen(false)}>
        <DropDown.Trigger onClick={() => setOpen((v) => !v)}>⋮</DropDown.Trigger>
        <DropDown.Menu isOpen={open}>
          <DropDown.Item onClick={() => setOpen(false)}>수정</DropDown.Item>
          <DropDown.Item onClick={() => setOpen(false)}>삭제</DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </>
  );
}
