"use client";

import { Drawer } from "vaul";

import Button from "@/components/ui/button/Button";
import { useDrawerContext } from "@/components/ui/modal/DrawerContext";

export default function DrawerHeader() {
  const { title, prevStep, onClose, isClose, isBack } = useDrawerContext();

  return (
    <div className="flex items-center justify-between border-b px-5 py-3">
      {isBack ? (
        <Button onClick={prevStep} className="tedxt-sm text-gray-500">
          ←
        </Button>
      ) : (
        <div />
      )}
      <h2 className="flex-1 text-center text-lg font-semibold">{title}</h2>
      {isClose ? (
        <Drawer.Close onClick={onClose} className="text-xl text-gray-500">
          ✕
        </Drawer.Close>
      ) : (
        <div className="w-[1.5rem]" />
      )}
    </div>
  );
}
