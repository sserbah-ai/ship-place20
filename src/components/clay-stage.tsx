import { STAGES, type StageId } from "@/lib/stages";

const ISLET_CELLS: Array<[number, number, number]> = [
  [53, 50, 1], [46, 53, 0], [51, 44, 0], [55, 56, 0], [41, 48, 0], [59, 45, 0],
  [47, 60, 0], [44, 40, 0], [62, 54, 0], [37, 55, 0], [56, 38, 0], [55, 63, 1],
  [36, 43, 0], [66, 47, 0], [40, 63, 0], [48, 34, 0], [64, 61, 0], [31, 51, 0],
  [64, 38, 0], [49, 68, 1], [37, 36, 1], [70, 53, 1], [33, 61, 1], [55, 31, 1],
  [61, 68, 1], [29, 44, 1], [71, 41, 1], [41, 70, 1], [42, 29, 1], [71, 60, 1],
  [26, 56, 1], [64, 31, 1], [54, 73, 1], [30, 35, 1],
];

const GLUCOSE_RING: Array<[number, number]> = [
  [80, 48], [65, 67], [35, 67], [20, 48], [35, 29], [65, 29],
];

type Props = {
  stage: StageId;
  selected: string;
  label: string;
};

export function ClayStage({ stage, selected, label }: Props) {
  const spot = STAGES.find((item) => item.id === stage)?.spots.find((item) => item.id === selected);
  const cx = spot ? Math.round(spot.x * 100) : 50;
  const cy = spot ? Math.round(spot.y * 100) : 50;

  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id="organ" cx="32%" cy="28%" r="75%">
          <stop offset="0%" stopColor="var(--color-primary-soft)" />
          <stop offset="55%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-primary-deep)" />
        </radialGradient>
        <radialGradient id="amber" cx="32%" cy="28%" r="75%">
          <stop offset="0%" stopColor="var(--color-glucose-soft)" />
          <stop offset="70%" stopColor="var(--color-glucose)" />
          <stop offset="100%" stopColor="var(--color-primary-deep)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" className="fill-surface" />
      {stage === "body" ? <Body /> : null}
      {stage === "pancreas" ? <Pancreas /> : null}
      {stage === "islet" ? <Islet /> : null}
      {stage === "hormones" ? <Hormones /> : null}
      {stage === "cell" ? <Cell /> : null}
      <circle cx={cx} cy={cy} r="8" className="fill-none stroke-primary" strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r="1.3" className="fill-primary" />
    </svg>
  );
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="3.4"
      fontFamily="var(--font-sans)"
      className="fill-ink"
    >
      {children}
    </text>
  );
}

function Hex({ x, y, r }: { x: number; y: number; r: number }) {
  const points = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 3;
      return `${Math.round(x + Math.cos(a) * r)},${Math.round(y + Math.sin(a) * r)}`;
    })
    .join(" ");
  return <polygon points={points} className="fill-glucose-soft stroke-glucose" strokeWidth="0.35" />;
}

function Body() {
  return (
    <g>
      <ellipse cx="50" cy="48" rx="30" ry="22" className="fill-none stroke-glucose-soft" strokeWidth="3.2" />
      <ellipse cx="50" cy="48" rx="30" ry="22" className="fill-none stroke-glucose" strokeWidth="0.45" />
      {GLUCOSE_RING.map(([x, y]) => (
        <Hex key={`${x}-${y}`} x={x} y={y} r="3.2" />
      ))}
      <path
        d="M17 42C15 30 25 24 35 28C43 22 53 28 51 38C49 50 37 56 27 52C17 50 15 48 17 42Z"
        fill="url(#organ)"
      />
      <path
        d="M48 60C56 48 76 46 88 54C92 58 80 66 66 68C54 70 44 66 48 60Z"
        fill="url(#organ)"
        opacity="0.92"
      />
      <circle cx="67" cy="58" r="2.2" fill="url(#amber)" />
      <circle cx="50" cy="78" r="6.5" fill="url(#amber)" />
      <Hex x={50} y={78} r={2.4} />
      <Label x={33} y={20}>الكبد</Label>
      <Label x={70} y={46}>البنكرياس</Label>
      <Label x={50} y={90}>الدم</Label>
    </g>
  );
}

