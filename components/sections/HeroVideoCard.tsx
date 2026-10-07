"use client";

import { useEffect, useRef, useState } from "react";
import { useYouTubePlaying } from "@/lib/useYouTubePlaying";
import { useT } from "../i18n/LocaleProvider";

/* The poster is the hero's largest element, so it is served from our own
   domain (public/hero, WebP) at high priority. The YouTube player (~2 MB of
   script and video) mounts on the first interaction or 3.5 s after load —
   it no longer competes with the first paint. */
export default function HeroVideoCard({ videoId }: { videoId: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const t = useT();
  const [mountVideo, setMountVideo] = useState(false);
  const playing = useYouTubePlaying(frame, mountVideo);

  useEffect(() => {
    // start the player on the first interaction, or 3.5 s after load at the latest
    const EVENTS = ["scroll", "pointermove", "pointerdown", "touchstart", "keydown"] as const;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => setMountVideo(true);
    const afterLoad = () => {
      timer = setTimeout(go, 3500);
    };
    EVENTS.forEach((ev) => window.addEventListener(ev, go, { once: true, passive: true }));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      EVENTS.forEach((ev) => window.removeEventListener(ev, go));
      window.removeEventListener("load", afterLoad);
      clearTimeout(timer);
    };
  }, []);

  // poster stays until the player really plays (autoplay can be blocked),
  // plus a beat so YouTube's start-up title bar is gone
  const [posterVisible, setPosterVisible] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setPosterVisible(false), 2600);
    return () => clearTimeout(id);
  }, [playing]);

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&controls=0&showinfo=0&iv_load_policy=3&loop=1&playlist=${videoId}&start=2&vq=hd1080&enablejsapi=1`;

  return (
    <div className="hero-media intro-slide relative w-full [animation-delay:500ms]">
      {/* warm ambient glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-[radial-gradient(60%_58%_at_62%_55%,rgba(209,170,113,0.30),transparent_70%)] blur-2xl"
      />
      <div className="relative aspect-[7/5] overflow-hidden rounded-[24px] border border-black/5 bg-ink shadow-[0_44px_90px_-38px_rgba(15,14,13,0.55)]">
        {mountVideo && (
          <iframe
            className="pointer-events-none absolute inset-0 h-full w-full origin-center scale-[1.35]"
            src={src}
            title={t("Imagefilm", "Brand film")}
            allow="autoplay; encrypted-media; picture-in-picture"
            ref={frame}
          />
        )}

        {/* Poster overlay — fades out once the video really plays */}
        <div
          className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-500 ${posterVisible ? "opacity-100" : "opacity-0"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/poster.webp"
            srcSet="/hero/poster-720.webp 720w, /hero/poster.webp 1280w"
            sizes="(min-width: 1180px) 620px, 100vw"
            width={1280}
            height={720}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
