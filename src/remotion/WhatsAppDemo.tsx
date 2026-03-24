import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";

/* ── Colors ── */
const C = {
  bg: "#0B1120",
  phoneBg: "#0B141A",
  header: "#1F2C34",
  chatBg: "#0B141A",
  bubbleAgent: "#1F2C34",
  bubbleUser: "#005C4B",
  gold: "#F59E0B",
  goldDark: "#D97706",
  purple: "#8B5CF6",
  green: "#25D366",
  greenCheck: "#53BDEB",
  text: "#E9EDEF",
  textMuted: "#8696A0",
  white: "#FFFFFF",
};

/* ── Message data ── */
interface MsgData {
  role: "user" | "agent";
  text: string;
  startFrame: number;
  hasPDF?: boolean;
}

const MESSAGES: MsgData[] = [
  { role: "user", text: "Necesito el informe tributario de marzo", startFrame: 20 },
  { role: "agent", text: "Generando tu informe...", startFrame: 70 },
  { role: "agent", text: "", startFrame: 130, hasPDF: true },
  { role: "agent", text: "IVA: $3.068.500\nPPM: $398.500\nTotal F29: $3.712.000", startFrame: 170 },
  { role: "user", text: "Envíalo también por email", startFrame: 240 },
  { role: "agent", text: "✓ Enviado con firma Cintax", startFrame: 290 },
];

/* ── Typing dots ── */
function TypingDots({ frame, x, y }: { frame: number; x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={52} height={24} rx={12} fill={C.bubbleAgent} />
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((frame * 0.3 + i * 1.2)) * 3;
        return (
          <circle
            key={i}
            cx={x + 14 + i * 10}
            cy={y + 12 + bounce}
            r={3}
            fill={C.textMuted}
            opacity={0.8}
          />
        );
      })}
    </g>
  );
}

/* ── PDF Attachment ── */
function PDFCard({ frame, startFrame, x, y }: { frame: number; startFrame: number; x: number; y: number }) {
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 15, stiffness: 120 } });
  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Gold glow pulse
  const glowOpacity = interpolate(
    Math.sin((frame - startFrame) * 0.15),
    [-1, 1],
    [0.15, 0.4]
  );

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Glow behind */}
      <rect x={-2} y={-2} width={164} height={48} rx={10} fill={C.gold} opacity={glowOpacity} />
      {/* Card bg */}
      <rect x={0} y={0} width={160} height={44} rx={8} fill="#0F172A" stroke={C.gold} strokeWidth={1} strokeOpacity={0.3} />
      {/* PDF icon */}
      <rect x={8} y={8} width={28} height={28} rx={6} fill={C.gold} />
      <text x={14} y={27} fontSize={10} fontWeight="bold" fill="#0F172A" fontFamily="system-ui">PDF</text>
      {/* Filename */}
      <text x={44} y={20} fontSize={8} fill={C.text} fontFamily="system-ui">Informe_Tributario</text>
      <text x={44} y={32} fontSize={7} fill={C.textMuted} fontFamily="system-ui">Marzo_2026.pdf · 3.2 KB</text>
      {/* Gold accent line */}
      <rect x={0} y={42} width={160} height={2} rx={1} fill="url(#goldPurple)" />
    </g>
  );
}

