"use client";

import { useRef, useState } from "react";
import { Play, Music, ArrowUpRight } from "lucide-react";
import Container from "../ui/Container";
import MosaicBackdrop from "../MosaicBackdrop";
import { gsap, useGSAP } from "@/lib/gsap";

const YT_ID = "vSIs3xcjzG4";

function PlatformButton({
  badge,
  over,
  name,
  href,
}: {
  badge: React.ReactNode;
  over: string;
  name: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3.5 rounded-[14px] border border-[#01475c] bg-[#002e3d] py-3.5 pl-5 pr-[18px] transition-colors hover:border-[#0a6a86]"
    >
      {badge}
      <span className="flex flex-col">
        <span className="text-[9.5px] font-medium uppercase tracking-[0.9px] text-[#7fbacd]">
          {over}
        </span>
        <span className="text-[15px] font-medium text-white">{name}</span>
      </span>
      <ArrowUpRight className="size-4 text-white/70 transition-transform duration-300 group-hover:rotate-45" />
    </a>
  );
}

export default function Podcast() {
  const root = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useGSAP(
    () => {
      gsap.from(".podcast-text > *", {
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".podcast-text", start: "top 82%" },
      });
      gsap.from(".podcast-video", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".podcast-video", start: "top 85%" },
      });
      // play button breathing ring
      gsap.fromTo(
        ".podcast-pulse",
        { scale: 0.9, opacity: 0.5 },
        {
          scale: 1.9,
          opacity: 0,
          duration: 1.9,
          ease: "power1.out",
          repeat: -1,
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      id="podcast"
      ref={root}
      className="relative overflow-hidden bg-[#001620] py-24 text-white"
    >
      <MosaicBackdrop fade="radial-gradient(110% 100% at 25% 35%, #000 30%, transparent 78%)" />

      <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[548px_1fr]">
        <div className="podcast-text">
          <p className="eyebrow mb-6 flex items-center gap-2.5 text-[#d8b682]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            Podcast
          </p>
          <h2 className="display-l text-white">
            Unser Geschäftsführer über die Zahlen, die wirklich zählen.
          </h2>
          <p className="mt-6 text-[20px] leading-[32px] tracking-[-0.1px] text-[#b3d6e2]">
            Warum Google Ads selten zu teuer sind, welche Kennzahlen wirklich über
            Erfolg entscheiden — und woran Sie eine Agentur erkennen, die mitdenkt
            statt nur abzurechnen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <PlatformButton
              href={`https://www.youtube.com/watch?v=${YT_ID}`}
              over="Ansehen auf"
              name="YouTube"
              badge={
                <span className="grid size-[26px] place-items-center rounded-[7px] bg-[#FF0000]">
                  <Play className="size-3.5 fill-white text-white" />
                </span>
              }
            />
            <PlatformButton
              href="https://open.spotify.com"
              over="Anhören auf"
              name="Spotify"
              badge={
                <span className="grid size-[26px] place-items-center rounded-full bg-[#1DB954]">
                  <Music className="size-3.5 text-white" strokeWidth={2.4} />
                </span>
              }
            />
          </div>
        </div>

        <div className="podcast-video relative aspect-[660/371] w-full overflow-hidden rounded-[20px] border border-[#01475c]">
          {play ? (
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="TyloTech Podcast"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlay(true)}
              className="group absolute inset-0 size-full"
              aria-label="Podcast abspielen"
            >
              <span
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg)` }}
              />
              <span className="absolute inset-0 bg-[#001620]/25 transition-colors group-hover:bg-[#001620]/10" />
              <span className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="podcast-pulse size-16 rounded-full bg-accent/30" />
              </span>
              <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[#001620] shadow-lg transition-transform group-hover:scale-110">
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
