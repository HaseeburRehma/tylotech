"use client";

import { useRef, useState } from "react";
import { Play, Music, ArrowUpRight, Headphones } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const YT_ID = "UY_O3ifoQ40"; // "Deine eigene ERP Software – Kontrolle + Kostensenkung"

/* the dialogue that opens the section — them (light) / us (dark), last line is the turn */
const DIALOG: { who: "them" | "us"; text: React.ReactNode }[] = [
  { who: "them", text: "Welche Software nutzt ihr?" },
  { who: "us", text: "Die, die alle nutzen." },
  { who: "them", text: "Und passt die zu euch?" },
  {
    who: "us",
    text: (
      <>
        …ehrlich? <span className="text-[#d8b682]">Nicht wirklich.</span>
      </>
    ),
  },
];

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
        <span className="text-[9.5px] font-medium uppercase tracking-[0.9px] text-ink/45">{over}</span>
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
      const st = { trigger: ".podcast-chat", start: "top 80%", toggleActions: "play none none none" };
      gsap.from(".podcast-eyebrow", { y: 18, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: st });
      // the conversation pops in line by line
      gsap.from(".podcast-bubble", {
        y: 14,
        scale: 0.97,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(1.6)",
        stagger: 0.32,
        delay: 0.15,
        scrollTrigger: st,
      });
      gsap.from(".podcast-after > *", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        delay: 1.45,
        scrollTrigger: st,
      });
      gsap.from(".podcast-video", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".podcast-video", start: "top 85%", toggleActions: "play none none none" },
      });
      // play button breathing ring
      gsap.fromTo(".podcast-pulse", { scale: 0.9, opacity: 0.5 }, { scale: 1.9, opacity: 0, duration: 1.9, ease: "power1.out", repeat: -1 });
    },
    { scope: root },
  );

  return (
    <section id="podcast" ref={root} className="relative overflow-hidden border-t border-line bg-[#f3f5f6] py-20 text-ink sm:py-24">
      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16">
        <div>
          <p className="podcast-eyebrow mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Headphones className="size-3.5 text-accent" />
            Zum Mithören
          </p>

          <h2 className="sr-only">Eigene Software für dein Unternehmen</h2>

          {/* dialogue as chat bubbles */}
          <div className="podcast-chat flex max-w-[520px] flex-col gap-3 sm:gap-3.5" aria-label="Dialog">
            {DIALOG.map((d, i) => {
              const last = i === DIALOG.length - 1;
              return (
                <div key={i} className={cn("flex", d.who === "us" ? "justify-end" : "justify-start")}>
                  <p
                    className={cn(
                      "podcast-bubble max-w-[82%] rounded-[22px] px-5 py-3.5 font-display text-[clamp(18px,1.9vw,24px)] font-semibold leading-[1.25] tracking-[-0.01em] sm:px-[22px] sm:py-4",
                      d.who === "them" ? "rounded-bl-md bg-[#e8e5dd] text-[#6a6557]" : "rounded-br-md bg-[#001620] text-white",
                      last && "shadow-[0_14px_30px_-12px_rgba(0,22,32,0.55)]",
                    )}
                  >
                    {d.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="podcast-after">
            <p className="mb-5 mt-8 font-[family-name:var(--font-instrument)] text-[clamp(28px,3vw,38px)] leading-[1.12] tracking-[-0.02em] text-ink">
              Genau da <span className="italic text-[#94713f]">fangen wir an.</span>
            </p>
            <p className="max-w-[50ch] text-[clamp(16px,1.4vw,17.5px)] leading-[1.6] tracking-[-0.1px] text-[#5c5954]">
              Die meisten Unternehmen zwängen ihre Abläufe in Software, die nie für sie gebaut wurde. Wir drehen das um — und
              bauen eine Lösung, die sich um <span className="font-semibold text-ink">dein</span> Unternehmen biegt, nicht
              andersrum. Maßgeschneidert auf deine Prozesse, deine Branche, deine Regeln. So wie zuletzt für Priya.
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
        </div>

        <div className="podcast-video relative aspect-video w-full overflow-hidden rounded-[22px] border border-black/5 bg-[#0a1813] shadow-[0_30px_70px_-28px_rgba(10,30,20,0.5)]">
          {play ? (
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Deine eigene ERP Software – Kontrolle + Kostensenkung"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button onClick={() => setPlay(true)} className="group absolute inset-0 size-full text-left" aria-label="Video abspielen: Eigene Software für dein Unternehmen">
              {/* poster is served from our own domain — nothing loads from YouTube before the click */}
              <span className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" style={{ backgroundImage: "url(/podcast/erp-software.webp)" }} />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,22,32,0.55)_0%,rgba(0,22,32,0.05)_32%,rgba(0,22,32,0.05)_55%,rgba(0,22,32,0.78)_100%)]" />

              {/* title */}
              <span className="absolute inset-x-5 top-5 flex items-center gap-2.5 sm:inset-x-6 sm:top-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/tylotech-mark.svg" alt="" className="h-[30px] w-[30px] shrink-0 rounded-lg bg-[#001620] p-1" />
                <span className="font-display text-[clamp(15px,1.5vw,19px)] font-semibold leading-tight text-white">Eigene Software für dein Unternehmen</span>
              </span>

              {/* play */}
              <span className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="podcast-pulse size-16 rounded-full bg-accent/30" />
              </span>
              <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[#001620] shadow-lg transition-transform group-hover:scale-110 sm:size-[72px]">
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>

              {/* caption */}
              <span className="pointer-events-none absolute inset-x-5 bottom-6 max-w-[440px] text-[clamp(13px,1.25vw,16px)] font-medium leading-snug text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] sm:inset-x-6 sm:bottom-7">
                Warum Standard-Software dich ausbremst — und was die Alternative ist.
              </span>
              <span className="absolute inset-x-0 bottom-0 h-[5px] bg-white/25">
                <span className="block h-full w-[8%] bg-[#ff2d2d]" />
              </span>
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
