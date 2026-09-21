"use client";

import { useEffect, useRef } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/* Rotating dot sphere (canvas) — draggable, hover-parts, scroll-fills  */
/* ------------------------------------------------------------------ */
function GlobeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const N = 1500;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, accent: (i * 5) % 8 === 0 };
    });

    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const baseTilt = -0.32;
    let angle = 0;
    let raf = 0;
    let prog = 0; // eased scroll-fill progress (0 grey/empty → 1 gold/full)

    const host = (canvas.parentElement ?? canvas) as HTMLElement;

    // pointer parallax + gentle repulsion + drag-to-rotate
    let targetMX = 0;
    let targetMY = 0;
    let mx = 0;
    let my = 0;
    let pcx = -9999;
    let pcy = -9999;
    let pointerInside = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    let dragRotY = 0;
    let dragRotX = 0;
    const clampTilt = (v: number) => Math.max(-0.85, Math.min(0.85, v));

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pcx = (e.clientX - rect.left) * dpr;
      pcy = (e.clientY - rect.top) * dpr;
      pointerInside = true;
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        dragRotY += dx * 0.006;
        dragRotX = clampTilt(dragRotX + dy * 0.006);
        velX = dx * 0.006;
        velY = dy * 0.006;
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      targetMX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      targetMY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
    };
    const onLeave = () => {
      targetMX = 0;
      targetMY = 0;
      pointerInside = false;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = 0;
      velY = 0;
      host.style.cursor = "grabbing";
      try {
        host.setPointerCapture(e.pointerId);
      } catch {
        /* capture unsupported — drag still works via move/up */
      }
    };
    const onUp = () => {
      dragging = false;
      host.style.cursor = "grab";
    };
    host.style.cursor = "grab";
    host.style.touchAction = "pan-y";
    host.style.userSelect = "none";
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w * 0.32, h * 0.5);
      const RAD = R * 0.42;

      // scroll-fill: 0 when the sphere is entering from the bottom, 1 when it
      // sits in view. Fills on scroll-down, empties on scroll-up.
      const rect = canvas.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const target = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.8)));
      prog += (target - prog) * 0.12;

      if (!dragging) {
        dragRotY += velX;
        dragRotX = clampTilt(dragRotX + velY);
        velX *= 0.94;
        velY *= 0.94;
      }
      mx += (targetMX - mx) * 0.06;
      my += (targetMY - my) * 0.06;
      const rotY = angle + dragRotY + mx * 0.35;
      const cosA = Math.cos(rotY);
      const sinA = Math.sin(rotY);
      const tilt = clampTilt(baseTilt + dragRotX + my * 0.18);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const repel = pointerInside && !dragging;

      for (const p of pts) {
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;

        const d = Math.pow((z2 + 1) / 2, 1.3); // 0 back → 1 front
        let sx = cx + x1 * R;
        let sy = cy + y2 * R;
        const size = (0.5 + d * 1.8) * dpr;
        // brightness ramps with scroll-fill
        let alpha = (0.06 + d * 0.9) * (0.22 + 0.78 * prog);

        // keep the centre clear so dots never sit behind the headline
        const ex = (sx - cx) / (R * 0.6);
        const ey = (sy - cy) / (R * 0.32);
        const ed = Math.sqrt(ex * ex + ey * ey);
        alpha *= Math.min(1, Math.max(0, (ed - 0.7) / 0.45));

        // cursor gently parts the dots — a soft fade + slight drift
        if (repel) {
          const ddx = sx - pcx;
          const ddy = sy - pcy;
          const dist = Math.hypot(ddx, ddy);
          if (dist < RAD) {
            const f = 1 - dist / RAD;
            const push = f * f * RAD * 0.14;
            const inv = 1 / (dist || 1);
            sx += ddx * inv * push;
            sy += ddy * inv * push;
            alpha *= 1 - f * 0.6;
          }
        }

        if (alpha <= 0.012) continue;
        // colour interpolates cool grey (empty) → warm gold (filled) with scroll
        const goldR = 70 + 172 * d;
        const goldG = 62 + 162 * d;
        const goldB = 46 + 142 * d;
        const greyR = 96 + 70 * d;
        const greyG = 108 + 74 * d;
        const greyB = 120 + 66 * d;
        const rr = Math.round(greyR + (goldR - greyR) * prog);
        const gg = Math.round(greyG + (goldG - greyG) * prog);
        const bb = Math.round(greyB + (goldB - greyB) * prog);
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
        ctx.fill();
      }

      if (!reduce) angle += 0.0014;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />;
}

