import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TERMINAL_GREEN = "#22C55E";
const TERMINAL_GOLD = "#F59E0B";
const DEEP_BG = "#0B1120";

interface TerminalLineConfig {
  text: string;
  startFrame: number;
  endFrame: number;
  highlights?: Array<{
    text: string;
    color: string;
  }>;
}

const lines: TerminalLineConfig[] = [
  {
    text: "\u25b8 Inicializando agente...",
    startFrame: 10,
    endFrame: 30,
  },
  {
    text: "\u25b8 Cargando tools: [6/6 ready]",
    startFrame: 30,
    endFrame: 50,
    highlights: [{ text: "[6/6 ready]", color: TERMINAL_GOLD }],
  },
  {
    text: "\u25b8 Conectando canales: WhatsApp \u2713 | Web Chat \u2713 | Email \u2713",
    startFrame: 50,
    endFrame: 70,
    highlights: [
      { text: "\u2713", color: TERMINAL_GREEN },
    ],
  },
  {
    text: "\u25b8 Cliente: Restaurante Don Pedro SpA",
    startFrame: 70,
    endFrame: 85,
    highlights: [{ text: "Restaurante Don Pedro SpA", color: TERMINAL_GOLD }],
  },
  {
    text: "\u25b8 Estado: ONLINE",
    startFrame: 85,
    endFrame: 100,
    highlights: [{ text: "ONLINE", color: TERMINAL_GREEN }],
  },
];

function renderHighlightedText(
  visibleText: string,
  fullText: string,
  highlights?: TerminalLineConfig["highlights"]
): React.ReactNode {
  if (!highlights || highlights.length === 0) {
    return <span style={{ color: TERMINAL_GREEN }}>{visibleText}</span>;
  }

  const result: React.ReactNode[] = [];
  let processedIndex = 0;

  for (let i = 0; i < visibleText.length; ) {
    let matched = false;

    for (const highlight of highlights) {
      const indexInFull = fullText.indexOf(highlight.text, processedIndex);
      if (indexInFull === i) {
        const highlightVisible = visibleText.slice(
          i,
          Math.min(i + highlight.text.length, visibleText.length)
        );
        if (highlightVisible.length > 0) {
          result.push(
            <span key={`h-${i}`} style={{ color: highlight.color }}>
              {highlightVisible}
            </span>
          );
          i += highlightVisible.length;
          processedIndex = i;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      let nextHighlightStart = visibleText.length;
      for (const highlight of highlights) {
        const idx = fullText.indexOf(highlight.text, i);
        if (idx !== -1 && idx < nextHighlightStart) {
          nextHighlightStart = idx;
        }
      }
      const end = Math.min(nextHighlightStart, visibleText.length);
      result.push(
        <span key={`t-${i}`} style={{ color: TERMINAL_GREEN }}>
          {visibleText.slice(i, end)}
        </span>
      );
      processedIndex = end;
      i = end;
    }
  }

  return <>{result}</>;
}

function TerminalLine({
  config,
  frame,
}: {
  config: TerminalLineConfig;
  frame: number;
}) {
  if (frame < config.startFrame) return null;

  const totalChars = config.text.length;
  const frameDuration = config.endFrame - config.startFrame;
  const charsPerFrame = totalChars / frameDuration;
  const elapsed = frame - config.startFrame;
  const visibleChars = Math.min(
    Math.floor(elapsed * charsPerFrame),
    totalChars
  );
  const visibleText = config.text.slice(0, visibleChars);

  return (
    <div style={{ marginBottom: 12, lineHeight: 1.6 }}>
      {renderHighlightedText(visibleText, config.text, config.highlights)}
      {visibleChars < totalChars && (
        <span
          style={{
            color: TERMINAL_GREEN,
            opacity: frame % 15 < 8 ? 1 : 0,
          }}
        >
          _
        </span>
      )}
    </div>
  );
}

function OnlinePulse({ frame }: { frame: number }) {
  if (frame < 85) return null;

  const glowOpacity = interpolate(
    Math.sin((frame - 85) * 0.3),
    [-1, 1],
    [0.3, 1]
  );

  return (
    <style>{`
      .online-glow {
        text-shadow: 0 0 ${8 * glowOpacity}px ${TERMINAL_GREEN},
                     0 0 ${16 * glowOpacity}px ${TERMINAL_GREEN},
                     0 0 ${24 * glowOpacity}px rgba(34, 197, 94, 0.5);
      }
    `}</style>
  );
}

function BlinkingCursor({ frame }: { frame: number }) {
  if (frame > 10) return null;
  const visible = frame % 15 < 8;

  return (
    <div style={{ lineHeight: 1.6 }}>
      <span
        style={{
          color: TERMINAL_GREEN,
          opacity: visible ? 1 : 0,
        }}
      >
        _
      </span>
    </div>
  );
}

export const HeroSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOutOpacity = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleSpring = spring({
    frame: frame - 2,
    fps,
    config: {
      stiffness: 100,
      damping: 20,
    },
  });

  const containerScale = interpolate(scaleSpring, [0, 1], [0.98, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DEEP_BG,
        fontFamily: "'JetBrains Mono', monospace",
        opacity: fadeOutOpacity,
      }}
    >
      {/* CSS import for JetBrains Mono */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');`}</style>

      {/* CRT scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Terminal content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${containerScale})`,
          width: "80%",
          maxWidth: 900,
          fontSize: 20,
          zIndex: 2,
        }}
      >
        {/* Terminal header bar */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            opacity: interpolate(frame, [0, 5], [0, 0.6], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#EF4444",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#F59E0B",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#22C55E",
            }}
          />
          <span
            style={{
              color: "#64748B",
              fontSize: 14,
              marginLeft: 12,
            }}
          >
            cintax-agent@v1.0 ~ /deploy
          </span>
        </div>

        {/* Cursor only phase */}
        <BlinkingCursor frame={frame} />

        {/* Terminal lines */}
        <OnlinePulse frame={frame} />
        {lines.map((line, index) => (
          <TerminalLine key={index} config={line} frame={frame} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
