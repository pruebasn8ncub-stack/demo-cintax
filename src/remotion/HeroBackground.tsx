import { AbsoluteFill, useCurrentFrame } from "remotion";

const GOLD = "#F59E0B";
const PURPLE = "#8B5CF6";
const BG = "#0B1120";

/* ── Data streams — financial/tax data flowing down ── */

interface DataStream {
  x: number;
  speed: number;
  opacity: number;
  color: string;
  fontSize: number;
  items: string[];
  phase: number;
}

const DATA_ITEMS = [
  "IVA 19%", "$3.068.500", "F29", "PPM 0.25%", "76.543.210-K",
  "RUT", "$28.450.000", "PYME", "Art.23", "DL825",
  "$398.500", "ONLINE", "PDF", "n8n", "Claude",
  "SII", "F22", "$12.600.000", "API", "webhook",
  "email", "WhatsApp", "reporte", "informe", "cálculo",
  "$8.600.000", "tributario", "laboral", "contable", "agente",
  "0x4F2B", "TCP/443", "HTTPS", "JWT", "async",
  "stream", "tools", "$7.200.000", "cotización", "AFP",
];

function createStreams(count: number): DataStream[] {
  const streams: DataStream[] = [];
  for (let i = 0; i < count; i++) {
    const items: string[] = [];
    for (let j = 0; j < 8; j++) {
      items.push(DATA_ITEMS[(i * 7 + j * 3) % DATA_ITEMS.length]);
    }
    streams.push({
      x: (i / count) * 100,
      speed: 0.3 + (i % 5) * 0.15,
      opacity: 0.04 + (i % 3) * 0.02,
      color: i % 4 === 0 ? PURPLE : GOLD,
      fontSize: 10 + (i % 3) * 2,
      items,
      phase: i * 47,
    });
  }
  return streams;
}

const STREAMS = createStreams(18);

/* ── Floating nodes — represent data points ── */

interface FloatingNode {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  phase: number;
}

function createNodes(count: number): FloatingNode[] {
  const nodes: FloatingNode[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: (i * 137) % 100,
      y: (i * 89) % 100,
      size: 2 + (i % 4),
      color: i % 3 === 0 ? PURPLE : GOLD,
      speedX: 0.02 + (i % 5) * 0.008,
      speedY: 0.015 + (i % 4) * 0.01,
      phase: i * 1.7,
    });
  }
  return nodes;
}

const NODES = createNodes(20);

/* ── Connection lines between nearby nodes ── */

function ConnectionLines({ frame }: { frame: number }) {
  const nodePositions = NODES.map((n) => ({
    x: (n.x + Math.sin(frame * n.speedX + n.phase) * 8) * 19.2,
    y: (n.y + Math.cos(frame * n.speedY + n.phase) * 6) * 10.8,
  }));

  const lines: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = [];

  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      const dx = nodePositions[i].x - nodePositions[j].x;
      const dy = nodePositions[i].y - nodePositions[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        lines.push({
          x1: nodePositions[i].x,
          y1: nodePositions[i].y,
          x2: nodePositions[j].x,
          y2: nodePositions[j].y,
          opacity: Math.max(0, 0.08 * (1 - dist / 300)),
        });
      }
    }
  }

  return (
    <>
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={GOLD}
          strokeWidth={0.5}
          opacity={line.opacity}
        />
      ))}
    </>
  );
}

/* ── Main composition ── */

interface HeroBackgroundProps {
  [key: string]: unknown;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Connection lines */}
        <ConnectionLines frame={frame} />

        {/* Floating nodes */}
        {NODES.map((node, i) => {
          const nx = (node.x + Math.sin(frame * node.speedX + node.phase) * 8) * 19.2;
          const ny = (node.y + Math.cos(frame * node.speedY + node.phase) * 6) * 10.8;
          const pulse = 1 + Math.sin(frame * 0.08 + node.phase) * 0.3;

          return (
            <g key={`node-${i}`}>
              {/* Glow */}
              <circle
                cx={nx}
                cy={ny}
                r={node.size * 3 * pulse}
                fill={node.color}
                opacity={0.03}
              />
              {/* Core */}
              <circle
                cx={nx}
                cy={ny}
                r={node.size * pulse}
                fill={node.color}
                opacity={0.15 + Math.sin(frame * 0.05 + node.phase) * 0.08}
              />
            </g>
          );
        })}

        {/* Data streams — vertical text columns */}
        {STREAMS.map((stream, i) => {
          const baseX = stream.x * 19.2;
          const scrollOffset = (frame * stream.speed * 3 + stream.phase) % 1200;

          return (
            <g key={`stream-${i}`} opacity={stream.opacity}>
              {stream.items.map((item, j) => {
                const y = (j * 140 - scrollOffset + 1200) % 1200 - 60;
                return (
                  <text
                    key={j}
                    x={baseX}
                    y={y}
                    fontSize={stream.fontSize}
                    fontFamily="'JetBrains Mono', monospace"
                    fill={stream.color}
                    opacity={0.6 + Math.sin(frame * 0.03 + j) * 0.4}
                  >
                    {item}
                  </text>
                );
              })}
            </g>
          );
        })}

        {/* Horizontal scan line */}
        <rect
          x={0}
          y={(frame * 2.5) % 1080}
          width={1920}
          height={1}
          fill={GOLD}
          opacity={0.04}
        />
        <rect
          x={0}
          y={(frame * 2.5) % 1080}
          width={1920}
          height={40}
          fill={`url(#scanGrad)`}
        />

        <defs>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.03} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};
