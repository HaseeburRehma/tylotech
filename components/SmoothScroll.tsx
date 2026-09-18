"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Don't let the browser restore an old scroll position before ScrollTrigger
    // has measured the page — it throws every trigger out of sync on reload.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Start at the top on a plain load (unless deep-linked to an anchor) so no
    // section is left stranded behind a stale, restored scroll position.
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    // Smooth anchor scrolling works with or without Lenis.
    let lenis: Lenis | null = null;

    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // ScrollTrigger builds every trigger's start/end at mount — but web fonts
      // (next/font) swap in AFTER hydration and reflow the whole page, so those
      // positions go stale and no reveal ever fires. Refresh once the layout has
      // actually settled: after fonts load, after the load event, and on a few
      // delayed ticks as a safety net for late images.
      const refresh = () => ScrollTrigger.refresh();
      const timers: number[] = [];
      const scheduleRefresh = () => {
        refresh();
        [200, 600, 1200, 2000].forEach((d) =>
          timers.push(window.setTimeout(refresh, d)),
        );
      };

      if (document.fonts?.ready) {
        document.fonts.ready.then(scheduleRefresh);
      } else {
        scheduleRefresh();
      }
      if (document.readyState === "complete") {
        scheduleRefresh();
      } else {
        window.addEventListener("load", scheduleRefresh);
      }

      const onClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor) return;
        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        lenis!.scrollTo(el as HTMLElement, { offset: -72, duration: 1.2 });
      };
      document.addEventListener("click", onClick);

      return () => {
        document.removeEventListener("click", onClick);
        window.removeEventListener("load", scheduleRefresh);
        timers.forEach((id) => window.clearTimeout(id));
        gsap.ticker.remove(raf);
        lenis!.destroy();
      };
    }

    // Reduced motion: native smooth anchors only.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <>{children}</>;
}
