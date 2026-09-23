"use client";

import { useRef, useState } from "react";
import { Play, Music, ArrowUpRight, Headphones } from "lucide-react";
import Container from "../ui/Container";
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
      className="group flex items-center gap-3.5 rounded-[14px] border border-line bg-white py-3 pl-4 pr-[16px] shadow-[0_1px_3px_rgba(15,14,13,0.05)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_26px_-16px_rgba(15,14,13,0.4)]"
    >
      {badge}
      <span className="flex flex-col">
        <span className="text-[9.5px] font-medium uppercase tracking-[0.9px] text-ink/45">
          {over}
        </span>
        <span className="text-[15px] font-medium text-ink">{name}</span>
      </span>
      <ArrowUpRight className="size-4 text-ink/40 transition-transform duration-300 group-hover:rotate-45" />
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
      className="relative overflow-hidden border-t border-line bg-[#f3f5f6] py-20 text-ink sm:py-24"
    >
      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[520px_1fr] lg:gap-16">
        <div className="podcast-text">
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Headphones className="size-3.5 text-accent" />
            Zum Mithören
          </p>
          <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            Unser Geschäftsführer über die Zahlen, die wirklich zählen.
          </h2>
          <p className="mt-5 text-[clamp(16px,1.4vw,18px)] leading-[1.6] tracking-[-0.1px] text-[#5c5954]">
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

        <div className="podcast-video relative aspect-[660/371] w-full overflow-hidden rounded-[20px] border border-black/5 shadow-[0_44px_90px_-44px_rgba(15,14,13,0.5)]">
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
              className="group absolute inset-0 size-full text-left"
              aria-label="Podcast abspielen"
            >
              <span
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg)` }}
              />
              <span className="absolute inset-0 bg-[#001620]/20 transition-colors group-hover:bg-[#001620]/10" />
              <span className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="podcast-pulse size-16 rounded-full bg-accent/30" />
              </span>
              <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[#001620] shadow-lg transition-transform group-hover:scale-110">
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>

              {/* episode label */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5 pt-16">
                <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#d8b682]">
                  TyloTech Podcast
                </span>
                <span className="mt-1 block max-w-[440px] text-[clamp(13px,1.1vw,15px)] font-semibold leading-snug text-white">
                  Google Ads sind nicht zu teuer, wenn du deine KPIs kennst
                </span>
              </span>
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
