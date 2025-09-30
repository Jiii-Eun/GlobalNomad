"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function TestMotions() {
  const [show, setShow] = useState(true);

  return (
    <div>
      <button onClick={() => setShow(!show)}>토글</button>
      <AnimatePresence>
        {show && (
          <motion.div
            key="box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
            style={{
              width: 100,
              height: 100,
              backgroundColor: "skyblue",
              marginTop: 20,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
