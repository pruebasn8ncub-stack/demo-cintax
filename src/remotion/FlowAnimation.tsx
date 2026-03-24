import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const GOLD = "#F59E0B";
const GOLD_GLOW = "rgba(245,158,11,0.5)";
const DEEP_BG = "#0B1120";

const NODE_LABELS: string[][] = [
  ["Webhook", "Procesar", "PDF", "Response"],
  ["Webhook", "Nodemailer", "Gmail SMTP", "Response"],
  ["Webhook", "Preparar", "Evolution API", "Response"],
];

interface FlowAnimationProps {
  readonly workflowIndex?: number;
  [key: string]: unknown;
}

export const FlowAnimation: React.FC<FlowAnimationProps> = ({
  workflowIndex = 0,
}) => {
  const frame = useCurrentFrame();
  const labels = NODE_LABELS[workflowIndex] ?? NODE_LABELS[0];

  // Layout constants
  const nodeRadius = 20;
  const width = 800;
  const height = 200;
  const padding = 80;
  const spacing = (width - padding * 2) / 3;
  const nodeY = height / 2 - 10;

  // Node positions
  const nodePositions = labels.map((_, i) => ({
    x: padding + i * spacing,
    y: nodeY,
  }));

  // Particle configs
  const particles = [
    { startFrame: 0, endFrame: 80 },
    { startFrame: 20, endFrame: 90 },
    { startFrame: 40, endFrame: 90 },
  ];

  const totalPathStartX = nodePositions[0].x;
  const totalPathEndX = nodePositions[3].x;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DEEP_BG,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      <svg width={width} height={height}>
        {/* Connection lines between nodes */}
        {nodePositions.slice(0, -1).map((pos, i) => {
          const next = nodePositions[i + 1];
          return (
            <line
              key={`line-${i}`}
              x1={pos.x + nodeRadius}
              y1={pos.y}
              x2={next.x - nodeRadius}
              y2={next.y}
              stroke={GOLD}
              strokeWidth={2}
              strokeOpacity={0.4}
            />
          );
        })}

        {/* Traveling particles with trail */}
        {particles.map((p, pi) => {
          const loopFrame = frame % 90;
          const progress = interpolate(
            loopFrame,
            [p.startFrame, p.endFrame],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const px = interpolate(progress, [0, 1], [totalPathStartX, totalPathEndX]);
          const mainOpacity = interpolate(
            loopFrame,
            [p.startFrame, p.startFrame + 5, p.endFrame - 5, p.endFrame],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <g key={`particle-${pi}`}>
              {/* Trail */}
              {[12, 8, 4].map((offset, ti) => {
                const trailX = px - offset;
                if (trailX < totalPathStartX) return null;
                return (
                  <circle
                    key={`trail-${pi}-${ti}`}
                    cx={trailX}
                    cy={nodeY}
                    r={4 - ti}
                    fill={GOLD}
                    opacity={mainOpacity * (0.3 - ti * 0.08)}
                  />
                );
              })}
              {/* Main particle */}
              <circle
                cx={px}
                cy={nodeY}
                r={4}
                fill={GOLD}
                opacity={mainOpacity}
              />
              {/* Glow */}
              <circle
                cx={px}
                cy={nodeY}
                r={8}
                fill="none"
                stroke={GOLD_GLOW}
                strokeWidth={2}
                opacity={mainOpacity * 0.5}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {nodePositions.map((pos, i) => {
          // Calculate if any particle is near this node for pulse
          const loopFrame = frame % 90;
          let pulseScale = 1;
          let glowOpacity = 0;

          for (const p of particles) {
            const progress = interpolate(
              loopFrame,
              [p.startFrame, p.endFrame],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const px = interpolate(progress, [0, 1], [totalPathStartX, totalPathEndX]);
            const distance = Math.abs(px - pos.x);

            if (distance < 15) {
              const closeness = 1 - distance / 15;
              pulseScale = Math.max(pulseScale, 1 + closeness * 0.2);
              glowOpacity = Math.max(glowOpacity, closeness * 0.6);
            }
          }

          return (
            <g
              key={`node-${i}`}
              transform={`translate(${pos.x}, ${pos.y}) scale(${pulseScale})`}
            >
              {/* Glow ring */}
              <circle
                r={nodeRadius + 4}
                fill="none"
                stroke={GOLD_GLOW}
                strokeWidth={2}
                opacity={glowOpacity}
              />
              {/* Node circle */}
              <circle
                r={nodeRadius}
                fill="#1E293B"
                stroke={GOLD}
                strokeWidth={2}
              />
              {/* Node inner dot */}
              <circle r={4} fill={GOLD} opacity={0.6} />
            </g>
          );
        })}

        {/* Node labels */}
        {nodePositions.map((pos, i) => (
          <text
            key={`label-${i}`}
            x={pos.x}
            y={pos.y + nodeRadius + 20}
            textAnchor="middle"
            fill="white"
            fontSize={11}
            fontFamily="'JetBrains Mono', monospace"
            opacity={0.8}
          >
            {labels[i]}
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
