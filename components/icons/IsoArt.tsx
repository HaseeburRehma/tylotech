/**
 * Lightweight isometric placeholder art for the Leistungen cards.
 * Brand-palette cuboids — a stand-in until the real Figma 3D renders
 * are dropped into /public/illustrations and swapped in via <ServiceArt>.
 */

const COS = 0.866;
const SIN = 0.5;

function project(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}

type Palette = { top: string; left: string; right: string };

const NAVY: Palette = { top: "#2c5468", left: "#1d3b4c", right: "#132833" };
const TAN: Palette = { top: "#e7c893", left: "#d1aa71", right: "#b48a55" };
const CREAM: Palette = { top: "#f4efe7", left: "#e4dacb", right: "#cec1ac" };

function Cuboid({
  ox,
  oy,
  x,
  y,
  w,
  d,
  h,
  pal,
}: {
  ox: number;
  oy: number;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  pal: Palette;
}) {
  const p = (X: number, Y: number, Z: number) => {
    const [px, py] = project(x + X, y + Y, z0 + Z);
    return `${(ox + px).toFixed(1)},${(oy + py).toFixed(1)}`;
  };
  const z0 = 0;
  const top = `${p(0, 0, h)} ${p(w, 0, h)} ${p(w, d, h)} ${p(0, d, h)}`;
  const right = `${p(w, 0, h)} ${p(w, d, h)} ${p(w, d, 0)} ${p(w, 0, 0)}`;
  const front = `${p(0, d, h)} ${p(w, d, h)} ${p(w, d, 0)} ${p(0, d, 0)}`;
  return (
    <g>
      <polygon points={front} fill={pal.left} />
      <polygon points={right} fill={pal.right} />
      <polygon points={top} fill={pal.top} />
    </g>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 150" className="h-[120px] w-full">
      <g transform="translate(100 78)">{children}</g>
    </svg>
  );
}

const ART: Record<string, React.ReactNode> = {
  // 1 · Digitale Lösungen — screen slab
  digital: (
    <Frame>
      <Cuboid ox={0} oy={0} x={0} y={0} w={34} h={4} d={34} pal={CREAM} />
      <Cuboid ox={0} oy={-26} x={4} y={4} w={26} h={2} d={26} pal={NAVY} />
      <g transform="translate(-20 -40)">
        <rect width="40" height="2.5" rx="1.2" fill="#d1aa71" />
        <rect y="6" width="26" height="2.5" rx="1.2" fill="#e4dacb" />
        <rect y="12" width="32" height="2.5" rx="1.2" fill="#e4dacb" />
      </g>
    </Frame>
  ),
  // 2 · Marketing & Performance — rising bars
  marketing: (
    <Frame>
      <Cuboid ox={0} oy={0} x={-30} y={0} w={14} d={14} h={16} pal={NAVY} />
      <Cuboid ox={0} oy={0} x={-8} y={0} w={14} d={14} h={30} pal={TAN} />
      <Cuboid ox={0} oy={0} x={14} y={0} w={14} d={14} h={46} pal={CREAM} />
    </Frame>
  ),
  // 3 · Unternehmensaufbau — stairs
  aufbau: (
    <Frame>
      <Cuboid ox={0} oy={0} x={-24} y={-24} w={20} d={20} h={10} pal={NAVY} />
      <Cuboid ox={0} oy={0} x={-6} y={-6} w={20} d={20} h={22} pal={CREAM} />
      <Cuboid ox={0} oy={0} x={12} y={12} w={20} d={20} h={34} pal={TAN} />
    </Frame>
  ),
  // 4 · Neue Technologien — chip
  tech: (
    <Frame>
      <Cuboid ox={0} oy={0} x={-18} y={-18} w={36} d={36} h={7} pal={NAVY} />
      <g transform="translate(0 -13)">
        <Cuboid ox={0} oy={0} x={-10} y={-10} w={20} d={20} h={5} pal={TAN} />
      </g>
    </Frame>
  ),
  // 5 · Cloud & Infrastruktur — server stack
  cloud: (
    <Frame>
      <Cuboid ox={0} oy={0} x={-20} y={-20} w={40} d={40} h={9} pal={NAVY} />
      <g transform="translate(0 -18)">
        <Cuboid ox={0} oy={0} x={-20} y={-20} w={40} d={40} h={9} pal={CREAM} />
      </g>
      <g transform="translate(0 -36)">
        <Cuboid ox={0} oy={0} x={-20} y={-20} w={40} d={40} h={9} pal={TAN} />
      </g>
    </Frame>
  ),
  // 6 · Enterprise Services — layered plates
  enterprise: (
    <Frame>
      <Cuboid ox={0} oy={0} x={-24} y={-24} w={48} d={48} h={5} pal={NAVY} />
      <g transform="translate(0 -14)">
        <Cuboid ox={0} oy={0} x={-24} y={-24} w={48} d={48} h={5} pal={TAN} />
      </g>
      <g transform="translate(0 -28)">
        <Cuboid ox={0} oy={0} x={-24} y={-24} w={48} d={48} h={5} pal={CREAM} />
      </g>
    </Frame>
  ),
};

export default function IsoArt({ variant }: { variant: string }) {
  return <>{ART[variant] ?? null}</>;
}
