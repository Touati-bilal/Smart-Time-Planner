"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlannerStore } from "@/lib/store/plannerStore";
import { SplashScreen } from "./SplashScreen";

const MIN_SPLASH_MS = 1200;

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const unsub = usePlannerStore.subscribe((s) => {
      if (s.hasHydrated) setHydrated(true);
    });
    usePlannerStore.persist.rehydrate();
    return unsub;
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Never register in dev: the SW caches /_next/static chunks cache-first,
    // which fights Turbopack's HMR and serves stale JS after every edit.
    if (process.env.NODE_ENV !== "production") {
      // Self-heal: remove any SW + caches a previous dev session left behind,
      // so stale bundles don't keep getting served after this fix lands.
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) reg.unregister();
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }, []);

  const ready = hydrated && minTimeElapsed;

  return (
    <>
      <AnimatePresence>{!ready && <SplashScreen />}</AnimatePresence>
      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-dvh flex-1 flex-col"
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
