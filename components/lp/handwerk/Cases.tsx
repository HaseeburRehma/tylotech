"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Award, BadgeCheck, Pause, Play, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import { gsap, reducedMotion, useLazyGSAP } from "@/lib/gsap";
import { ROHR_CLEANER_VOICE } from "@/lib/voices";
import { cn } from "@/lib/cn";
import { Pill, ProofRow, Stars } from "./ui";

/* 02 · Case Rohr Cleaner and 03 · Case Nouh-Wehres. */

const CARD_SHADOW = "shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)]";

function Lists({ before, after }: { before: string[]; after: string[] }) {
  return (
    <>
      <div className="lpc-in flex w-full flex-col gap-3.5">
        <p className="eyebrow text-[#7d7973]">Ausgangssituation</p>
        <ul className="flex flex-col gap-3">
          {before.map((t) => (
            <ProofRow key={t} kind="before">
              {t}
            </ProofRow>
          ))}
        </ul>
      </div>
      <div className="lpc-in h-px w-full bg-[#e2e0dc]" />
      <div className="lpc-in flex w-full flex-col gap-3.5">
        <p className="eyebrow text-[#94713f]">Ergebnis mit unserem System</p>
        <ul className="flex flex-col gap-3">
          {after.map((t) => (
            <ProofRow key={t} kind="after">
              {t}
            </ProofRow>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ---------- 02 · Rohr Cleaner ---------- */

const STATS = [
  { to: 80, suffix: "", label: "neue Anfragen pro Monat" },
  { to: 100, suffix: " %", label: "mehr Aufträge als vorher" },
];

export function CaseRohr() {
  const root = useRef<HTMLElement>(null);

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 80%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".lpc-card", { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: st(".lpc-card", "top 85%") });
      gsap.from(".lpc-in", { y: 22, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.08, delay: 0.15, scrollTrigger: st(".lpc-card") });
      gsap.from(".lpc-in li", { x: -14, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.07, delay: 0.4, scrollTrigger: st(".lpc-card") });
      gsap.from(".lpc-photo img", { scale: 1.15, duration: 1.6, ease: "power2.out", scrollTrigger: st(".lpc-photo", "top 90%") });
      gsap.from(".lpc-stat", { y: 30, opacity: 0, scale: 0.96, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.25, scrollTrigger: st(".lpc-proof") });
      gsap.from(".lpc-voice", { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.55, scrollTrigger: st(".lpc-proof") });
      // count the figures up once they are on screen
      root.current?.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          delay: 0.35,
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
          scrollTrigger: st(".lpc-proof"),
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="ergebnisse" ref={root} className="scroll-mt-20 bg-white py-14 sm:py-24 lg:py-28">
      <Container>
        <div className={cn("lpc-card flex flex-col gap-10 overflow-hidden rounded-[28px] border border-[#eeedea] bg-white p-6 sm:rounded-[32px] sm:p-10 lg:flex-row lg:items-center lg:gap-16 lg:p-16", CARD_SHADOW)}>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            <div className="lpc-in flex flex-wrap items-center gap-4">
              <Pill icon={Award}>Case 01 · Rohrreinigung · Düsseldorf</Pill>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lp/handwerk/rc-blau.svg" alt="Rohr Cleaner" width={51} height={40} className="h-10 w-auto" />
            </div>
            <h2 className="lpc-in t-h2 text-[#1a1917]">
              Von unsichtbar <span className="t-serif text-[#0e5836]">zu voll ausgebucht.</span>
            </h2>
            <Lists
              before={["Wenige Anfragen, fast alle über Empfehlungen", "Online kaum sichtbar, kein planbarer Zulauf", "Abhängig davon, ob jemand den Namen weitergibt"]}
              after={[
                "Planbare Anfragen jede Woche, direkt in der eigenen App",
                "Top-Sichtbarkeit in Düsseldorf und Neuss, beide Städte exklusiv",
                "Aufträge fließen über unser System und TyloHQ, nicht über Zufall",
              ]}
            />
            <div className="lpc-in lpc-photo relative aspect-[566/300] w-full overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lp/handwerk/fuhrpark.webp" alt="Fuhrpark von Rohr Cleaner in Düsseldorf" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>

          <div className="lpc-proof flex w-full flex-col gap-4 sm:gap-5 lg:w-[520px] lg:shrink-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="lpc-stat rounded-[18px] border border-[#d1aa71] bg-[#fbf6ee] px-4 py-4 sm:px-[22px] sm:py-5">
                  <p className="t-stat text-[#1a1917] max-sm:text-[38px] max-sm:leading-[44px]">
                    <span data-count={s.to}>{s.to}</span>
                    {s.suffix}
                  </p>
                  <p className="t-body-s mt-2 text-[#5c5954]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="lpc-stat rounded-[18px] border border-[#d1aa71] bg-[#fbf6ee] px-4 py-4 sm:px-[22px] sm:py-5">
              <p className="t-stat text-[#1a1917] max-sm:text-[38px] max-sm:leading-[44px]">
                <span data-count={0}>0</span> € Werbebudget
              </p>
              <p className="t-body-s mt-2 text-[#5c5954]">Alles organisch gewachsen. Keine einzige bezahlte Anzeige.</p>
            </div>
            <VoiceCard />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* WhatsApp-style voice message (Figma "Sprachnotiz"), plays the real recording. */
const BARS = [6, 10, 16, 22, 14, 8, 18, 26, 20, 12, 8, 16, 24, 18, 10, 6, 14, 20, 12, 8, 16, 22, 10, 6, 12, 18, 24, 14, 8, 10, 16, 20, 12, 6, 8, 14, 18, 10, 6, 12, 16, 22, 18, 10, 8, 6, 12, 8];
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function VoiceCard() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const total = ROHR_CLEANER_VOICE.duration;

  useEffect(() => {
    const a = audio.current;
    return () => a?.pause();
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audio.current;
    if (!a) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * total;
    setTime(a.currentTime);
    if (a.paused) a.play().catch(() => {});
  };
  // before the first play a third of the wave shows as "heard", like the Figma frame
  const progress = playing || time > 0 ? time / total : 0.33;

  return (
    <figure className={cn("lpc-voice flex flex-col gap-[18px] rounded-[22px] border border-[#eeedea] bg-white p-[18px] sm:p-[22px]", "shadow-[0_7px_10px_rgba(8,34,44,0.06),0_23px_18px_rgba(8,34,44,0.05),0_51px_24px_rgba(8,34,44,0.03)]")}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#eeedea] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lp/handwerk/rc-blau.svg" alt="" width={51} height={40} className="h-[22px] w-auto" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="t-label-m text-[#1a1917]">Rohr Cleaner</p>
          <p className="t-body-xs text-[#7d7973]">Sprachnachricht an TyloTech</p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 eyebrow text-[#94713f] max-sm:text-[10px]">
          <BadgeCheck className="size-3.5" strokeWidth={1.8} aria-hidden />
          Echte Nachricht
        </span>
      </div>
      <div className="flex items-center gap-3.5 rounded-[16px] bg-[#f6f5f3] py-3 pl-3 pr-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Sprachnachricht pausieren" : "Sprachnachricht abspielen"}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-[#d1aa71] text-[#1a1917] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[filter] hover:brightness-105"
        >
          {playing ? <Pause className="size-[18px]" strokeWidth={2} aria-hidden /> : <Play className="ml-0.5 size-[18px]" strokeWidth={2} aria-hidden />}
        </button>
        <div onClick={seek} role="presentation" className="flex h-7 min-w-0 flex-1 cursor-pointer items-center gap-[3px] overflow-hidden">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={cn("w-[3px] shrink-0 rounded-[2px] transition-colors duration-150", (i + 0.5) / BARS.length <= progress ? "bg-[#d1aa71]" : "bg-[#cbc8c2]")}
              style={{ height: h }}
            />
          ))}
        </div>
        <span className="shrink-0 font-mono text-[13px] leading-4 tabular-nums text-[#5c5954]">{fmt(playing || time > 0 ? time : total)}</span>
      </div>
      <blockquote className="t-body-m text-[#1a1917]">„Ohne das Team TyloTech hätten wir das auf gar keinen Fall geschafft.“</blockquote>
      <figcaption className="flex flex-wrap items-center gap-3">
        <Stars />
        <span className="t-label-l text-[#1a1917]">5,0</span>
        <span className="t-body-s text-[#5c5954]">Partner seit 2023</span>
      </figcaption>
      <audio
        ref={audio}
        src={ROHR_CLEANER_VOICE.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={(e) => {
          e.currentTarget.currentTime = 0;
          setTime(0);
        }}
      />
    </figure>
  );
}

/* ---------- 03 · Nouh-Wehres ---------- */

type Req = { title: string; meta: string; status: "neu" | "zugewiesen" | "termin" };
const FEED: Req[] = [
  { title: "Badsanierung, Düsseldorf-Bilk", meta: "vor 4 Minuten", status: "neu" },
  { title: "Komplettbad, Oberkassel", meta: "vor 26 Minuten", status: "neu" },
  { title: "Gäste-WC, Flingern", meta: "heute, 08:40, M. Weber", status: "zugewiesen" },
  { title: "Badsanierung, Neuss", meta: "Freitag, 10:00 Uhr", status: "termin" },
  { title: "Barrierefreies Bad, Kaarst", meta: "vor 41 Minuten", status: "neu" },
  { title: "Wärmepumpe, Meerbusch", meta: "heute, 11:15, S. Klein", status: "zugewiesen" },
  { title: "Teilsanierung Bad, Willich", meta: "Montag, 09:30 Uhr", status: "termin" },
];
const BADGE: Record<Req["status"], { label: string; cls: string; dot: string }> = {
  neu: { label: "Neu", cls: "bg-[#e7f4ed] text-[#1e7a52]", dot: "bg-[#1e7a52]" },
  zugewiesen: { label: "Zugewiesen", cls: "bg-[#fbf3e4] text-[#94713f]", dot: "bg-[#c79a53]" },
  termin: { label: "Termin", cls: "bg-[#f1f0ee] text-[#5c5954]", dot: "bg-[#7d7973]" },
};

/** `compact`: the tighter cards floating over the TyloHQ dashboard. */
export function RequestCard({ r, className, compact = false }: { r: Req; className?: string; compact?: boolean }) {
  const b = BADGE[r.status];
  return (
    <div
      className={cn(
        "flex items-center rounded-[14px] border border-[#eeedea] bg-white shadow-[0_6px_16px_rgba(8,34,44,0.07),0_2px_4px_rgba(8,34,44,0.04)]",
        compact ? "gap-3.5 px-3.5 py-3" : "gap-4 px-3.5 py-3.5 sm:px-4",
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#fbf6ee]">
        <Zap className="size-[18px] text-[#c79a53]" strokeWidth={1.8} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#94713f] sm:text-[12px]">Neue Anfrage</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className={cn("t-label-m text-[#1a1917]", !compact && "sm:text-[15px]")}>{r.title}</p>
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase leading-[18px] tracking-[0.3px]", b.cls)}>
            <span className={cn("size-1.5 rounded-full", b.dot)} aria-hidden />
            {b.label}
          </span>
        </div>
        <p className="t-body-xs mt-0.5 text-[#7d7973]">{r.meta}</p>
      </div>
    </div>
  );
}

/** Four requests on screen; every few seconds the next one slides in on top and the list glides down. */
function LiveFeed() {
  const [start, setStart] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion()) return;
    const id = window.setInterval(() => setStart((s) => (s - 1 + FEED.length) % FEED.length), 3400);
    return () => window.clearInterval(id);
  }, [visible]);

  useLayoutEffect(() => {
    const el = box.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first || start === 0) return;
    const shift = first.offsetHeight + 12;
    gsap.fromTo(el, { y: -shift }, { y: 0, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(first, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.1 });
  }, [start]);

  const items = Array.from({ length: 4 }, (_, i) => (start + i) % FEED.length);

  return (
    <div className="overflow-hidden rounded-[14px]">
      <div ref={box} className="flex flex-col gap-3">
        {items.map((n) => (
          <RequestCard key={n} r={FEED[n]} />
        ))}
      </div>
    </div>
  );
}

export function CaseNouh() {
  const root = useRef<HTMLElement>(null);

  useLazyGSAP(
    () => {
      const st = { trigger: ".lpn-card", start: "top 80%", toggleActions: "play none none none" };
      gsap.from(".lpn-card", { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { ...st, start: "top 85%" } });
      gsap.from(".lpn-app", { x: -40, opacity: 0, duration: 1, ease: "power3.out", delay: 0.15, scrollTrigger: st });
      gsap.from(".lpn-text > *", { y: 22, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.08, delay: 0.2, scrollTrigger: st });
      gsap.from(".lpn-text li", { x: -14, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.07, delay: 0.5, scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-white pb-14 sm:pb-24 lg:pb-28">
      <Container>
        <div className={cn("lpn-card flex flex-col-reverse gap-10 rounded-[28px] border border-[#eeedea] bg-[#f6f5f3] p-6 sm:rounded-[32px] sm:p-10 lg:flex-row lg:items-center lg:gap-16 lg:p-16", CARD_SHADOW)}>
          <div className="lpn-app w-full rounded-[24px] border border-[#d1aa71] bg-[#fbf6ee] p-4 sm:p-7 lg:w-[520px] lg:shrink-0">
            <div className="mb-4 flex items-start justify-between gap-3 px-1">
              <div>
                <p className="eyebrow text-[#94713f]">Heute in TyloHQ</p>
                <p className="mt-1.5 font-display text-[20px] font-medium leading-[26px] tracking-[-0.4px] text-[#1a1917]">Eingehende Anfragen</p>
              </div>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.06)]">
                <span className="size-2 rounded-full bg-[#1e7a52] motion-safe:animate-pulse" aria-hidden />
                Live
              </span>
            </div>
            <LiveFeed />
          </div>

          <div className="lpn-text flex min-w-0 flex-1 flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <Pill icon={Award}>Case 02 · SHK-Betrieb · Nouh-Wehres</Pill>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lp/handwerk/nouh-wehres.svg" alt="Nouh-Wehres" width={187} height={36} className="h-[34px] w-auto" />
            </div>
            <h2 className="t-h2 text-[#0e5836]">
              4 bis 5 Badsanierungs-Anfragen. <span className="t-serif text-[#94713f]">Pro Tag.</span>
            </h2>
            <Lists
              before={["Badsanierungen kamen unregelmäßig, oft über Umwege", "Kein eigener Kanal für neue Kundenanfragen", "Team teilweise unterausgelastet, Umsatz schwankend"]}
              after={[
                "4 bis 5 Badsanierungs-Anfragen pro Tag, direkt in der eigenen App",
                "Jede Anfrage mit Status und Zuständigkeit, nichts geht verloren",
                "Jede Anfrage kommt über unser System und TyloHQ in die App",
              ]}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
