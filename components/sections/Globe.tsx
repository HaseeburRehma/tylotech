"use client";

import { useEffect, useRef } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

/* ---- rotating dot sphere (canvas) -------------------------------- */
function GlobeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fibonacci sphere — evenly distributed points.
    const N = 1150;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, gold: (i * 7) % 11 === 0 };
    });

    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tilt = -0.42;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    let angle = 0;
    let raf = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.46;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      for (const p of pts) {
        // rotate around Y, then tilt around X
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;

        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        const sx = cx + x1 * R;
        const sy = cy + y2 * R;
        const size = (0.5 + depth * 1.7) * dpr;
        const alpha = 0.12 + depth * depth * 0.85;

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(209,170,113,${alpha})`
          : `rgba(127,186,205,${alpha * 0.55})`;
        ctx.fill();
      }

      if (!reduce) {
        angle += 0.0016;
        raf = requestAnimationFrame(draw);
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />;
}

/* ---- labels ------------------------------------------------------- */
const LABELS = [
  { t: "Vertrieb", side: "left", top: "22%" },
  { t: "Marketing", side: "left", top: "50%" },
  { t: "Recruiting", side: "left", top: "78%" },
  { t: "Kundenerlebnis", side: "right", top: "22%" },
  { t: "Reputation", side: "right", top: "50%" },
  { t: "Prozesse", side: "right", top: "78%" },
] as const;

function Connector({ side }: { side: "left" | "right" }) {
  // a short line ending in a small square node near the sphere edge
  const line = <span className="glb-line h-px w-[clamp(28px,5vw,64px)] origin-left bg-white/25" />;
  const node = (
    <span className="size-[9px] shrink-0 rotate-45 border border-accent/70 bg-[#001620]" />
  );
  return side === "left" ? (
    <span className="flex items-center gap-2">
      {line}
      {node}
    </span>
  ) : (
    <span className="flex items-center gap-2">
      {node}
      <span className="glb-line h-px w-[clamp(28px,5vw,64px)] origin-right bg-white/25" />
    </span>
  );
}

/* ---- section ------------------------------------------------------ */
export default function Globe() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".glb-copy > *", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".glb-label", {
        opacity: 0,
        x: (i) => (i < 3 ? -20 : 20),
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.fromTo(
        ".glb-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      id="reichweite"
      ref={root}
      className="relative overflow-hidden bg-[#001620] py-24 text-white"
    >
      <Container className="relative">
        <div className="relative mx-auto flex min-h-[560px] max-w-[1080px] items-center justify-center lg:min-h-[640px]">
          {/* Sphere */}
          <div className="relative aspect-square w-full max-w-[520px]">
            <GlobeCanvas />
            {/* legibility vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(0,22,32,0.72) 30%, transparent 72%)",
              }}
            />
            <div className="glb-copy absolute inset-0 grid place-items-center px-6 text-center">
              <div>
                <p className="eyebrow mb-4 flex items-center justify-center gap-2.5 text-[#d8b682]">
                  <span className="size-[7px] rounded-[2px] bg-accent" />
                  Reichweite
                </p>
                <h2 className="display-m text-white">Digitalisierung berührt alles.</h2>
                <p className="mx-auto mt-4 max-w-[360px] text-[16px] leading-[26px] text-[#b3d6e2]">
                  Nicht nur das Marketing — jeder Bereich Ihres Unternehmens hängt
                  daran.
                </p>
              </div>
            </div>
          </div>

          {/* Side labels (desktop) */}
          {LABELS.map((l) => (
            <div
              key={l.t}
              className={`glb-label absolute hidden -translate-y-1/2 items-center gap-2 lg:flex ${
                l.side === "left" ? "left-0 flex-row" : "right-0 flex-row-reverse"
              }`}
              style={{ top: l.top }}
            >
              <span className="rounded-[8px] border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm">
                {l.t}
              </span>
              <Connector side={l.side} />
            </div>
          ))}
        </div>

        {/* Labels (mobile / tablet) */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5 lg:hidden">
          {LABELS.map((l) => (
            <span
              key={l.t}
              className="glb-label rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/85"
            >
              {l.t}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
