import { AbsoluteFill, useCurrentFrame } from "remotion";

const GOLD = "#F59E0B";
const GOLD_DIM = "rgba(245,158,11,0.6)";
const PURPLE = "#8B5CF6";
const PURPLE_DIM = "rgba(139,92,246,0.5)";

/* ── Data labels that travel along paths ── */

const DATA_LABELS = [
  "IVA 19%", "$3.068.500", "F29", "PPM", "76.543.210-K",
  "$28.450.000", "PYME", "n8n", "Claude", "PDF",
  "SII", "$398.500", "webhook", "email", "WhatsApp",
  "$12.600.000", "API", "$7.200.000", "reporte", "agente",
];

/* ── Traveling data particles — move along curved paths ── */

interface DataParticle {
  label: string;
  path: string; // SVG path
  duration: number; // frames for full traversal
  startFrame: number;
  color: string;
  fontSize: number;
  opacity: number;
}

function generateParticles(): DataParticle[] {
  const particles: DataParticle[] = [];
  const paths = [
    // Diagonal streams — top-left to bottom-right
    "M -100 200 Q 500 300 960 540 T 2020 880",
    "M -100 400 Q 400 200 960 540 T 2020 400",
    "M -100 0 Q 600 400 1200 300 T 2020 600",
    // Right to left streams
    "M 2020 100 Q 1400 400 960 540 T -100 700",
    "M 2020 800 Q 1200 500 960 540 T -100 300",
    // Bottom arcs
    "M 200 1100 Q 600 600 960 540 T 1700 1100",
    "M 1700 1100 Q 1300 700 960 540 T 200 1100",
    // Top arcs
    "M 300 -50 Q 700 400 960 540 T 1600 -50",
    "M 1600 -50 Q 1200 300 960 540 T 300 -50",
    // Vertical streams
    "M 480 -50 Q 500 400 480 1130",
    "M 1440 -50 Q 1420 400 1440 1130",
    // Cross paths
    "M -50 540 L 2020 540",
    "M 960 -50 Q 960 540 960 1130",
  ];

  for (let i = 0; i < 30; i++) {
    const pathIdx = i % paths.length;
    particles.push({
      label: DATA_LABELS[i % DATA_LABELS.length],
      path: paths[pathIdx],
      duration: 180 + (i % 5) * 40,
      startFrame: (i * 31) % 200,
      color: i % 3 === 0 ? PURPLE_DIM : GOLD_DIM,
      fontSize: 9 + (i % 3),
      opacity: 0.12 + (i % 4) * 0.04,
    });
  }
  return particles;
}

const PARTICLES = generateParticles();

/* ── Glowing orbs at path intersections (center focal point) ── */

interface Orb {
  cx: number;
  cy: number;
  r: number;
  color: string;
  phaseSpeed: number;
  phase: number;
}

const ORBS: Orb[] = [
  { cx: 960, cy: 540, r: 120, color: GOLD, phaseSpeed: 0.02, phase: 0 },
  { cx: 960, cy: 540, r: 60, color: PURPLE, phaseSpeed: 0.03, phase: 1 },
  { cx: 400, cy: 300, r: 40, color: GOLD, phaseSpeed: 0.015, phase: 2 },
  { cx: 1500, cy: 700, r: 35, color: PURPLE, phaseSpeed: 0.018, phase: 3 },
  { cx: 300, cy: 800, r: 25, color: GOLD, phaseSpeed: 0.02, phase: 4 },
  { cx: 1600, cy: 200, r: 30, color: PURPLE, phaseSpeed: 0.022, phase: 5 },
];

/* ── Main composition ── */

interface HeroBackgroundProps {
  [key: string]: unknown;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for center focal */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.06} />
            <stop offset="60%" stopColor={GOLD} stopOpacity={0.02} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Center focal glow */}
        <ellipse
          cx={960}
          cy={540}
          rx={400 + Math.sin(frame * 0.02) * 30}
          ry={300 + Math.cos(frame * 0.015) * 20}
          fill="url(#centerGlow)"
        />

        {/* Path traces — subtle visible paths */}
        {PARTICLES.slice(0, 13).map((p, i) => (
          <path
            key={`trace-${i}`}
            d={p.path}
            fill="none"
            stroke={p.color}
            strokeWidth={0.5}
            opacity={0.04 + Math.sin(frame * 0.01 + i) * 0.02}
          />
        ))}

        {/* Orbs — glowing focal points */}
        {ORBS.map((orb, i) => {
          const pulse = 1 + Math.sin(frame * orb.phaseSpeed + orb.phase) * 0.3;
          const breathe = Math.sin(frame * 0.025 + orb.phase) * 0.02;
          return (
            <g key={`orb-${i}`}>
              <circle
                cx={orb.cx}
                cy={orb.cy}
                r={orb.r * pulse}
                fill={orb.color}
                opacity={0.02 + breathe}
              />
              <circle
                cx={orb.cx}
                cy={orb.cy}
                r={orb.r * 0.3 * pulse}
                fill={orb.color}
                opacity={0.04 + breathe}
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* Data particles traveling along paths */}
        {PARTICLES.map((p, i) => {
          const loopFrame = (frame + p.startFrame) % (p.duration + 60);
          const progress = Math.min(1, Math.max(0, loopFrame / p.duration));

          // Fade in/out at edges
          const fadeIn = Math.min(1, progress * 8);
          const fadeOut = Math.min(1, (1 - progress) * 8);
          const alpha = p.opacity * fadeIn * fadeOut;

          if (alpha < 0.01) return null;

          return (
            <g key={`particle-${i}`}>
              {/* Dot traveling on path */}
              <circle r={2.5} fill={p.color} opacity={alpha * 2} filter="url(#glow)">
                <animateMotion
                  dur={`${p.duration / 30}s`}
                  repeatCount="indefinite"
                  begin={`${p.startFrame / 30}s`}
                  path={p.path}
                />
              </circle>

              {/* Label traveling with dot */}
              <text
                fontSize={p.fontSize}
                fontFamily="'JetBrains Mono', monospace"
                fill={p.color}
                opacity={alpha}
                dy={-8}
              >
                <animateMotion
                  dur={`${p.duration / 30}s`}
                  repeatCount="indefinite"
                  begin={`${p.startFrame / 30}s`}
                  path={p.path}
                />
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Scan line */}
        <rect
          x={0}
          y={(frame * 1.8) % 1080}
          width={1920}
          height={1}
          fill={GOLD}
          opacity={0.06}
        />
      </svg>
    </AbsoluteFill>
  );
};
