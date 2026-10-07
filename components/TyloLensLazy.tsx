"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TyloLens = dynamic(() => import("./TyloLens"), { ssr: false });

/* TyloLens is a large modal that only matters once someone scrolls or clicks,
   so its code loads in idle time after the page — or immediately if the menu
   asks for it first (the pending open is handed over on mount). */
export default function TyloLensLazy() {
  const [load, setLoad] = useState<false | { openOnMount?: "menu" | "fab" }>(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const source = ((e as CustomEvent).detail?.source as "menu" | "fab") ?? "menu";
      setLoad((cur) => cur || { openOnMount: source });
    };
    window.addEventListener("tylolens:open", onOpen);

    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => setLoad((cur) => cur || {});
    const schedule = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 4000 });
      else timer = setTimeout(go, 2500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("tylolens:open", onOpen);
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  return load ? <TyloLens openOnMount={load.openOnMount} /> : null;
}
