"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Music, ArrowUpRight, Headphones, Volume2 } from "lucide-react";
import { useYouTubePlaying } from "@/lib/useYouTubePlaying";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { pick } from "@/lib/i18n";
import { useLocale, useT } from "../i18n/LocaleProvider";

const YT_ID = "UY_O3ifoQ40"; // "Deine eigene ERP Software – Kontrolle + Kostensenkung"

/* the dialogue that opens the section — them (light) / us (dark), last line is the turn */
const DIALOG_DE: { who: "them" | "us"; text: React.ReactNode }[] = [
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

const DIALOG_EN: { who: "them" | "us"; text: React.ReactNode }[] = [
  { who: "them", text: "What software do you use?" },
  { who: "us", text: "The same as everyone else." },
  { who: "them", text: "And does it fit you?" },
  {
    who: "us",
    text: (
      <>
        …honestly? <span className="text-[#d8b682]">Not really.</span>
      </>
    ),
  },
];

const DIALOG = { de: DIALOG_DE, en: DIALOG_EN };

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
      className="group flex min-w-0 items-center gap-2.5 rounded-[14px] border border-line bg-white px-3 py-3 sm:gap-3.5 sm:pl-4 sm:pr-[16px] shadow-[0_1px_3px_rgba(15,14,13,0.05)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_26px_-16px_rgba(15,14,13,0.4)]"
    >
      {badge}
      <span className="flex flex-col">
        <span className="whitespace-nowrap text-[9.5px] font-medium uppercase tracking-[0.9px] text-ink/45">{over}</span>
        <span className="text-[15px] font-medium text-ink">{name}</span>
      </span>
      <ArrowUpRight className="ml-auto size-4 shrink-0 text-ink/40 max-[399px]:hidden transition-transform duration-300 group-hover:rotate-45" />
    </a>
  );
}

