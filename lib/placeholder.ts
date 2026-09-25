// Draws the placeholder product image as an SVG string: the product's
// silhouette in its colorway, on a soft studio-style background.

import type { Product, Silhouette } from "./catalog";

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function mix(hex: string, base: [number, number, number], amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return `rgb(${c.map((v, i) => Math.round(v * amount + base[i] * (1 - amount))).join(",")})`;
}

const OUTLINE = `stroke="#000" stroke-opacity="0.14" stroke-width="2" stroke-linejoin="round"`;

function shoe(s: Silhouette, p: string, a: string, sole: string) {
  const uppers: Partial<Record<Silhouette, string>> = {
    low: "M70 282 L72 246 Q78 214 118 206 L172 174 Q188 165 206 170 L252 190 Q300 205 335 217 Q356 226 354 260 L354 282 Z",
    court: "M70 286 L72 250 Q78 220 118 212 L172 182 Q188 173 206 178 L252 196 Q300 210 335 220 Q356 229 354 262 L354 286 Z",
    trainer: "M70 282 L72 244 Q78 212 118 204 L172 172 Q188 163 206 168 L252 188 Q300 203 335 215 Q356 224 354 258 L354 282 Z",
    chunky: "M70 262 L72 226 Q78 192 120 184 L172 152 Q190 142 210 148 L256 170 Q304 184 338 196 Q358 206 356 240 L356 262 Z",
    slipon: "M70 284 L72 256 Q80 230 122 226 Q200 220 262 210 Q322 204 346 226 Q357 238 355 266 L355 284 Z",
    boot: "M82 284 L84 150 Q86 128 112 126 L190 124 Q206 124 207 140 L211 200 Q290 210 332 222 Q357 232 355 264 L355 284 Z",
    runner: "M64 270 Q66 234 110 220 L182 180 Q198 170 216 178 L262 198 Q312 208 344 220 Q362 230 356 256 L352 270 Z",
    trail: "M66 268 Q68 232 112 218 L182 180 Q198 170 216 178 L262 198 Q312 208 344 220 Q362 230 356 254 L352 268 Z",
    racer: "M62 272 Q66 244 112 232 L186 196 Q202 188 220 194 L270 212 Q318 220 346 230 Q362 238 356 260 L350 272 Z",
  };
  const upper = uppers[s]!;
  const soleTop = { low: 282, court: 286, trainer: 282, chunky: 262, slipon: 284, boot: 284, runner: 270, trail: 268, racer: 272 }[s as "low"];
  const soleH = { low: 24, court: 16, trainer: 20, chunky: 48, slipon: 18, boot: 26, runner: 34, trail: 34, racer: 26 }[s as "low"];
  const parts: string[] = [];
  parts.push(`<path d="${upper}" fill="${p}" ${OUTLINE}/>`);

  // accent details
  if (s === "slipon") {
    parts.push(`<path d="M160 226 Q176 214 196 222 L196 236 Q176 230 160 238 Z" fill="${a}" opacity="0.9"/>`);
  } else if (s === "boot") {
    parts.push(`<path d="M84 150 L84 196 L207 196 L206 150 Q150 142 84 150 Z" fill="${a}" opacity="0.35"/>`);
    for (let i = 0; i < 5; i++) parts.push(`<line x1="${176 + i * 3}" y1="${138 + i * 16}" x2="${204}" y2="${142 + i * 16}" stroke="#fff" stroke-opacity="0.8" stroke-width="5" stroke-linecap="round"/>`);
  } else {
    const lift = s === "chunky" ? -20 : s === "court" ? 4 : s === "racer" ? 8 : 0;
    parts.push(`<path d="M112 ${258 + lift} Q210 ${246 + lift} 328 ${220 + lift} Q250 ${262 + lift} 140 ${270 + lift} Z" fill="${a}"/>`);
    parts.push(`<path d="M70 ${246 + lift} L70 ${soleTop} L92 ${soleTop} L94 ${240 + lift} Z" fill="${a}" opacity="0.9"/>`);
    for (let i = 0; i < 4; i++) {
      const x = 180 + i * 17;
      const y = 176 + lift + i * 8;
      parts.push(`<line x1="${x}" y1="${y}" x2="${x + 22}" y2="${y + 11}" stroke="#fff" stroke-opacity="0.85" stroke-width="5" stroke-linecap="round"/>`);
    }
    if (s === "trainer") parts.push(`<path d="M190 188 L236 206 L226 262 L176 262 Z" fill="${a}" opacity="0.55"/>`);
    if (s === "trail") parts.push(`<path d="M300 212 Q352 222 354 256 L326 256 Q322 230 300 222 Z" fill="${a}" opacity="0.7"/>`);
    if (s === "chunky") parts.push(`<path d="M120 184 L172 152 L200 200 L130 232 Z" fill="#fff" opacity="0.22"/>`);
    if (s === "court") for (let i = 0; i < 6; i++) parts.push(`<circle cx="${300 + (i % 3) * 12}" cy="${228 + Math.floor(i / 3) * 12}" r="2.5" fill="#000" opacity="0.2"/>`);
  }

  // sole
  const rx = s === "chunky" || s === "runner" || s === "trail" ? 16 : 8;
  parts.push(`<rect x="60" y="${soleTop}" width="300" height="${soleH}" rx="${rx}" fill="${sole}" ${OUTLINE}/>`);
  if (s === "chunky") parts.push(`<path d="M64 ${soleTop + 22} Q140 ${soleTop + 12} 210 ${soleTop + 24} T356 ${soleTop + 18}" fill="none" stroke="${a}" stroke-width="5" opacity="0.6"/>`);
  if (s === "runner" || s === "racer") parts.push(`<rect x="64" y="${soleTop + soleH - 9}" width="292" height="7" rx="3.5" fill="${a}" opacity="0.8"/>`);
  if (s === "trail" || s === "boot") for (let i = 0; i < 12; i++) parts.push(`<rect x="${70 + i * 24}" y="${soleTop + soleH - 4}" width="14" height="10" rx="2" fill="#2a2a2a"/>`);
  return parts.join("");
}

