"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, FileText, Play, Users } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { useYouTubePlaying } from "@/lib/useYouTubePlaying";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { ApplyButton, Eyebrow, Serif } from "./ui";
import s from "./software.module.css";

/* "Deine eigene ERP Software – Kontrolle + Kostensenkung" — the founder explains
   why custom software beats off-the-shelf tools (same video as the home podcast). */
const YT_ID = "UY_O3ifoQ40";

/* Poster (Figma VSL still) is served from our own domain at high priority, the
   muted YouTube player loads right after hydration and fades in once it really
   plays. A click restarts the film with sound and controls. */
function VideoCard() {
  const t = useT();
  const locale = useLocale();
  const frame = useRef<HTMLIFrameElement>(null);
  const [sound, setSound] = useState(false);
  const [mounted, setMounted] = useState(false);
  const playing = useYouTubePlaying(frame, mounted && !sound);
  const [posterGone, setPosterGone] = useState(false);

  // mount after first paint so the player never competes with the LCP poster
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  // YouTube draws its own prev/pause/next overlay for the first ~3 s of playback
  // (even with controls=0): the poster (a still of the same film) covers it
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setPosterGone(true), 2800);
    return () => clearTimeout(id);
  }, [playing]);

  const label =
    "overflow-hidden rounded-full border border-white/[0.22] bg-white/[0.16] px-3.5 py-2 eyebrow text-white backdrop-blur-xl shadow-[inset_0_0_0_0.6px_rgba(255,255,255,0.22)]";

  return (
    <div className="sw-hero-video intro-slide relative aspect-[350/197] w-full max-w-[1040px] overflow-hidden rounded-[20px] bg-[#03151c] shadow-[0_6px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.45)] [animation-delay:350ms] sm:aspect-[1040/585] sm:rounded-[28px]">
      {sound ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=1&cc_lang_pref=de`}
          title={t("Deine eigene ERP Software – Kontrolle + Kostensenkung", "Your own ERP software – control + lower costs (in German)")}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setSound(true)}
          className="group absolute inset-0 size-full cursor-pointer text-left"
          aria-label={t("Video mit Ton abspielen: Deine eigene Firmen-Software", "Play video with sound: your own company software (in German)")}
        >
          {mounted && (
            <iframe
              ref={frame}
              className="pointer-events-none absolute inset-0 size-full origin-center scale-[1.35]"
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1&controls=0&showinfo=0&iv_load_policy=3&loop=1&playlist=${YT_ID}&start=2&vq=hd1080&enablejsapi=1&cc_load_policy=1&cc_lang_pref=de`}
              title={t("Deine eigene Firmen-Software (stumm)", "Your own company software (muted)")}
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
            />
          )}

          {/* poster — the Figma still; stays until the muted film really runs */}
          <span className={cn("absolute inset-0 transition-opacity duration-700", posterGone && "opacity-0")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/software/vsl.webp"
              srcSet="/software/vsl-800.webp 800w, /software/vsl.webp 1600w"
              sizes="(min-width: 1200px) 1040px, 100vw"
              width={1600}
              height={834}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </span>
          <span className="absolute inset-x-0 bottom-0 h-[56%] bg-[linear-gradient(180deg,rgba(3,21,28,0)_0%,rgba(3,21,28,0.45)_45%,rgba(3,21,28,0.92)_100%)]" />

          {/* play (until the muted film runs) */}
          <span className={cn(s.pulse, "pointer-events-none absolute left-1/2 top-1/2 size-14 rounded-full bg-white/30 transition-opacity duration-500 sm:size-24", posterGone && "opacity-0")} />
          <span
            className={cn(
              "absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border border-white/40 bg-white/[0.72] text-[#1a1917] shadow-[inset_0_0_0_0.6px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-transform duration-300 group-hover:scale-110 sm:size-24",
              posterGone && "scale-90 opacity-0",
            )}
          >
            <Play className="size-5 translate-x-px sm:size-7" strokeWidth={1.8} aria-hidden />
          </span>

          <span className={cn(label, "absolute bottom-3 left-3 sm:bottom-6 sm:left-6")}>
            {locale === "en" ? "Subtitles on · in German" : "Untertitel an"}
          </span>
          <span className={cn(label, "absolute bottom-6 right-6 hidden sm:block")}>{t("Klicken für Ton", "Click for sound")}</span>
        </button>
      )}
    </div>
  );
}

export default function SoftwareHero() {
  const t = useT();
  const chips = [
    { icon: Users, text: t("Nur 5 Plätze diesen Monat", "Only 5 spots this month") },
    { icon: FileText, text: t("Bewerbung erforderlich", "Application required") },
    { icon: Clock, text: t("Wir melden uns innerhalb von 24 Stunden.", "We’ll get back to you within 24 hours.") },
  ];

  return (
    <section className="relative overflow-hidden bg-white pb-14 pt-10 sm:pb-24 sm:pt-16">
      {/* Figma "Warmes Licht" */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[380px] w-[590px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(209,170,113,0.3)_0%,rgba(209,170,113,0.12)_45%,rgba(209,170,113,0)_100%)] sm:top-[-200px] sm:h-[760px] sm:w-[1180px]"
      />
      <Container className="max-sm:px-5 relative flex flex-col items-center gap-7 sm:gap-10">
        <div className="intro-stagger flex max-w-[960px] flex-col items-center gap-[18px] text-center">
          <Eyebrow icon={FileText}>{t("Kostenloser App-Bauplan", "Free app blueprint")}</Eyebrow>
          <h1 className="t-h2 [--fs-m:34] [--lh-m:38] [--ls-m:-1.2] text-[#1a1917]">
            {t("Wir bauen dir deine eigene Firmen-Software,", "We build your own company software,")}{" "}
            <br className="hidden md:inline" />
            <Serif>{t("bis alles stimmt.", "until everything’s right.")}</Serif>
          </h1>
          <p className="t-body-l text-[#5c5954]">
            {t(
              "Fester Preis. Erste Version in 6 Wochen live. Und einen Bauplan (Wert 1.000 €) bekommst du vorab. Kostenlos.",
              "Fixed price. First version live in 6 weeks. And you get a blueprint (worth €1,000) up front. For free.",
            )}
          </p>
        </div>

        <VideoCard />

        <div className="intro-up flex w-full flex-col items-center gap-4 [animation-delay:500ms] sm:gap-[22px]">
          <ApplyButton label={t("Jetzt bewerben", "Apply now")} variant="gold" size="lg" className="w-full sm:w-auto" />
          <ul className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-7 sm:gap-y-2">
            {chips.map(({ icon: I, text }) => (
              <li key={text} className="flex items-center gap-2 t-label-m text-[#5c5954]">
                <I className="size-4 shrink-0 text-[#c79a53]" strokeWidth={1.8} aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
