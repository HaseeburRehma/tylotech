"use client";

import { useEffect, useRef } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/* Rotating dot sphere (canvas) — single-hue, depth-shaded like finseo */
/* ------------------------------------------------------------------ */
function GlobeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const N = 1300;
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

    const baseTilt = -0.38;
    let angle = 0;
    let raf = 0;

    const host = (canvas.parentElement ?? canvas) as HTMLElement;

    // pointer parallax (hover) + drag-to-rotate with momentum
    let targetMX = 0;
    let targetMY = 0;
    let mx = 0;
    let my = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    let dragRotY = 0; // added Y-rotation from drag
    let dragRotX = 0; // added tilt from drag
    const clampTilt = (v: number) => Math.max(-0.85, Math.min(0.85, v));

    const onMove = (e: PointerEvent) => {
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
      const rect = canvas.getBoundingClientRect();
      targetMX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      targetMY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
    };
    const onLeave = () => {
      targetMX = 0;
      targetMY = 0;
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
      const R = Math.min(w * 0.34, h * 0.46);

      // momentum after release
      if (!dragging) {
        dragRotY += velX;
        dragRotX = clampTilt(dragRotX + velY);
        velX *= 0.94;
        velY *= 0.94;
      }
      mx += (targetMX - mx) * 0.06;
      my += (targetMY - my) * 0.06;
      const rotY = angle + dragRotY + mx * 0.5;
      const cosA = Math.cos(rotY);
      const sinA = Math.sin(rotY);
      const tilt = clampTilt(baseTilt + dragRotX + my * 0.25);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (const p of pts) {
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;

        const d = Math.pow((z2 + 1) / 2, 1.3); // 0 back → 1 front
        const sx = cx + x1 * R;
        const sy = cy + y2 * R;
        const size = (0.5 + d * 1.8) * dpr;
        const alpha = 0.1 + d * 0.88;

        // dim gold in back → bright cream in front (accent dots a touch warmer)
        const rr = Math.round((p.accent ? 90 : 70) + (242 - (p.accent ? 90 : 70)) * d);
        const gg = Math.round((p.accent ? 74 : 62) + ((p.accent ? 208 : 224) - (p.accent ? 74 : 62)) * d);
        const bb = Math.round((p.accent ? 44 : 46) + ((p.accent ? 150 : 188) - (p.accent ? 44 : 46)) * d);

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
        ctx.fill();
      }

      if (!reduce) {
        angle += 0.0015;
        raf = requestAnimationFrame(draw);
      }
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
/* Labels + connector geometry (viewBox 1200 x 560, sphere at 600,280) */
/* ------------------------------------------------------------------ */
type Lbl = {
  t: string;
  side: "left" | "right";
  lx: number; // line start (label end)
  ly: number;
  nx: number; // node (sphere edge)
  ny: number;
};

const LABELS: Lbl[] = [
  { t: "Vertrieb", side: "left", lx: 232, ly: 92, nx: 372, ny: 166 },
  { t: "Marketing", side: "left", lx: 205, ly: 280, nx: 350, ny: 280 },
  { t: "Recruiting", side: "left", lx: 232, ly: 468, nx: 372, ny: 394 },
  { t: "Kundenerlebnis", side: "right", lx: 968, ly: 92, nx: 828, ny: 166 },
  { t: "Reputation", side: "right", lx: 995, ly: 280, nx: 850, ny: 280 },
  { t: "Prozesse", side: "right", lx: 968, ly: 468, nx: 828, ny: 394 },
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
      // draw the faint connector lines in
      gsap.fromTo(
        ".glb-base",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.09,
          scrollTrigger: { trigger: root.current, start: "top 68%" },
        },
      );
      gsap.from(".glb-node", {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
        duration: 0.5,
        ease: "back.out(2)",
        stagger: 0.09,
        delay: 0.5,
        scrollTrigger: { trigger: root.current, start: "top 68%" },
      });
      // gold pulse travelling along each line toward the sphere, looping
      gsap.fromTo(
        ".glb-pulse",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: -1,
          duration: 2.4,
          ease: "none",
          repeat: -1,
          stagger: 0.4,
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
        <div className="relative mx-auto w-full max-w-[1120px]">
          {/* aspect box that holds sphere + lines (desktop wide, mobile taller) */}
          <div className="relative mx-auto aspect-square max-w-[420px] lg:aspect-[1200/560] lg:max-w-none">
            <GlobeCanvas />

            {/* legibility vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(0,22,32,0.74) 32%, transparent 72%)",
              }}
            />

            {/* connector lines + nodes (desktop only) */}
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              className="absolute inset-0 hidden size-full lg:block"
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
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={1}
                      pathLength={1}
                      strokeDasharray="1 1"
                    />
                    <path
                      className="glb-pulse"
                      d={d}
                      stroke="#d1aa71"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="0.16 0.84"
                    />
                    {/* square node at the sphere edge */}
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
                  </g>
                );
              })}
            </svg>

            {/* center copy */}
            <div className="glb-copy absolute inset-0 z-10 grid place-items-center px-6 text-center">
              <div>
                <p className="eyebrow mb-4 flex items-center justify-center gap-2.5 text-[#d8b682]">
                  <span className="size-[7px] rounded-[2px] bg-accent" />
                  Reichweite
                </p>
                <h2 className="display-m text-white">Digitalisierung berührt alles.</h2>
                <p className="mx-auto mt-4 max-w-[380px] text-[16px] leading-[26px] text-[#b3d6e2]">
                  Nicht nur das Marketing — jeder Bereich Ihres Unternehmens hängt
                  daran.
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
