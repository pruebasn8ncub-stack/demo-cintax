import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

/* ── Colors ── */
const C = {
  bg: "#0B1120",
  phoneBg: "#0B141A",
  header: "#1F2C34",
  bubbleAgent: "#1F2C34",
  bubbleUser: "#005C4B",
  gold: "#F59E0B",
  goldDark: "#D97706",
  purple: "#8B5CF6",
  green: "#25D366",
  greenCheck: "#53BDEB",
  text: "#E9EDEF",
  textMuted: "#8696A0",
};

/* ── Phone dimensions ── */
const PHONE = {
  x: 50,
  y: 15,
  w: 300,
  h: 530,
  r: 34,
  innerPad: 5,
  headerH: 50,
  inputH: 40,
  notchH: 20,
};

const CHAT_TOP = PHONE.y + PHONE.innerPad + PHONE.notchH + PHONE.headerH + 4;
const CHAT_BOTTOM = PHONE.y + PHONE.h - PHONE.innerPad - PHONE.inputH - 4;
const CHAT_LEFT = PHONE.x + PHONE.innerPad + 8;
const CHAT_WIDTH = PHONE.w - PHONE.innerPad * 2 - 16;

/* ── Message data ── */
interface MsgData {
  role: "user" | "agent";
  lines: string[];
  startFrame: number;
  hasPDF?: boolean;
}

const MESSAGES: MsgData[] = [
  { role: "user", lines: ["Necesito el informe", "tributario de marzo"], startFrame: 25 },
  { role: "agent", lines: ["Generando tu informe", "tributario de marzo 2026..."], startFrame: 75 },
  { role: "agent", lines: [], startFrame: 140, hasPDF: true },
  { role: "agent", lines: ["IVA: $3.068.500", "PPM: $398.500", "Total F29: $3.712.000"], startFrame: 185 },
  { role: "user", lines: ["Envíalo por email"], startFrame: 250 },
  { role: "agent", lines: ["✓ Enviado a pedro@", "donpedro.cl con firma", "de Cintax Consultores"], startFrame: 300 },
];

function getBubbleHeight(msg: MsgData): number {
  if (msg.hasPDF) return 52;
  return Math.max(26, msg.lines.length * 14 + 18);
}

/* ── Typing dots ── */
function TypingDots({ frame, x, y }: { frame: number; x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={48} height={22} rx={11} fill={C.bubbleAgent} />
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin(frame * 0.35 + i * 1.2) * 2.5;
        return (
          <circle key={i} cx={x + 13 + i * 9} cy={y + 11 + bounce} r={2.5} fill={C.textMuted} />
        );
      })}
    </g>
  );
}

/* ── PDF Card ── */
function PDFCard({ frame, startFrame, x, y }: { frame: number; startFrame: number; x: number; y: number }) {
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 14, stiffness: 100 } });
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const glowOpacity = interpolate(Math.sin((frame - startFrame) * 0.12), [-1, 1], [0.1, 0.35]);

  const cardW = CHAT_WIDTH * 0.72;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Glow */}
      <rect x={-2} y={-2} width={cardW + 4} height={42} rx={9} fill={C.gold} opacity={glowOpacity} />
      {/* Card */}
      <rect x={0} y={0} width={cardW} height={38} rx={7} fill="#0F172A" stroke={C.gold} strokeWidth={0.8} strokeOpacity={0.4} />
      {/* Icon */}
      <rect x={6} y={6} width={26} height={26} rx={5} fill={C.gold} />
      <text x={11} y={23} fontSize={9} fontWeight="bold" fill="#0F172A" fontFamily="system-ui">PDF</text>
      {/* Text */}
      <text x={38} y={17} fontSize={8} fill={C.text} fontFamily="system-ui">Informe_Tributario</text>
      <text x={38} y={29} fontSize={6.5} fill={C.textMuted} fontFamily="system-ui">Marzo_2026.pdf · 3.2 KB</text>
      {/* Accent */}
      <rect x={0} y={36} width={cardW} height={2} rx={1} fill="url(#goldPurple)" />
    </g>
  );
}

