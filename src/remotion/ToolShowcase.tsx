import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const GOLD = "#F59E0B";
const BG = "#1E293B";
const WHITE = "#FFFFFF";

interface ToolShowcaseProps {
  readonly toolIndex?: number;
  [key: string]: unknown;
}

/* ── 0: searchRegulations ── */
function SearchRegulations({ frame }: { frame: number }) {
  const query = "IVA régimen PYME";
  const charsVisible = Math.min(
    Math.floor(interpolate(frame, [0, 30], [0, query.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
    query.length
  );
  const visibleQuery = query.slice(0, charsVisible);

  const resultOpacities = [0, 1, 2].map((i) =>
    interpolate(frame, [32 + i * 6, 38 + i * 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <g>
      {/* Search bar */}
      <rect x={40} y={30} width={320} height={32} rx={6} fill="#0F172A" stroke={GOLD} strokeWidth={1} strokeOpacity={0.4} />
      <text x={52} y={51} fill={GOLD} fontSize={13} fontFamily="'JetBrains Mono', monospace">
        {visibleQuery}
        {charsVisible < query.length && (
          <tspan opacity={frame % 15 < 8 ? 1 : 0}>_</tspan>
        )}
      </text>

      {/* Results */}
      {resultOpacities.map((opacity, i) => (
        <g key={i} opacity={opacity}>
          <rect x={40} y={74 + i * 36} width={320} height={28} rx={4} fill="#0F172A" fillOpacity={0.6} />
          <circle cx={56} cy={88 + i * 36} r={3} fill={GOLD} />
          <rect x={68} y={84 + i * 36} width={interpolate(i, [0, 1, 2], [200, 160, 240])} height={8} rx={4} fill={WHITE} fillOpacity={0.15} />
        </g>
      ))}
    </g>
  );
}

/* ── 1: generateAndSendReport ── */
function GenerateAndSendReport({ frame }: { frame: number }) {
  // PDF appears
  const pdfScale = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Email icon flies out
  const emailX = interpolate(frame, [20, 35], [200, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const emailOpacity = interpolate(frame, [20, 25, 50, 55], [0, 1, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // WhatsApp icon flies out
  const waX = interpolate(frame, [28, 43], [200, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const waOpacity = interpolate(frame, [28, 33, 50, 55], [0, 1, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Check marks
  const checkEmail = interpolate(frame, [38, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkWa = interpolate(frame, [46, 53], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      {/* PDF Document */}
      <g transform={`translate(120, 40) scale(${pdfScale})`}>
        <rect x={0} y={0} width={80} height={110} rx={6} fill="#0F172A" stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.5} />
        <rect x={0} y={0} width={80} height={20} rx={6} fill={GOLD} fillOpacity={0.2} />
        <text x={10} y={14} fill={GOLD} fontSize={9} fontFamily="'JetBrains Mono', monospace">PDF</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={10} y={30 + i * 18} width={60 - i * 8} height={6} rx={3} fill={WHITE} fillOpacity={0.1} />
        ))}
      </g>

      {/* Email delivery */}
      <g opacity={emailOpacity}>
        <rect x={emailX} y={45} width={50} height={32} rx={6} fill="#8B5CF6" fillOpacity={0.15} stroke="#8B5CF6" strokeWidth={1} strokeOpacity={0.3} />
        <text x={emailX + 10} y={65} fill="#8B5CF6" fontSize={10} fontFamily="'JetBrains Mono', monospace">Email</text>
        <circle cx={emailX + 42} cy={50} r={7} fill="#22C55E" fillOpacity={checkEmail} />
        <path d={`M${emailX + 37} 50 L${emailX + 40} 53 L${emailX + 47} 46`} fill="none" stroke={WHITE} strokeWidth={1.5} strokeLinecap="round" opacity={checkEmail} />
      </g>

      {/* WhatsApp delivery */}
      <g opacity={waOpacity}>
        <rect x={waX} y={95} width={50} height={32} rx={6} fill="#22C55E" fillOpacity={0.15} stroke="#22C55E" strokeWidth={1} strokeOpacity={0.3} />
        <text x={waX + 5} y={115} fill="#22C55E" fontSize={9} fontFamily="'JetBrains Mono', monospace">WApp</text>
        <circle cx={waX + 42} cy={100} r={7} fill="#22C55E" fillOpacity={checkWa} />
        <path d={`M${waX + 37} 100 L${waX + 40} 103 L${waX + 47} 96`} fill="none" stroke={WHITE} strokeWidth={1.5} strokeLinecap="round" opacity={checkWa} />
      </g>

      {/* Connection lines */}
      <line x1={200} y1={75} x2={emailX} y2={61} stroke={GOLD} strokeWidth={1} strokeDasharray="4 3" strokeOpacity={emailOpacity * 0.4} />
      <line x1={200} y1={100} x2={waX} y2={111} stroke={GOLD} strokeWidth={1} strokeDasharray="4 3" strokeOpacity={waOpacity * 0.4} />
    </g>
  );
}

/* ── 2: calculateTax ── */
function CalculateTax({ frame }: { frame: number }) {
  // Formula fades in
  const formulaOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Number counts up
  const targetValue = 2280000;
  const currentValue = Math.floor(
    interpolate(frame, [10, 45], [0, targetValue], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const formattedValue = `$${currentValue.toLocaleString("es-CL")}`;

  return (
    <g>
      {/* Formula */}
      <text
        x={200}
        y={60}
        textAnchor="middle"
        fill={WHITE}
        fillOpacity={formulaOpacity * 0.5}
        fontSize={14}
        fontFamily="'JetBrains Mono', monospace"
      >
        = $12M × 19%
      </text>

      {/* Big number */}
      <text
        x={200}
        y={110}
        textAnchor="middle"
        fill={GOLD}
        fontSize={32}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight="bold"
      >
        {formattedValue}
      </text>

      {/* Underline */}
      <rect
        x={80}
        y={125}
        width={interpolate(frame, [30, 50], [0, 240], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        height={2}
        rx={1}
        fill={GOLD}
        fillOpacity={0.3}
      />
    </g>
  );
}

/* ── 3: checkProcedureStatus ── */
function CheckProcedureStatus({ frame }: { frame: number }) {
  const bars = [
    { target: 0.6, startFrame: 0, endFrame: 20, label: "SII" },
    { target: 1.0, startFrame: 15, endFrame: 35, label: "TGR" },
    { target: 0.4, startFrame: 30, endFrame: 50, label: "CMF" },
  ];

  const maxBarWidth = 260;

  return (
    <g>
      {bars.map((bar, i) => {
        const progress = interpolate(
          frame,
          [bar.startFrame, bar.endFrame],
          [0, bar.target],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const barWidth = progress * maxBarWidth;
        const yPos = 40 + i * 48;

        return (
          <g key={i}>
            {/* Label */}
            <text
              x={50}
              y={yPos + 4}
              fill={WHITE}
              fillOpacity={0.6}
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
            >
              {bar.label}
            </text>
            {/* Track */}
            <rect
              x={90}
              y={yPos - 8}
              width={maxBarWidth}
              height={16}
              rx={8}
              fill={WHITE}
              fillOpacity={0.05}
            />
            {/* Fill */}
            <rect
              x={90}
              y={yPos - 8}
              width={barWidth}
              height={16}
              rx={8}
              fill={bar.target === 1 ? "#22C55E" : GOLD}
              fillOpacity={0.6}
            />
            {/* Percentage */}
            <text
              x={90 + barWidth + 8}
              y={yPos + 4}
              fill={WHITE}
              fillOpacity={0.5}
              fontSize={10}
              fontFamily="'JetBrains Mono', monospace"
            >
              {Math.round(progress * 100)}%
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ── Main Component ── */

const animations = [
  SearchRegulations,
  CalculateTax,
  CheckProcedureStatus,
  GenerateAndSendReport,
];

export const ToolShowcase: React.FC<ToolShowcaseProps> = ({ toolIndex = 0 }) => {
  const frame = useCurrentFrame();
  const AnimationComponent = animations[toolIndex] ?? animations[0];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');`}</style>
      <svg width={400} height={200}>
        <AnimationComponent frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};
