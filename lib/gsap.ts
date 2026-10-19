"use client";

import { useEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Mobile browsers resize the viewport when the address bar shows/hides;
  // without this every scroll direction change triggers a refresh, which makes
  // pinned sections jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * useGSAP for sections below the fold: the setup runs once the section is
 * within one viewport of the screen instead of during hydration.
 *
 * With ~20 sections each creating tweens + ScrollTriggers (and measuring the
 * layout) in the same hydration commit, the homepage had a ~2 s main-thread
 * block on phones. Spread out like this, each section costs one small task
 * shortly before it scrolls into view. Sections the visitor never reaches
 * (anchor jumps) simply stay in their final, visible state.
 */
export function useLazyGSAP(
  callback: () => void | (() => void),
  { scope, rootMargin = "100% 0px" }: { scope: RefObject<Element | null>; rootMargin?: string },
) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = scope.current;
    if (near || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setNear(true);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scope, near, rootMargin]);

  return useGSAP(
    () => {
      if (!near) return;
      const cleanup = callback();
      // Set up late (fast scrolling, anchor jump)? Reveals whose start already
      // lies behind the current scroll position would otherwise never fire:
      // play them right away. Scrubbed/pinned triggers manage themselves.
      const el = scope.current;
      ScrollTrigger.getAll().forEach((st) => {
        const t = st.trigger;
        if (!el || !t || !el.contains(t) || st.pin || !st.animation) return;
        if (st.vars.scrub) return;
        if (st.scroll() >= st.start && st.animation.progress() === 0) st.animation.play();
      });
      return cleanup;
    },
    { scope, dependencies: [near] },
  );
}

export { gsap, ScrollTrigger, useGSAP };
