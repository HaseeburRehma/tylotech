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
    // A refresh (fonts, load, the late safety net) re-measures the page — pin
    // spacers can push the target down — and stops a native smooth scroll midway,
    // so a jump from the last few seconds is issued again after every refresh.
    const JUMP_MS = 4000;
    let jump: { go: (again?: boolean) => void; until: number } | null = null;
    // the refresh restores its own scroll position in the same frame, which would
    // cancel a scroll started here, so re-issue once it has finished
    const onRefresh = () => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (jump && performance.now() < jump.until) jump.go(true);
        }),
      );
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    // the visitor scrolls on their own: never pull them back to the old target
    const cancelJump = () => {
      jump = null;
    };
    window.addEventListener("wheel", cancelJump, { passive: true });
    window.addEventListener("touchmove", cancelJump, { passive: true });

    // tapped before hydration (or deep-linked): the browser already jumped to the
    // hash, but the layout is still settling — keep that target in place too
    if (window.location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) {
        jump = {
          go: () => window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: "auto" }),
          until: performance.now() + JUMP_MS,
        };
      }
    }

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      // a re-issue after a refresh lands directly: the visitor already saw the jump start
      const go = (again = false) => {
        if (lenis) lenis.scrollTo(el, again ? { offset: -72, immediate: true, force: true } : { offset: -72, duration: 1.2 });
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce || again ? "auto" : "smooth" });
      };
      jump = { go, until: performance.now() + JUMP_MS };
      // a link in the open mobile menu: the panel collapses first (300 ms) and
      // shifts the page — measure the target only after that
      if (anchor.closest("header") && window.innerWidth < 1180) window.setTimeout(() => go(), 320);
      else go();
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("wheel", cancelJump);
      window.removeEventListener("touchmove", cancelJump);
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
