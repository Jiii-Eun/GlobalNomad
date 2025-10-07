"use client";

import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "vaul";

import { Status } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import { useDrawerContext } from "@/components/ui/modal/DrawerContext";

export default function DrawerHeader() {
  const { title, prevStep, onClose, isClose, isBack } = useDrawerContext();

  return (
    <div className="flex items-center justify-between border-b pb-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {isBack && (
          <motion.div
            key="back-button"
            layout
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -12, opacity: 0 }}
            transition={{
              duration: 0.18,
              ease: "easeInOut",
            }}
            className="relative top-[0.5px] flex h-6 w-6 items-center overflow-hidden"
          >
            <Button
              onClick={prevStep}
              className="flex h-full w-full items-center justify-center overflow-hidden rounded-full p-0 text-sm"
            >
              ←
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h2
        layout
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 25,
        }}
        className="flex-1 pl-1 text-lg font-semibold"
      >
        {title}
      </motion.h2>
      {isClose ? (
        <Drawer.Close onClick={onClose}>
          <Status.Close className="h-6 w-6" />
        </Drawer.Close>
      ) : (
        <div className="w-[1.5rem]" />
      )}
    </div>
  );
}