/* ── Bubble ── */
function Bubble({ msg, frame, y }: { msg: MsgData; frame: number; y: number }) {
  const { fps } = useVideoConfig();
  const localFrame = frame - msg.startFrame;
  if (localFrame < 0) return null;

  const progress = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 90 } });
  const slideY = interpolate(progress, [0, 1], [14, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const isUser = msg.role === "user";
  const bubbleW = isUser ? CHAT_WIDTH * 0.65 : CHAT_WIDTH * 0.75;
  const bubbleH = getBubbleHeight(msg);
  const bubbleX = isUser ? CHAT_LEFT + CHAT_WIDTH - bubbleW : CHAT_LEFT;

  return (
    <g transform={`translate(0, ${y + slideY})`} opacity={opacity}>
      {/* Bubble bg */}
      <rect x={bubbleX} y={0} width={bubbleW} height={bubbleH} rx={10} fill={isUser ? C.bubbleUser : C.bubbleAgent} />

      {/* PDF */}
      {msg.hasPDF && <PDFCard frame={frame} startFrame={msg.startFrame + 5} x={bubbleX + 6} y={4} />}

      {/* Text lines */}
      {msg.lines.map((line, i) => (
        <text
          key={i}
          x={bubbleX + 10}
          y={14 + i * 14}
          fontSize={9.5}
          fill={C.text}
          fontFamily="system-ui"
        >
          {line}
        </text>
      ))}

      {/* Time + checks */}
      <text
        x={bubbleX + bubbleW - 6}
        y={bubbleH - 4}
        textAnchor="end"
        fontSize={6.5}
        fill={C.textMuted}
        opacity={0.5}
        fontFamily="system-ui"
      >
        12:34
      </text>
      {isUser && (
        <g transform={`translate(${bubbleX + bubbleW - 1}, ${bubbleH - 10})`}>
          <path d="M-5 0 L-3 2 L2 -3" fill="none" stroke={C.greenCheck} strokeWidth={1} strokeLinecap="round" />
          <path d="M-2 0 L0 2 L5 -3" fill="none" stroke={C.greenCheck} strokeWidth={1} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/* ── Particles ── */
function Particles({ frame }: { frame: number }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const x = 30 + (i * 41) % 340;
        const baseY = 40 + (i * 61) % 480;
        const y = baseY + Math.sin(frame * 0.04 + i * 1.5) * 6;
        const o = 0.08 + Math.sin(frame * 0.03 + i) * 0.05;
        const r = 1 + (i % 3) * 0.4;
        return <circle key={i} cx={x} cy={y} r={r} fill={C.gold} opacity={o} />;
      })}
    </g>
  );
}

/* ── Main ── */

interface WhatsAppDemoProps {
  readonly variant?: string;
  [key: string]: unknown;
}

export const WhatsAppDemo: React.FC<WhatsAppDemoProps> = () => {
  const frame = useCurrentFrame();

  // Bubble Y positions
  const yPositions: number[] = [];
  let nextY = 0;
  for (const msg of MESSAGES) {
    yPositions.push(nextY);
    nextY += getBubbleHeight(msg) + 6;
  }

  // Scroll when content overflows
  const visibleHeight = CHAT_BOTTOM - CHAT_TOP;
  const totalContentH = nextY;
  const overflow = Math.max(0, totalContentH - visibleHeight + 30);
  const scrollY = interpolate(
    frame,
    [MESSAGES[2].startFrame, MESSAGES[5].startFrame + 15],
    [0, overflow],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Is typing?
  const isTyping = MESSAGES.some((m) => {
    if (m.role !== "agent") return false;
    return frame >= m.startFrame - 25 && frame < m.startFrame;
  });

  // Visible messages for typing Y
  const visibleCount = MESSAGES.filter((m) => frame >= m.startFrame).length;

  // Float
  const floatY = Math.sin(frame * 0.035) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={400} height={560} viewBox="0 0 400 560">
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
            <rect x={PHONE.x} y={CHAT_TOP} width={PHONE.w} height={CHAT_BOTTOM - CHAT_TOP} rx={4} />
          </clipPath>
        </defs>

        {/* Background particles */}
        <Particles frame={frame} />

        <g transform={`translate(0, ${floatY})`}>
          {/* Phone shadow */}
          <ellipse cx={PHONE.x + PHONE.w / 2} cy={PHONE.y + PHONE.h + 8} rx={100} ry={8} fill={C.gold} opacity={0.04} />

          {/* Phone border */}
          <rect x={PHONE.x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={PHONE.r} fill="#1E1E2E" />
          {/* Screen */}
          <rect
            x={PHONE.x + PHONE.innerPad}
            y={PHONE.y + PHONE.innerPad}
            width={PHONE.w - PHONE.innerPad * 2}
            height={PHONE.h - PHONE.innerPad * 2}
            rx={PHONE.r - 4}
            fill={C.phoneBg}
          />

          {/* Notch */}
          <rect
            x={PHONE.x + PHONE.w / 2 - 45}
            y={PHONE.y + 8}
            width={90}
            height={PHONE.notchH}
            rx={10}
            fill="#111827"
          />

          {/* Header */}
          <rect
            x={PHONE.x + PHONE.innerPad}
            y={PHONE.y + PHONE.innerPad + PHONE.notchH + 2}
            width={PHONE.w - PHONE.innerPad * 2}
            height={PHONE.headerH}
            fill={C.header}
          />
          {/* Avatar */}
          <circle
            cx={PHONE.x + PHONE.innerPad + 22}
            cy={PHONE.y + PHONE.innerPad + PHONE.notchH + 2 + PHONE.headerH / 2}
            r={14}
            fill="url(#avatarGrad)"
          />
          <text
            x={PHONE.x + PHONE.innerPad + 16}
            y={PHONE.y + PHONE.innerPad + PHONE.notchH + 2 + PHONE.headerH / 2 + 4}
            fontSize={10}
            fontWeight="bold"
            fill="#0F172A"
            fontFamily="system-ui"
          >
            CX
          </text>
          {/* Online dot */}
          <circle
            cx={PHONE.x + PHONE.innerPad + 32}
            cy={PHONE.y + PHONE.innerPad + PHONE.notchH + 2 + PHONE.headerH / 2 + 10}
            r={4}
            fill={C.green}
            stroke={C.header}
            strokeWidth={2}
          />
          {/* Name + status */}
          <text
            x={PHONE.x + PHONE.innerPad + 44}
            y={PHONE.y + PHONE.innerPad + PHONE.notchH + 2 + PHONE.headerH / 2 - 2}
            fontSize={12}
            fontWeight="600"
            fill={C.text}
            fontFamily="system-ui"
          >
            Asistente Cintax
          </text>
          <text
            x={PHONE.x + PHONE.innerPad + 44}
            y={PHONE.y + PHONE.innerPad + PHONE.notchH + 2 + PHONE.headerH / 2 + 12}
            fontSize={9}
            fill={isTyping ? C.green : C.textMuted}
            fontFamily="system-ui"
            opacity={isTyping ? interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1]) : 0.8}
          >
            {isTyping ? "escribiendo..." : "en línea"}
          </text>

          {/* Chat area - clipped */}
          <g clipPath="url(#chatClip)">
            {/* Date chip */}
            <rect x={PHONE.x + PHONE.w / 2 - 22} y={CHAT_TOP + 6 - scrollY} width={44} height={16} rx={4} fill="#182229" />
            <text
              x={PHONE.x + PHONE.w / 2}
              y={CHAT_TOP + 17 - scrollY}
              textAnchor="middle"
              fontSize={7.5}
              fill={C.textMuted}
              fontFamily="system-ui"
            >
              Hoy
            </text>

            {/* Messages */}
            <g transform={`translate(0, ${CHAT_TOP + 28 - scrollY})`}>
              {MESSAGES.map((msg, i) => (
                <Bubble key={i} msg={msg} frame={frame} y={yPositions[i]} />
              ))}
            </g>

            {/* Typing indicator */}
            {isTyping && (
              <TypingDots
                frame={frame}
                x={CHAT_LEFT}
                y={CHAT_TOP + 28 + yPositions[Math.min(visibleCount, MESSAGES.length - 1)] - scrollY}
              />
            )}
          </g>

          {/* Input bar */}
          <rect
            x={PHONE.x + PHONE.innerPad}
            y={PHONE.y + PHONE.h - PHONE.innerPad - PHONE.inputH}
            width={PHONE.w - PHONE.innerPad * 2}
            height={PHONE.inputH}
            fill={C.header}
          />
          <rect
            x={PHONE.x + PHONE.innerPad + 10}
            y={PHONE.y + PHONE.h - PHONE.innerPad - PHONE.inputH + 9}
            width={PHONE.w - PHONE.innerPad * 2 - 56}
            height={22}
            rx={11}
            fill="#2A3942"
          />
          <text
            x={PHONE.x + PHONE.innerPad + 22}
            y={PHONE.y + PHONE.h - PHONE.innerPad - PHONE.inputH + 24}
            fontSize={8}
            fill={C.textMuted}
            fontFamily="system-ui"
          >
            Escribe un mensaje...
          </text>
          {/* Send button */}
          <circle
            cx={PHONE.x + PHONE.w - PHONE.innerPad - 22}
            cy={PHONE.y + PHONE.h - PHONE.innerPad - PHONE.inputH + 20}
            r={12}
            fill={C.green}
          />
          <path
            d={`M${PHONE.x + PHONE.w - PHONE.innerPad - 27} ${PHONE.y + PHONE.h - PHONE.innerPad - PHONE.inputH + 20} L${PHONE.x + PHONE.w - PHONE.innerPad - 17} ${PHONE.y + PHONE.h - PHONE.innerPad - PHONE.inputH + 20}`}
            fill="none"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Bottom bar */}
          <rect
            x={PHONE.x + PHONE.w / 2 - 30}
            y={PHONE.y + PHONE.h - 8}
            width={60}
            height={3}
            rx={1.5}
            fill="#333"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
