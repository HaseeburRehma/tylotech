"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TyloLens = dynamic(() => import("./TyloLens"), { ssr: false });

/* TyloLens is a large modal that only matters once someone scrolls or clicks,
   so its code loads on the first interaction — or immediately if the menu asks
   for it first (the pending open is handed over on mount). */
export default function TyloLensLazy() {
  const [load, setLoad] = useState<false | { openOnMount?: "menu" | "fab" }>(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const source = ((e as CustomEvent).detail?.source as "menu" | "fab") ?? "menu";
      setLoad((cur) => cur || { openOnMount: source });
    };
    window.addEventListener("tylolens:open", onOpen);

    // nothing to show until the visitor scrolls (auto-open at 55 %, floating
    // button after the hero) or clicks — load on the first interaction
    const EVENTS = ["scroll", "pointerdown", "touchstart", "keydown"] as const;
    const go = () => setLoad((cur) => cur || {});
    EVENTS.forEach((ev) => window.addEventListener(ev, go, { once: true, passive: true }));

    return () => {
      window.removeEventListener("tylolens:open", onOpen);
      EVENTS.forEach((ev) => window.removeEventListener(ev, go));
    };
  }, []);

  return load ? <TyloLens openOnMount={load.openOnMount} /> : null;
}