/* ── Chat Bubble ── */
function Bubble({
  msg,
  frame,
  y,
}: {
  msg: MsgData;
  frame: number;
  y: number;
}) {
  const { fps } = useVideoConfig();
  const localFrame = frame - msg.startFrame;
  if (localFrame < 0) return null;

  const progress = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 100 } });
  const slideY = interpolate(progress, [0, 1], [16, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const isUser = msg.role === "user";
  const bubbleColor = isUser ? C.bubbleUser : C.bubbleAgent;
  const bubbleX = isUser ? 200 : 24;
  const maxWidth = isUser ? 150 : 168;

  // Text line wrapping simulation
  const lines = msg.text ? msg.text.split("\n") : [];
  const textHeight = lines.length * 14;
  const bubbleHeight = msg.hasPDF ? 56 : Math.max(28, textHeight + 20);

  return (
    <g transform={`translate(0, ${y + slideY})`} opacity={opacity}>
      {/* Bubble background */}
      <rect
        x={bubbleX}
        y={0}
        width={maxWidth}
        height={bubbleHeight}
        rx={10}
        fill={bubbleColor}
      />

      {/* PDF attachment */}
      {msg.hasPDF && (
        <PDFCard frame={frame} startFrame={msg.startFrame + 5} x={bubbleX + 4} y={4} />
      )}

      {/* Text content */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={bubbleX + 10}
          y={14 + i * 14}
          fontSize={9}
          fill={C.text}
          fontFamily="system-ui"
        >
          {line}
        </text>
      ))}

      {/* Time + checks */}
      <text
        x={bubbleX + maxWidth - 8}
        y={bubbleHeight - 5}
        textAnchor="end"
        fontSize={7}
        fill={C.textMuted}
        opacity={0.6}
        fontFamily="system-ui"
      >
        {`${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, "0")}`}
      </text>
      {isUser && (
        <g transform={`translate(${bubbleX + maxWidth - 3}, ${bubbleHeight - 10})`}>
          <path d="M-6 0 L-3 3 L3 -3" fill="none" stroke={C.greenCheck} strokeWidth={1.2} strokeLinecap="round" />
          <path d="M-3 0 L0 3 L6 -3" fill="none" stroke={C.greenCheck} strokeWidth={1.2} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/* ── Particle field ── */
function Particles({ frame }: { frame: number }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: 40 + (i * 37) % 320,
    baseY: 50 + (i * 53) % 400,
    size: 1 + (i % 3) * 0.5,
    speed: 0.3 + (i % 4) * 0.15,
    phase: i * 1.3,
  }));

  return (
    <g>
      {particles.map((p, i) => {
        const y = p.baseY + Math.sin(frame * p.speed * 0.05 + p.phase) * 8;
        const opacity = 0.1 + Math.sin(frame * 0.04 + p.phase) * 0.08;
        return (
          <circle key={i} cx={p.x} cy={y} r={p.size} fill={C.gold} opacity={opacity} />
        );
      })}
    </g>
  );
}

/* ── Phone Frame ── */
function PhoneFrame({ children, frame }: { children: React.ReactNode; frame: number }) {
  const floatY = Math.sin(frame * 0.04) * 4;

  return (
    <g transform={`translate(60, ${20 + floatY})`}>
      {/* Phone shadow */}
      <ellipse cx={180} cy={510} rx={120} ry={12} fill={C.gold} opacity={0.06} />

      {/* Phone outer border */}
      <rect x={0} y={0} width={280} height={500} rx={32} fill="#1E1E2E" />
      {/* Phone inner screen */}
      <rect x={4} y={4} width={272} height={492} rx={28} fill={C.phoneBg} />

      {/* Notch */}
      <rect x={95} y={8} width={90} height={20} rx={10} fill="#111827" />

      {/* Header */}
      <rect x={4} y={32} width={272} height={48} fill={C.header} />

      {/* Avatar */}
      <circle cx={36} cy={56} r={14} fill="url(#avatarGrad)" />
      <text x={30} y={60} fontSize={9} fontWeight="bold" fill="#0F172A" fontFamily="system-ui">CX</text>
      {/* Online dot */}
      <circle cx={46} cy={64} r={4} fill={C.green} stroke={C.header} strokeWidth={2} />

      {/* Name */}
      <text x={58} y={52} fontSize={11} fontWeight="600" fill={C.text} fontFamily="system-ui">Asistente Cintax</text>

      {/* Status - animated */}
      {children}

      {/* Input bar */}
      <rect x={4} y={456} width={272} height={36} fill={C.header} />
      <rect x={14} y={463} width={210} height={22} rx={11} fill="#2A3942" />
      <text x={26} y={478} fontSize={8} fill={C.textMuted} fontFamily="system-ui">Escribe un mensaje...</text>
      <circle cx={244} cy={474} r={12} fill={C.green} />
      <path d="M239 474 L249 474 M244 469 L249 474 L244 479" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  );
}

