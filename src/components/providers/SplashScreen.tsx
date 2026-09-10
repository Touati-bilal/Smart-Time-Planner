"use client";

import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)]"
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="splash-glow absolute h-40 w-40 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-14 w-14 rounded-full"
          style={{ background: "var(--accent-gradient)", boxShadow: "var(--shadow-accent)" }}
        />
      </div>
    </motion.div>
  );
}
