"use client";

import { useState } from "react";

export default function HeroVideoCard({
  videoId,
  label = "Imagefilm",
}: {
  videoId: string;
  label?: string;
}) {
  const [posterVisible, setPosterVisible] = useState(true);
  const [poster, setPoster] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  );

  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&controls=0&showinfo=0&iv_load_policy=3&loop=1&playlist=${videoId}`;

  return (
    <div className="hero-media relative w-full">
      {/* warm ambient glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-[radial-gradient(60%_58%_at_62%_55%,rgba(209,170,113,0.30),transparent_70%)] blur-2xl"
      />
      <div className="relative aspect-[7/5] overflow-hidden rounded-[24px] border border-black/5 bg-ink shadow-[0_44px_90px_-38px_rgba(15,14,13,0.55)]">
        <iframe
          className="pointer-events-none absolute inset-0 h-full w-full origin-center scale-[1.35]"
          src={src}
          title="Imagefilm"
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() => {
            setTimeout(() => setPosterVisible(false), 800);
          }}
        />

        {/* Poster overlay — fades out once video loads */}
        <div
          className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-700 ${posterVisible ? "opacity-100" : "opacity-0"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            onError={() =>
              setPoster(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
            }
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
        </div>

        {/* label pill */}
        <span className="absolute bottom-4 left-4 z-10 rounded-md bg-black/35 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur sm:bottom-5 sm:left-5">
          {label}
        </span>
      </div>
    </div>
  );
}