export default function Podcast() {
  const root = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useT();
  const dialog = pick(locale, DIALOG);
  const videoTitle = t("Eigene Software für dein Unternehmen", "Custom software for your business");
  const videoRef = useRef<HTMLDivElement>(null);
  // muted autoplay starts once the video is near the viewport (like the hero);
  // a click restarts it with sound and player controls
  const [near, setNear] = useState(false);
  const [sound, setSound] = useState(false);
  const mutedFrame = useRef<HTMLIFrameElement>(null);
  const playing = useYouTubePlaying(mutedFrame, near && !sound);
  // poster stays until the muted player really plays, plus a beat for YouTube's title bar
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(t);
  }, [playing]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <section id="podcast" ref={root} className="relative overflow-hidden border-t border-line bg-[#f3f5f6] py-14 text-ink sm:py-24">
      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16">
        <div>
          <p className="podcast-eyebrow mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Headphones className="size-3.5 text-accent" />
            {t("Zum Mithören", "Listen in")}
          </p>

          <h2 className="sr-only">{videoTitle}</h2>

          {/* dialogue as chat bubbles */}
          <div className="podcast-chat flex max-w-[520px] flex-col gap-3 sm:gap-3.5" aria-label={t("Dialog", "Dialogue")}>
            {dialog.map((d, i) => {
              const last = i === dialog.length - 1;
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
              {t(
                <>
                  Genau da <span className="italic text-[#94713f]">fangen wir an.</span>
                </>,
                <>
                  That’s exactly <span className="italic text-[#94713f]">where we start.</span>
                </>,
              )}
            </p>
            <p className="max-w-[50ch] text-[clamp(16px,1.4vw,17.5px)] leading-[1.6] tracking-[-0.1px] text-[#5c5954]">
              {t(
                <>
                  Die meisten Unternehmen zwängen ihre Abläufe in Software, die nie für sie gebaut wurde. Wir drehen das um — und
                  bauen eine Lösung, die sich um <span className="font-semibold text-ink">dein</span> Unternehmen biegt, nicht
                  andersrum. Maßgeschneidert auf deine Prozesse, deine Branche, deine Regeln. So wie zuletzt für Priya.
                </>,
                <>
                  Most businesses squeeze their workflows into software that was never built for them. We flip that — and
                  build a solution that bends around <span className="font-semibold text-ink">your</span> business, not the
                  other way round. Tailored to your processes, your industry, your rules. Just like we recently did for Priya.
                </>,
              )}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3.5">
              <PlatformButton
                href={`https://www.youtube.com/watch?v=${YT_ID}`}
                over={t("Ansehen auf", "Watch on")}
                name="YouTube"
                badge={
                  <span className="grid size-[26px] place-items-center rounded-[7px] bg-[#FF0000]">
                    <Play className="size-3.5 fill-white text-white" />
                  </span>
                }
              />
              <PlatformButton
                href="https://open.spotify.com"
                over={t("Anhören auf", "Listen on")}
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

        <div ref={videoRef} className="podcast-video relative aspect-video w-full overflow-hidden rounded-[22px] border border-black/5 bg-[#0a1813] shadow-[0_30px_70px_-28px_rgba(10,30,20,0.5)]">
          {sound ? (
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={t("Deine eigene ERP Software – Kontrolle + Kostensenkung", "Your own ERP software – control + lower costs (in German)")}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button onClick={() => setSound(true)} className="group absolute inset-0 size-full text-left" aria-label={t("Video mit Ton abspielen: Eigene Software für dein Unternehmen", "Play video with sound: Custom software for your business (in German)")}>
              {near && (
                <iframe
                  className="pointer-events-none absolute inset-0 size-full origin-center scale-[1.02]"
                  src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&controls=0&iv_load_policy=3&loop=1&playlist=${YT_ID}&disablekb=1&enablejsapi=1`}
                  title={t("Eigene Software für dein Unternehmen (stumm)", "Custom software for your business (muted)")}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  tabIndex={-1}
                  ref={mutedFrame}
                />
              )}
              {/* poster from our own domain — covers the player until it runs (and YouTube's title bar) */}
              <span
                className={cn(
                  "absolute inset-0 bg-cover bg-center transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03]",
                  loaded && "opacity-0",
                )}
                style={{ backgroundImage: "url(/podcast/erp-software.webp)" }}
              />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,22,32,0.55)_0%,rgba(0,22,32,0.05)_32%,rgba(0,22,32,0.05)_55%,rgba(0,22,32,0.78)_100%)]" />

              {/* title */}
              <span className="absolute inset-x-5 top-5 flex items-center gap-2.5 sm:inset-x-6 sm:top-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" decoding="async" src="/brand/tylotech-mark.svg" alt="" className="h-[30px] w-[30px] shrink-0 rounded-lg bg-[#001620] p-1" />
                <span className="font-display text-[clamp(15px,1.5vw,19px)] font-semibold leading-tight text-white">{videoTitle}</span>
                {locale === "en" && <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-white/85 backdrop-blur">In German</span>}
              </span>

              {/* play (until the muted video runs) */}
              <span className={cn("pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-500", loaded && "opacity-0")}>
                <span className="podcast-pulse size-16 rounded-full bg-accent/30" />
              </span>
              <span className={cn("absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[#001620] shadow-lg transition-[transform,opacity] duration-500 group-hover:scale-110 sm:size-[72px]", loaded && "opacity-0")}>
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>

              {/* caption */}
              <span className="pointer-events-none absolute inset-x-5 bottom-6 max-w-[440px] text-[clamp(13px,1.25vw,16px)] font-medium leading-snug text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] sm:inset-x-6 sm:bottom-7 max-sm:hidden">
                {t(
                  "Warum Standard-Software dich ausbremst — und was die Alternative ist.",
                  "Why off-the-shelf software holds you back — and what the alternative is.",
                )}
              </span>

              {/* sound on */}
              <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-[12.5px] font-semibold text-[#001620] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] backdrop-blur transition-transform duration-200 group-hover:scale-105 sm:bottom-6 sm:right-6">
                <Volume2 className="size-4" strokeWidth={2.2} />
                {t("Mit Ton ansehen", "Watch with sound")}
              </span>
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
