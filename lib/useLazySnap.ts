"use client";

import { useEffect, type RefObject } from "react";

/** Scroll-snap only once the visitor uses the carousel.
 *  A snap container re-snaps whenever its layout changes (e.g. web fonts
 *  swapping in at load). Chrome treats that scroll like user input and stops
 *  measuring the page's Largest Contentful Paint — the page then reports no
 *  LCP at all. So the snap classes are switched on (data-snap="on") with the
 *  first touch / drag / wheel / key, or by `enableSnap` before a programmatic scroll. */
export function useLazySnap(track: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => {
      el.dataset.snap = "on";
    };
    const EVENTS = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
    EVENTS.forEach((ev) => el.addEventListener(ev, on, { once: true, passive: true }));
    return () => EVENTS.forEach((ev) => el.removeEventListener(ev, on));
  }, [track]);
}

export function enableSnap(el: HTMLElement | null | undefined) {
  if (el) el.dataset.snap = "on";
}
