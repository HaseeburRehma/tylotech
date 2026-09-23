"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/* Poster + play button that swaps to the YouTube embed on click. */
export default function HeroVideoCard({
  videoId,
  label = "Imagefilm",
}: {
  videoId: string;
  label?: string;
}) {
  const [play, setPlay] = useState(false);
  const [poster, setPoster] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  );

  return (
    <div className="hero-media relative w-full">
      {/* warm ambient glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-[radial-gradient(60%_58%_at_62%_55%,rgba(209,170,113,0.30),transparent_70%)] blur-2xl"
      />
      <div className="relative aspect-[7/5] overflow-hidden rounded-[24px] border border-black/5 bg-ink shadow-[0_44px_90px_-38px_rgba(15,14,13,0.55)]">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title="Imagefilm"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label="Imagefilm abspielen"
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt=""
              onError={() =>
                setPoster(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
              }
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />

            {/* play button */}
            <span className="absolute left-1/2 top-1/2 grid size-[clamp(60px,15vw,84px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
              <Play
                className="size-[clamp(22px,6vw,30px)] translate-x-0.5 fill-white text-white"
                strokeWidth={0}
              />
            </span>

            {/* label pill */}
            <span className="absolute bottom-4 left-4 rounded-md bg-black/35 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur sm:bottom-5 sm:left-5">
              {label}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