/* ------------------------------------------------------------------ */
type Lbl = {
  t: string;
  side: "left" | "right";
  lx: number;
  ly: number;
  nx: number;
  ny: number;
};

const LABELS: Lbl[] = [
  { t: "Vertrieb", side: "left", lx: 210, ly: 96, nx: 356, ny: 168 },
  { t: "Marketing", side: "left", lx: 180, ly: 280, nx: 322, ny: 280 },
  { t: "Recruiting", side: "left", lx: 210, ly: 464, nx: 356, ny: 392 },
  { t: "Kundenerlebnis", side: "right", lx: 990, ly: 96, nx: 844, ny: 168 },
  { t: "Reputation", side: "right", lx: 1020, ly: 280, nx: 878, ny: 280 },
  { t: "Prozesse", side: "right", lx: 990, ly: 464, nx: 844, ny: 392 },
];

const VW = 1200;
const VH = 560;

/* ------------------------------------------------------------------ */
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
        y: 12,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 68%" },
      });

      // Everything below is SCRUBBED to scroll: the gold line fills from the
      // label to the node on scroll-down and empties on scroll-up, the node
      // fills gold as the line reaches it. Matches the dot colour-fill.
      const st = () => ({
        trigger: root.current,
        start: "top 85%",
        end: "top 22%",
        scrub: 0.5,
      });
      gsap.from(".glb-base", {
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: "top 88%" },
      });
      gsap.fromTo(
        ".glb-hi",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: "none", stagger: 0.05, scrollTrigger: st() },
      );
      gsap.fromTo(
        ".glb-node-fill",
        { opacity: 0, scale: 0.2, transformOrigin: "center" },
        { opacity: 1, scale: 1, ease: "none", stagger: 0.05, scrollTrigger: st() },
      );
      gsap.from(".glb-node", {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
        duration: 0.5,
        ease: "back.out(2)",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
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
        <div className="relative mx-auto w-full max-w-[1280px]">
          <div className="relative mx-auto aspect-square max-w-[440px] lg:aspect-[1200/560] lg:max-w-none">
            <GlobeCanvas />

            {/* connector lines + nodes (desktop only) */}
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 hidden size-full lg:block"
              fill="none"
              aria-hidden
            >
              {LABELS.map((l) => {
                const d = `M${l.lx} ${l.ly} L${l.nx} ${l.ny}`;
                return (
                  <g key={l.t}>
                    <path
                      className="glb-base"
                      d={d}
                      stroke="rgba(255,255,255,0.16)"
                      strokeWidth={1}
                    />
                    <path
                      className="glb-hi"
                      d={d}
                      stroke="#d1aa71"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="1 1"
                      strokeDashoffset={1}
                    />
                    <rect
                      className="glb-node"
                      x={l.nx - 5}
                      y={l.ny - 5}
                      width={10}
                      height={10}
                      rx={1.5}
                      fill="#001620"
                      stroke="#d1aa71"
                      strokeWidth={1.4}
                    />
                    <rect
                      className="glb-node-fill"
                      x={l.nx - 2.5}
                      y={l.ny - 2.5}
                      width={5}
                      height={5}
                      rx={1}
                      fill="#d1aa71"
                      opacity={0}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* center copy */}
            <div className="glb-copy pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center">
              <div>
                <p className="eyebrow mb-3 flex items-center justify-center gap-2.5 text-[#d8b682]">
                  <span className="size-[7px] rounded-[2px] bg-accent" />
                  Reichweite
                </p>
                <h2 className="font-display text-[clamp(1.7rem,2.3vw,2.125rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
                  Digitalisierung berührt alles.
                </h2>
                <p className="mx-auto mt-3 max-w-[330px] text-[14px] leading-[22px] text-[#b3d6e2]">
                  Nicht nur das Marketing — jeder Bereich Ihres Unternehmens.
                </p>
              </div>
            </div>

            {/* HTML labels aligned to the SVG line starts (desktop only) */}
            {LABELS.map((l) => {
              const leftPct = (l.lx / VW) * 100;
              const topPct = (l.ly / VH) * 100;
              return (
                <span
                  key={l.t}
                  className="glb-label absolute z-10 hidden whitespace-nowrap rounded-[8px] border border-white/15 bg-[#03202c]/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm lg:inline-block"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform:
                      l.side === "left"
                        ? "translate(calc(-100% - 10px), -50%)"
                        : "translate(10px, -50%)",
                  }}
                >
                  {l.t}
                </span>
              );
            })}
          </div>

          {/* labels as pills below (mobile / tablet) */}
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
        </div>
      </Container>
    </section>
  );
}
