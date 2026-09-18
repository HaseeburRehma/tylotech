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

      // Keep ScrollTrigger measurements fresh once fonts/images settle.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const t = window.setTimeout(refresh, 600);

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
        window.removeEventListener("load", refresh);
        window.clearTimeout(t);
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
