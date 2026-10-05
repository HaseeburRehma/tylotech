"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, Phone } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/contact";
import type { Block, LegalDoc } from "@/lib/legal";
import { Eyebrow } from "../branche/ui";

/* [label](href) → link; internal paths use next/link */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <Fragment key={i}>{p}</Fragment>;
        const [, label, href] = m;
        const cls = "break-words font-medium text-[#94713f] underline decoration-[#d1aa71]/50 underline-offset-[3px] transition-colors hover:text-[#6d5330] hover:decoration-[#94713f]";
        if (href.startsWith("/"))
          return (
            <Link key={i} href={href} className={cls}>
              {label}
            </Link>
          );
        const external = href.startsWith("http");
        return (
          <a key={i} href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        );
      })}
    </>
  );
}

function BlockView({ b }: { b: Block }) {
  if ("h" in b) return <h3 className="pt-2 font-display text-[17px] font-semibold leading-6 tracking-[-0.02em] text-[#1a1917] sm:text-[18px]">{b.h}</h3>;
  if ("lines" in b)
    return (
      <p className="border-l-2 border-[#d1aa71] pl-4 text-[15.5px] leading-[26px] text-[#1a1917]">
        {b.lines.map((l, i) => (
          <Fragment key={i}>
            <Rich text={l} />
            {i < b.lines.length - 1 && <br />}
          </Fragment>
        ))}
      </p>
    );
  if ("ul" in b)
    return (
      <ul className="flex flex-col gap-2.5">
        {b.ul.map((li, i) => (
          <li key={i} className="flex gap-3 text-[15.5px] leading-[26px] text-[#5c5954]">
            <span className="mt-[11px] size-[5px] shrink-0 rounded-full bg-[#d1aa71]" />
            <span className="min-w-0">
              <Rich text={li} />
            </span>
          </li>
        ))}
      </ul>
    );
  return (
    <p className="text-[15.5px] leading-[26px] tracking-[-0.1px] text-[#5c5954]">
      <Rich text={b.p} />
    </p>
  );
}

function Toc({ sections, active, onPick }: { sections: LegalDoc["sections"]; active?: string; onPick?: () => void }) {
  return (
    <ol className="flex flex-col gap-0.5">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={onPick}
            className={cn(
              "group flex items-start gap-3 rounded-[10px] px-3 py-2 text-[14px] leading-5 transition-colors duration-200",
              active === s.id ? "bg-[#fbf6ee] text-[#1a1917]" : "text-[#7d7973] hover:bg-white hover:text-[#1a1917]",
            )}
          >
            <span className={cn("mt-px font-mono text-[11px] tabular-nums transition-colors", active === s.id ? "text-[#b4894d]" : "text-[#b7b3ad]")}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function LegalPage({ doc, icon }: { doc: LegalDoc; icon: "file-text" | "shield-check" }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(doc.sections[0]?.id);

  // scrollspy: the section crossing the upper third of the viewport is active
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [doc.sections]);

  useGSAP(
    () => {
      gsap.from(".lg-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 });
      gsap.from(".lg-card", { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.from(".lg-toc", { x: -16, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.35 });
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative overflow-hidden bg-page">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[30%] h-[640px] w-[1100px] rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.18),rgba(209,170,113,0.04)_60%,transparent)]"
      />
      <Container className="relative pb-14 pt-8 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-16 xl:pt-[88px]">
        <header className="lg-head flex max-w-[760px] flex-col items-start gap-5 sm:gap-6">
          <Eyebrow icon={icon}>{doc.eyebrow}</Eyebrow>
          <h1 className="font-display text-[clamp(2.3rem,4.6vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-[#1a1917]">
            {doc.title}
            {doc.accent && (
              <span className="font-[family-name:var(--font-instrument)] text-[1.06em] font-normal italic tracking-[-0.02em] text-[#94713f]">{doc.accent}</span>
            )}
          </h1>
          <p className="text-[clamp(16px,1.4vw,18px)] leading-[1.6] tracking-[-0.01em] text-[#5c5954]">{doc.intro}</p>
          {doc.stand && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#eeedea] bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.4px] text-[#7d7973]">
              <span className="size-1.5 rounded-full bg-[#d1aa71]" />
              Stand: {doc.stand}
            </span>
          )}
        </header>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          {/* table of contents */}
          <aside className="lg-toc lg:sticky lg:top-28 lg:self-start">
            <details className="group rounded-[18px] border border-[#eeedea] bg-white/80 p-2 backdrop-blur lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#5c5954] [&::-webkit-details-marker]:hidden">
                Inhalt
                <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" strokeWidth={1.8} />
              </summary>
              <div className="pb-1 pt-1">
                <Toc sections={doc.sections} active={active} onPick={() => document.querySelector<HTMLDetailsElement>(".lg-toc details")?.removeAttribute("open")} />
              </div>
            </details>
            <nav aria-label="Inhalt" className="hidden lg:block">
              <p className="mb-3 px-3 font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#7d7973]">Inhalt</p>
              <Toc sections={doc.sections} active={active} />
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col gap-6">
            <article className="lg-card rounded-[24px] border border-[#eeedea] bg-white px-5 py-8 shadow-[0_7px_20px_rgba(8,34,44,0.05),0_23px_36px_rgba(8,34,44,0.04)] sm:rounded-[28px] sm:px-10 sm:py-12 lg:px-14">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} className={cn("scroll-mt-28", i > 0 && "mt-10 border-t border-[#eeedea] pt-10")}>
                  <h2 className="mb-5 flex items-baseline gap-3 font-display text-[clamp(1.3rem,2vw,1.5rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-[#1a1917]">
                    <span className="font-mono text-[12px] font-medium tracking-[0.4px] text-[#b4894d]">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {s.blocks.map((b, j) => (
                      <BlockView key={j} b={b} />
                    ))}
                  </div>
                </section>
              ))}
            </article>

            <div className="flex flex-col gap-4 rounded-[24px] border border-[#ecd8b6] bg-[#fbf6ee] p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex-1">
                <p className="font-display text-[18px] font-semibold tracking-[-0.02em] text-[#1a1917]">Fragen dazu?</p>
                <p className="mt-1 text-[14.5px] leading-[22px] text-[#5c5954]">Schreib uns oder ruf an, wir antworten persönlich.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#002e3d] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#013a4d]"
                >
                  <Mail className="size-4" strokeWidth={1.8} />
                  {CONTACT.email}
                </a>
                <a
                  href={CONTACT.phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(8,34,44,0.08)] bg-white px-5 text-[14px] font-medium text-[#1a1917] transition-colors hover:bg-[#fbfaf9]"
                >
                  <Phone className="size-4" strokeWidth={1.8} />
                  {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
