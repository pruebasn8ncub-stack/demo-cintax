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

/* ── 1: generateReport ── */
function GenerateReport({ frame }: { frame: number }) {
  // Header slides in
  const headerX = interpolate(frame, [0, 15], [-200, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bars grow
  const barWidths = [220, 160, 280].map((maxW, i) =>
    interpolate(frame, [18 + i * 8, 35 + i * 8], [0, maxW], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <g>
      {/* Report card bg */}
      <rect x={40} y={20} width={320} height={160} rx={8} fill="#0F172A" fillOpacity={0.6} />

      {/* Header bar */}
      <rect x={headerX} y={28} width={320} height={24} rx={4} fill={GOLD} fillOpacity={0.2} />
      <text x={headerX + 12} y={45} fill={GOLD} fontSize={12} fontFamily="'JetBrains Mono', monospace">
        Reporte Tributario
      </text>

      {/* Chart bars */}
      {barWidths.map((w, i) => (
        <g key={i}>
          <rect x={60} y={68 + i * 32} width={w} height={18} rx={4} fill={GOLD} fillOpacity={0.15 + i * 0.1} />
          <rect x={60} y={68 + i * 32} width={w} height={18} rx={4} fill={GOLD} fillOpacity={0.3} />
        </g>
      ))}
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

/* ── 3: scheduleConsultation ── */
function ScheduleConsultation({ frame }: { frame: number }) {
  const dots: { row: number; col: number }[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      dots.push({ row: r, col: c });
    }
  }

  const selectedIndex = 4; // center dot
  const highlightFrame = 40;

  return (
    <g>
      {dots.map((dot, i) => {
        const appearFrame = 3 + i * 3;
        const dotOpacity = interpolate(frame, [appearFrame, appearFrame + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const isSelected = i === selectedIndex && frame >= highlightFrame;
        const selectedScale = isSelected
          ? interpolate(frame, [highlightFrame, highlightFrame + 10], [1, 1.4], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 1;

        const cx = 140 + dot.col * 50;
        const cy = 50 + dot.row * 50;

        return (
          <g key={i} opacity={dotOpacity}>
            {isSelected && (
              <circle
                cx={cx}
                cy={cy}
                r={16 * selectedScale}
                fill={GOLD}
                fillOpacity={0.15}
              />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={8 * selectedScale}
              fill={isSelected ? GOLD : WHITE}
              fillOpacity={isSelected ? 1 : 0.2}
            />
          </g>
        );
      })}
    </g>
  );
}

/* ── 4: sendEmail ── */
function SendEmail({ frame }: { frame: number }) {
  // Envelope path draws itself
  const drawProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Checkmark appears
  const checkOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkScale = interpolate(frame, [35, 45], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Envelope path total length is approx 440
  const envelopeLength = 440;
  const envelopeDashOffset = envelopeLength * (1 - drawProgress);

  return (
    <g>
      {/* Envelope body */}
      <rect
        x={120}
        y={50}
        width={160}
        height={100}
        rx={8}
        fill="none"
        stroke={WHITE}
        strokeWidth={2}
        strokeOpacity={0.6}
        strokeDasharray={envelopeLength}
        strokeDashoffset={envelopeDashOffset}
      />
      {/* Envelope flap */}
      <path
        d={`M120 50 L200 110 L280 50`}
        fill="none"
        stroke={WHITE}
        strokeWidth={2}
        strokeOpacity={0.6}
        strokeDasharray={200}
        strokeDashoffset={200 * (1 - drawProgress)}
      />

      {/* Checkmark */}
      <g
        opacity={checkOpacity}
        transform={`translate(200, 95) scale(${checkScale})`}
      >
        <circle r={16} fill={GOLD} fillOpacity={0.2} />
        <path
          d="M-8 0 L-3 5 L8 -6"
          fill="none"
          stroke={GOLD}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

/* ── 5: checkProcedureStatus ── */
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
  GenerateReport,
  CalculateTax,
  ScheduleConsultation,
  SendEmail,
  CheckProcedureStatus,
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