/* ── Main Composition ── */

interface WhatsAppDemoProps {
  readonly variant?: string;
  [key: string]: unknown;
}

export const WhatsAppDemo: React.FC<WhatsAppDemoProps> = () => {
  const frame = useCurrentFrame();
  // Calculate bubble Y positions based on visible messages
  const visibleMessages = MESSAGES.filter((m) => frame >= m.startFrame);
  const bubbleYPositions: number[] = [];
  let nextY = 90;
  for (const msg of MESSAGES) {
    bubbleYPositions.push(nextY);
    const lines = msg.text ? msg.text.split("\n") : [];
    const textHeight = lines.length * 14;
    const bubbleHeight = msg.hasPDF ? 56 : Math.max(28, textHeight + 20);
    nextY += bubbleHeight + 8;
  }

  // Scroll offset when messages overflow
  const totalHeight = nextY - 90;
  const viewHeight = 360;
  const scrollNeeded = Math.max(0, totalHeight - viewHeight + 40);
  const scrollProgress = interpolate(
    frame,
    [MESSAGES[2]?.startFrame ?? 130, MESSAGES[4]?.startFrame ?? 240],
    [0, scrollNeeded],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Determine if agent is "typing"
  const isTyping = MESSAGES.some((m) => {
    if (m.role !== "agent") return false;
    const typingStart = m.startFrame - 30;
    const typingEnd = m.startFrame;
    return frame >= typingStart && frame < typingEnd;
  });

  const statusOpacity = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [0.5, 1]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={400} height={540} viewBox="0 0 400 540">
        <defs>
          <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.goldDark} />
          </linearGradient>
          <linearGradient id="goldPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.gold} />
            <stop offset="50%" stopColor={C.purple} />
            <stop offset="100%" stopColor={C.gold} />
          </linearGradient>
          <clipPath id="chatClip">
            <rect x={64} y={84} width={272} height={368} />
          </clipPath>
        </defs>

        {/* Background particles */}
        <Particles frame={frame} />

        <PhoneFrame frame={frame}>
          {/* Header status */}
          <text
            x={58}
            y={64}
            fontSize={8}
            fill={isTyping ? C.green : C.textMuted}
            fontFamily="system-ui"
            opacity={isTyping ? statusOpacity : 0.8}
          >
            {isTyping ? "escribiendo..." : "en línea"}
          </text>

          {/* Chat messages - clipped to chat area */}
          <g clipPath="url(#chatClip)">
            {/* Date chip */}
            <Sequence from={0}>
              <g>
                <rect x={140} y={90 - scrollProgress} width={50} height={16} rx={4} fill="#182229" />
                <text x={165} y={101 - scrollProgress} textAnchor="middle" fontSize={7} fill={C.textMuted} fontFamily="system-ui">Hoy</text>
              </g>
            </Sequence>

            {/* Messages */}
            <g transform={`translate(0, ${-scrollProgress})`}>
              {MESSAGES.map((msg, i) => (
                <Bubble
                  key={i}
                  msg={msg}
                  frame={frame}
                  y={bubbleYPositions[i] + 20}
                />
              ))}
            </g>

            {/* Typing indicator */}
            {isTyping && (
              <TypingDots
                frame={frame}
                x={88}
                y={bubbleYPositions[visibleMessages.length] + 20 - scrollProgress}
              />
            )}
          </g>
        </PhoneFrame>

        {/* Side decorative elements */}
        {/* Gold accent line left */}
        <rect
          x={30}
          y={interpolate(frame, [0, 350], [100, 380], { extrapolateRight: "clamp" })}
          width={2}
          height={60}
          rx={1}
          fill={C.gold}
          opacity={0.15}
        />

        {/* Purple accent dot */}
        <circle
          cx={370}
          cy={200 + Math.sin(frame * 0.05) * 20}
          r={3}
          fill={C.purple}
          opacity={0.2}
        />
      </svg>
    </AbsoluteFill>
  );
};
