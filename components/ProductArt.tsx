// Illustrated product "photos". We have no real photography, so each product is
// drawn as a simple SVG silhouette in its colorway. Swap for real images later.

import type { Colorway, ProductType } from "@/lib/catalog";

export function ProductArt({
  type,
  color,
  className = "",
}: {
  type: ProductType;
  color: Colorway;
  className?: string;
}) {
  const bg = tint(color.hex);
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-hidden="true">
      <rect width="400" height="400" fill={bg} />
      <ellipse cx="200" cy="318" rx="150" ry="14" fill="#000" opacity="0.08" />
      {isShoe(type) ? <Shoe type={type} color={color} /> : <Garment type={type} color={color} />}
    </svg>
  );
}

function isShoe(type: ProductType) {
  return type === "court" || type === "runner" || type === "high-top";
}

function Shoe({ type, color }: { type: ProductType; color: Colorway }) {
  const upper =
    type === "high-top"
      ? "M70 290 L70 250 Q72 200 110 180 L150 110 Q160 92 185 95 L215 100 Q228 104 226 122 L220 175 Q260 196 310 214 Q345 226 345 262 L345 290 Z"
      : type === "runner"
        ? "M60 290 L62 250 Q70 210 115 200 L165 160 Q180 150 200 156 L240 180 Q290 200 330 214 Q352 224 350 262 L350 290 Z"
        : "M60 290 L60 252 Q64 216 110 208 L160 176 Q176 166 196 170 L240 190 Q296 206 332 218 Q352 226 350 262 L350 290 Z";
  const soleHeight = type === "runner" ? 34 : 24;
  return (
    <g>
      <path d={upper} fill={color.hex} stroke="#000" strokeOpacity="0.15" strokeWidth="2" />
      {/* swoosh-like accent stripe */}
      <path
        d={
          type === "high-top"
            ? "M110 262 Q190 250 300 220 Q230 262 140 272 Z"
            : "M110 262 Q200 252 320 224 Q240 266 140 274 Z"
        }
        fill={color.accent}
      />
      {/* heel tab */}
      <path d="M60 252 L60 290 L80 290 L82 246 Z" fill={color.accent} opacity="0.9" />
      {/* laces */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={type === "high-top" ? 160 + i * 14 : 175 + i * 16}
          y1={type === "high-top" ? 130 + i * 18 : 178 + i * 8}
          x2={type === "high-top" ? 185 + i * 14 : 198 + i * 16}
          y2={type === "high-top" ? 140 + i * 18 : 190 + i * 8}
          stroke="#fff"
          strokeOpacity="0.85"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      <rect x="56" y={290} width="298" height={soleHeight} rx="10" fill={type === "runner" ? "#fafafa" : "#efece4"} stroke="#000" strokeOpacity="0.12" strokeWidth="2" />
      <rect x="56" y={290 + soleHeight - 8} width="298" height="8" rx="4" fill={color.accent} opacity="0.5" />
    </g>
  );
}

function Garment({ type, color }: { type: ProductType; color: Colorway }) {
  if (type === "pant") {
    return (
      <g>
        <path
          d="M140 70 L260 70 L275 310 L215 310 L200 150 L185 310 L125 310 Z"
          fill={color.hex}
          stroke="#000"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
        <rect x="140" y="70" width="120" height="18" fill={color.accent} opacity="0.8" />
        <rect x="128" y="190" width="30" height="40" rx="4" fill="#000" opacity="0.1" />
        <rect x="242" y="190" width="30" height="40" rx="4" fill="#000" opacity="0.1" />
      </g>
    );
  }
  const longSleeve = type === "hoodie" || type === "jacket";
  const body = longSleeve
    ? "M140 80 L100 100 L60 250 L95 262 L125 170 L125 320 L275 320 L275 170 L305 262 L340 250 L300 100 L260 80 Q200 110 140 80 Z"
    : "M140 80 L80 110 L100 165 L130 150 L130 320 L270 320 L270 150 L300 165 L320 110 L260 80 Q200 108 140 80 Z";
  return (
    <g>
      <path d={body} fill={color.hex} stroke="#000" strokeOpacity="0.15" strokeWidth="2" />
      {type === "hoodie" && <path d="M150 82 Q200 30 250 82 Q200 120 150 82 Z" fill={color.hex} stroke="#000" strokeOpacity="0.2" strokeWidth="2" />}
      {type === "jacket" && <line x1="200" y1="96" x2="200" y2="320" stroke={color.accent} strokeWidth="4" />}
      {type === "tee" && <path d="M170 86 Q200 104 230 86" fill="none" stroke={color.accent} strokeWidth="6" />}
      <circle cx="200" cy="170" r="16" fill={color.accent} opacity="0.9" />
      <rect x={longSleeve ? 125 : 130} y="306" width={longSleeve ? 150 : 140} height="14" fill={color.accent} opacity="0.35" />
    </g>
  );
}

// Very light background tint derived from the product color.
function tint(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c * 0.12 + 240 * 0.88);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
