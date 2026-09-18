/**
 * Figma "Mosaic Backdrop" — subtle pixel mosaic of small squares on the dark
 * navy (#001620), faint teal with occasional gold, faded toward the edges.
 * Deterministic (seeded) so SSR and client match.
 */
const COLS = 60;
const ROWS = 40;
const CELL = 24;

function build() {
  let seed = 987654321;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const cells: { x: number; y: number; o: number; gold: boolean; tw: boolean }[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const r = rnd();
      if (r > 0.8) {
        const gold = r > 0.978;
        const o = Math.round((0.05 + (r - 0.8) * (gold ? 0.9 : 0.55)) * 1000) / 1000;
        cells.push({ x: x * CELL, y: y * CELL, o, gold, tw: rnd() > 0.85 });
      }
    }
  }
  return cells;
}

const CELLS = build();

export default function MosaicBackdrop({
  className = "",
  fade = "radial-gradient(120% 100% at 50% 25%, #000 30%, transparent 78%)",
}: {
  className?: string;
  fade?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      <svg
        className="absolute left-1/2 top-0 h-full min-h-full w-[1440px] -translate-x-1/2"
        viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {CELLS.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={CELL - 2}
            height={CELL - 2}
            rx={2}
            fill={c.gold ? "#d1aa71" : "#7fbacd"}
            opacity={c.o}
            className={c.tw ? "mosaic-tw" : undefined}
            style={
              c.tw
                ? ({
                    animationDelay: `${(i % 20) * 0.35}s`,
                    ["--tw-o" as string]: c.o,
                  } as React.CSSProperties)
                : undefined
            }
          />
        ))}
      </svg>
    </div>
  );
}
