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

    // ScrollTrigger builds every trigger's start/end at mount — but web fonts
    // (next/font) swap in AFTER hydration and reflow the whole page, so those
    // positions go stale and no reveal ever fires. Refresh once the layout has
    // settled (fonts, load event, one late safety net). Requests are coalesced
    // into one refresh per frame: every refresh re-measures every trigger.
    let pending = 0;
    const refresh = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const late = window.setTimeout(refresh, 1500);
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    // Lenis only where it changes something: wheel/trackpad scrolling. Touch
    // devices scroll natively anyway, so there it would only add per-frame work.
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    if (!reduce && !touch) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      lenis.on("scroll", ScrollTrigger.update);
      // modals (TyloLens) pause page scrolling via window.__lenis.stop()/start()
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth anchor scrolling with or without Lenis (72px = sticky header).
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      const go = () => {
        if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.2 });
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce ? "auto" : "smooth" });
      };
      // a link in the open mobile menu: the panel collapses first (300 ms) and
      // shifts the page — measure the target only after that
      if (anchor.closest("header") && window.innerWidth < 1024) window.setTimeout(go, 320);
      else go();
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(late);
      cancelAnimationFrame(pending);
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