function garment(s: Silhouette, p: string, a: string) {
  switch (s) {
    case "tee":
      return `<path d="M140 90 L80 120 L102 176 L132 162 L132 320 L268 320 L268 162 L298 176 L320 120 L260 90 Q200 116 140 90 Z" fill="${p}" ${OUTLINE}/>
        <path d="M172 96 Q200 114 228 96" fill="none" stroke="${a}" stroke-width="6"/><circle cx="238" cy="150" r="8" fill="${a}"/>`;
    case "hoodie":
    case "sweat":
      return `<path d="M140 92 L100 110 L62 262 L96 272 L126 180 L126 322 L274 322 L274 180 L304 272 L338 262 L300 110 L260 92 Q200 118 140 92 Z" fill="${p}" ${OUTLINE}/>
        ${s === "hoodie" ? `<path d="M148 94 Q200 34 252 94 Q200 128 148 94 Z" fill="${p}" ${OUTLINE}/><line x1="188" y1="112" x2="186" y2="160" stroke="${a}" stroke-width="4"/><line x1="212" y1="112" x2="214" y2="160" stroke="${a}" stroke-width="4"/>` : `<path d="M176 94 L200 116 L224 94" fill="none" stroke="${a}" stroke-width="6"/>`}
        <rect x="126" y="306" width="148" height="16" fill="${a}" opacity="0.35"/><circle cx="200" cy="190" r="12" fill="${a}"/>`;
    case "jacket":
      return `<path d="M140 88 L100 106 L62 262 L96 272 L126 180 L126 322 L274 322 L274 180 L304 272 L338 262 L300 106 L260 88 Q200 110 140 88 Z" fill="${p}" ${OUTLINE}/>
        <path d="M150 88 L176 70 L224 70 L250 88 L200 104 Z" fill="${a}" ${OUTLINE}/>
        <line x1="200" y1="104" x2="200" y2="322" stroke="${a}" stroke-width="5"/>
        <path d="M100 106 L62 262 L76 266 L112 112 Z" fill="${a}" opacity="0.8"/><path d="M300 106 L338 262 L324 266 L288 112 Z" fill="${a}" opacity="0.8"/>`;
    case "pant":
      return `<path d="M136 70 L264 70 L282 330 L218 330 L200 150 L182 330 L118 330 Z" fill="${p}" ${OUTLINE}/>
        <rect x="136" y="70" width="128" height="18" fill="${a}" opacity="0.85"/>
        <path d="M130 90 L118 330 L128 330 L140 92 Z" fill="${a}" opacity="0.8"/><path d="M270 90 L282 330 L272 330 L260 92 Z" fill="${a}" opacity="0.8"/>`;
    case "shorts":
      return `<path d="M126 120 L274 120 L296 262 L214 272 L200 190 L186 272 L104 262 Z" fill="${p}" ${OUTLINE}/>
        <rect x="126" y="120" width="148" height="20" fill="${a}" opacity="0.85"/><rect x="236" y="180" width="26" height="36" rx="4" fill="#000" opacity="0.12"/>`;
    case "socks":
      return [0, 1, 2]
        .map((i) => {
          const x = 110 + i * 60;
          return `<path d="M${x} 90 L${x + 48} 90 L${x + 48} 250 Q${x + 48} 300 ${x + 96} 304 Q${x + 110} 320 ${x + 90} 332 L${x + 30} 332 Q${x} 328 ${x} 290 Z" fill="${i === 1 ? a : p}" ${OUTLINE}/><rect x="${x}" y="90" width="48" height="26" fill="#000" opacity="0.08"/>`;
        })
        .join("");
    case "cap":
      return `<path d="M100 230 Q104 120 200 112 Q296 120 300 230 Z" fill="${p}" ${OUTLINE}/>
        <path d="M280 226 Q330 222 356 250 Q320 258 280 250 Z" fill="${p}" ${OUTLINE}/>
        <line x1="200" y1="114" x2="200" y2="228" stroke="#000" stroke-opacity="0.12" stroke-width="2"/><circle cx="200" cy="112" r="6" fill="${p}" ${OUTLINE}/>
        <circle cx="240" cy="180" r="12" fill="${a}"/>`;
    case "tote":
      return `<path d="M150 150 Q150 80 200 80 Q250 80 250 150" fill="none" stroke="${a}" stroke-width="10"/>
        <path d="M110 140 L290 140 L306 320 L94 320 Z" fill="${p}" ${OUTLINE}/><circle cx="200" cy="230" r="14" fill="${a}"/>`;
    case "backpack":
      return `<rect x="120" y="90" width="160" height="236" rx="40" fill="${p}" ${OUTLINE}/>
        <rect x="142" y="210" width="116" height="90" rx="18" fill="${a}" opacity="0.8"/><path d="M170 90 Q170 60 200 60 Q230 60 230 90" fill="none" stroke="${a}" stroke-width="8"/>
        <line x1="150" y1="150" x2="250" y2="150" stroke="#000" stroke-opacity="0.15" stroke-width="3"/>`;
    case "crossbody":
      return `<path d="M100 80 Q200 20 300 80 L300 190" fill="none" stroke="${a}" stroke-width="10"/>
        <rect x="100" y="170" width="200" height="120" rx="36" fill="${p}" ${OUTLINE}/><line x1="120" y1="206" x2="280" y2="206" stroke="${a}" stroke-width="5"/>`;
    case "kit":
      return `<rect x="96" y="150" width="208" height="150" rx="10" fill="${p}" ${OUTLINE}/><rect x="96" y="150" width="208" height="36" fill="${a}" opacity="0.85"/>
        <rect x="126" y="96" width="44" height="80" rx="8" fill="${a}" ${OUTLINE}/><rect x="190" y="118" width="84" height="30" rx="8" fill="#7a4f2c" ${OUTLINE}/>`;
    case "blanket":
      return `<path d="M90 110 L310 110 L310 290 L90 290 Z" fill="${p}" ${OUTLINE}/>
        ${[0, 1, 2, 3].map((i) => `<line x1="90" y1="${140 + i * 40}" x2="310" y2="${140 + i * 40}" stroke="${a}" stroke-width="4" opacity="0.6"/>`).join("")}
        ${Array.from({ length: 12 }, (_, i) => `<line x1="${96 + i * 19}" y1="290" x2="${96 + i * 19}" y2="306" stroke="${p}" stroke-width="3"/>`).join("")}
        <circle cx="200" cy="200" r="16" fill="${a}"/>`;
    default:
      return "";
  }
}

const SHOES: Silhouette[] = ["low", "chunky", "slipon", "court", "boot", "runner", "trail", "trainer", "racer"];

export function productSvg(product: Product): string {
  const { primary, secondary } = product.swatch;
  const light = luminance(primary) > 0.82;
  const bg = light ? "#e6e2d9" : mix(primary, [242, 240, 235], 0.12);
  const sole = luminance(primary) < 0.2 && luminance(secondary) < 0.3 ? "#1b1b1b" : "#f4f1ea";
  const body = SHOES.includes(product.silhouette)
    ? shoe(product.silhouette, primary, secondary, sole)
    : garment(product.silhouette, primary, secondary);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
<rect width="400" height="400" fill="${bg}"/>
<ellipse cx="205" cy="${SHOES.includes(product.silhouette) ? 318 : 346}" rx="150" ry="12" fill="#000" opacity="0.07"/>
${body}
</svg>`;
}
