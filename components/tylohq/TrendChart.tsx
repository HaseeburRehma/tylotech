"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type ChartSeries = {
  key: string;
  label: string;
  color: string;
  values: number[];
  /** fill the area under this line with a soft gradient */
  area?: boolean;
  /** own y-scale max (series are normalised independently, like the TyloHQ dashboard) */
  max?: number;
  format?: (v: number) => string;
  hidden?: boolean;
};

/** Catmull-Rom → cubic Bézier, the same soft curve the Figma dashboard uses. */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export default function TrendChart({
  series,
  labels,
  height = 246,
  yTicks,
  showEndMarker = true,
  className,
  padX = 23,
  labelEvery = 1,
}: {
  series: ChartSeries[];
  labels: string[];
  height?: number;
  /** optional y-axis tick labels (top → bottom), drawn left of the grid */
  yTicks?: string[];
  showEndMarker?: boolean;
  className?: string;
  padX?: number;
  labelEvery?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    setW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  // geometry mirrors the Figma "Verlauf" frame (246 px tall)
  const left = yTicks ? padX + 26 : padX;
  const right = padX;
  const top = 28;
  const base = height - 46;
  const n = labels.length;
  const innerW = Math.max(0, w - left - right);
  const x = (i: number) => left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const gridYs = [0, 1, 2, 3, 4].map((k) => top + ((base - top) / 4) * k);

  const visible = series.filter((s) => !s.hidden);
  const geo = visible.map((s) => {
    const max = s.max ?? Math.max(...s.values) * 1.08;
    const pts = s.values.map((v, i) => [x(i), base - (v / max) * (base - top)] as [number, number]);
    const line = smoothPath(pts);
    const area = `${line} L${pts[pts.length - 1][0]},${base} L${pts[0][0]},${base} Z`;
    return { s, pts, line, area };
  });

  const onMove = (e: React.PointerEvent) => {
    if (!wrap.current || n === 0) return;
    const r = wrap.current.getBoundingClientRect();
    const px = e.clientX - r.left;
    const i = Math.round(((px - left) / innerW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  // tooltip flips to the left of the cursor in the right half
  const tipLeft = hover !== null ? x(hover) : 0;
  const flip = hover !== null && tipLeft > w * 0.6;
  // key forces the draw-on animation to replay whenever the data changes
  const dataKey = visible.map((s) => s.key + s.values.join(",")).join("|");

  return (
    <div
      ref={wrap}
      className={cn("relative w-full select-none", className)}
      style={{ height }}
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      {w > 0 && (
        <svg width={w} height={height} className="absolute inset-0 overflow-visible" aria-hidden>
          <defs>
            {geo.map(({ s }) => (
              <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {gridYs.map((gy, k) => (
            <line
              key={k}
              x1={left}
              x2={w - right}
              y1={gy}
              y2={gy}
              stroke={k === 4 ? "#e2e0dc" : "#eeedea"}
              strokeDasharray={k === 4 ? undefined : "3 4"}
            />
          ))}
          {yTicks?.map((t, k) => (
            <text
              key={t + k}
              x={left - 8}
              y={gridYs[k] + 3}
              textAnchor="end"
              className="fill-[#7d7973] font-mono text-[8.6px]"
            >
              {t}
            </text>
          ))}

          <g key={dataKey}>
            {geo.map(({ s, area }) =>
              s.area ? (
                <path
                  key={`a-${s.key}`}
                  d={area}
                  fill={`url(#${uid}-${s.key})`}
                  className="hq-area animate-[hqfade_.9s_ease_both]"
                />
              ) : null,
            )}
            {geo.map(({ s, line }) => (
              <path
                key={`l-${s.key}`}
                d={line}
                fill="none"
                stroke={s.color}
                strokeWidth={1.7}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                className="hq-draw"
              />
            ))}
          </g>

          {showEndMarker && geo[0] && hover === null && (
            <g>
              <circle cx={geo[0].pts.at(-1)![0]} cy={geo[0].pts.at(-1)![1]} r={7.4} fill={geo[0].s.color} opacity={0.18}>
                <animate attributeName="r" values="5;9;5" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={geo[0].pts.at(-1)![0]}
                cy={geo[0].pts.at(-1)![1]}
                r={3.7}
                fill={geo[0].s.color}
                stroke="#fff"
                strokeWidth={1.6}
              />
            </g>
          )}

          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={top - 6} y2={base} stroke="#cbc8c2" strokeDasharray="2 3" />
              {geo.map(({ s, pts }) => (
                <circle
                  key={s.key}
                  cx={pts[hover][0]}
                  cy={pts[hover][1]}
                  r={4}
                  fill="#fff"
                  stroke={s.color}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}

          {labels.map((l, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text
                key={i}
                x={x(i)}
                y={base + 22}
                textAnchor="middle"
                className={cn(
                  "font-mono text-[8.6px] transition-colors",
                  hover === i ? "fill-[#1a1917]" : "fill-[#7d7973]",
                )}
              >
                {l}
              </text>
            ) : null,
          )}
        </svg>
      )}

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-20 min-w-[124px] rounded-[10px] border border-[#eeedea] bg-white/95 px-3 py-2 shadow-[0_12px_30px_-12px_rgba(8,34,44,0.35)] backdrop-blur"
          style={{
            left: tipLeft,
            top: Math.max(0, Math.min(...geo.map((g) => g.pts[hover][1])) - 70),
            transform: flip ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
          }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.5px] text-[#7d7973]">{labels[hover]}</p>
          {geo.map(({ s }) => (
            <p key={s.key} className="mt-1 flex items-center gap-1.5 text-[11px] text-[#5c5954]">
              <span className="size-1.5 rounded-full" style={{ background: s.color }} />
              {s.label}
              <span className="ml-auto pl-3 font-semibold tabular-nums text-[#1a1917]">
                {s.format ? s.format(s.values[hover]) : s.values[hover]}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