function Pancreas() {
  return (
    <g>
      <path
        d="M16 64C20 44 36 38 48 48C54 36 66 30 78 36C90 42 94 52 84 58C68 68 46 74 28 70C14 68 10 70 16 64Z"
        fill="url(#organ)"
      />
      <path
        d="M24 66C40 74 62 72 82 58"
        className="fill-none stroke-glucose-soft"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="43" cy="46" r="7" fill="url(#amber)" />
      <circle cx="72" cy="36" r="4.2" className="fill-primary-soft stroke-primary" strokeWidth="0.4" />
      <circle cx="60" cy="40" r="2.1" className="fill-primary-soft" />
      <circle cx="30" cy="58" r="2.4" className="fill-primary-soft" />
      <Label x={43} y={30}>جزيرة</Label>
      <Label x={78} y={30}>عنبة</Label>
      <Label x={50} y={80}>القناة</Label>
    </g>
  );
}

function Islet() {
  return (
    <g>
      <circle cx="50" cy="50" r="34" className="fill-primary-soft" />
      <circle cx="50" cy="50" r="34" className="fill-none stroke-primary" strokeWidth="0.6" />
      {ISLET_CELLS.map(([x, y, edge]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={edge ? 3.1 : 3.8} fill={edge ? "url(#organ)" : "url(#amber)"} />
      ))}
      <circle cx="46" cy="52" r="5.5" fill="url(#amber)" />
      <circle cx="73" cy="30" r="4.6" fill="url(#organ)" />
      <path
        d="M18 66C32 72 40 52 78 36"
        className="fill-none stroke-primary-deep"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <Label x={46} y={18}>خلية β</Label>
      <Label x={78} y={22}>خلية α</Label>
      <Label x={24} y={78}>شعيرة</Label>
    </g>
  );
}

function Bead({ x, y, tone }: { x: number; y: number; tone: "green" | "amber" }) {
  return <circle cx={x} cy={y} r="2.5" fill={tone === "green" ? "url(#organ)" : "url(#amber)"} />;
}

function Hormones() {
  const chainB = [
    [18, 34], [23, 30], [29, 29], [35, 32], [40, 38], [42, 45], [40, 52], [36, 58],
  ];
  const chainA = [
    [24, 44], [29, 42], [34, 46], [36, 52], [33, 58], [29, 63],
  ];
  const chainG = [
    [60, 32], [64, 29], [69, 30], [73, 35], [76, 41], [76, 48], [73, 54], [69, 59], [64, 63],
  ];
  return (
    <g>
      {[[29, 29, 29, 42], [35, 32, 34, 46], [40, 38, 36, 52]].map(([x1, y1, x2, y2]) => (
        <line
          key={`${x1}-${y1}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-glucose"
          strokeWidth="0.7"
        />
      ))}
      {chainB.map(([x, y]) => (
        <Bead key={`b${x}-${y}`} x={x} y={y} tone="green" />
      ))}
      {chainA.map(([x, y]) => (
        <Bead key={`a${x}-${y}`} x={x} y={y} tone="green" />
      ))}
      {chainG.map(([x, y]) => (
        <Bead key={`g${x}-${y}`} x={x} y={y} tone="amber" />
      ))}
      <Label x={32} y={22}>الأنسولين</Label>
      <Label x={70} y={22}>الغلوكاغون</Label>
      <Label x={36} y={74}>جسور كبريتية</Label>
    </g>
  );
}

function Rosette({ x, y }: { x: number; y: number }) {
  const petals: Array<[number, number]> = [
    [0, -4], [3, -2], [3, 2], [0, 4], [-3, 2], [-3, -2],
  ];
  return (
    <g>
      {petals.map(([dx, dy]) => (
        <circle key={`${dx}-${dy}`} cx={x + dx} cy={y + dy} r="1.7" fill="url(#amber)" />
      ))}
      <circle cx={x} cy={y} r="2" fill="url(#amber)" />
    </g>
  );
}

function Cell() {
  return (
    <g>
      <circle cx="50" cy="50" r="34" className="fill-primary-soft stroke-primary" strokeWidth="1.4" />
      <Rosette x={66} y={36} />
      <Rosette x={28} y={34} />
      <rect x="52" y="66" width="14" height="6" rx="3" fill="url(#organ)" />
      <circle cx="40" cy="48" r="10" fill="url(#organ)" />
      <Label x={66} y={26}>غليكوجين</Label>
      <Label x={40} y={40}>النواة</Label>
      <Label x={60} y={80}>متقدرة</Label>
    </g>
  );
}
