// 自作SVG模式図のHTML文字列を一元管理する単一の真実源（SSOT）。
// React版（App.tsx の {{figure:KEY}} 展開）と prerender（scripts/prerender.ts）の双方がここを使い、
// 二重レンダラの食い違い（生タグ露出）を防ぐ。
// テーマ：藍鼠の夜空(#34495e) × 茜(#c0613f) × 四季色（春緑/夏青/秋茜/冬藍）。

const BG = '#f5f2ea';
const AI = '#34495e';
const AI_DEEP = '#243140';
const GOLD = '#b8902e';
const INK = '#2b3038';
const HARU = '#7faa5a';
const NATSU = '#3f8fb0';
const AKI = '#c0613f';
const FUYU = '#6d7f96';

// 0度=真上、時計回り。deg→座標
function pol(cx: number, cy: number, rad: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + rad * Math.sin(a), cy - rad * Math.cos(a)];
}

// 1) 季節リング（黄道を一周する太陽と二十四節気・四季）
function sekkiRingSvg(): string {
  const cx = 150, cy = 96, R = 74, r = 46;
  const ringArc = (a0: number, a1: number, color: string) => {
    const [ox0, oy0] = pol(cx, cy, R, a0);
    const [ox1, oy1] = pol(cx, cy, R, a1);
    const [ix1, iy1] = pol(cx, cy, r, a1);
    const [ix0, iy0] = pol(cx, cy, r, a0);
    return `<path d="M${ox0.toFixed(1)} ${oy0.toFixed(1)} A${R} ${R} 0 0 1 ${ox1.toFixed(1)} ${oy1.toFixed(1)} L${ix1.toFixed(1)} ${iy1.toFixed(1)} A${r} ${r} 0 0 0 ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z" fill="${color}"/>`;
  };
  // 四季の弧（立春315→立夏45=春、以下夏秋冬）
  const arcs = ringArc(315, 45, HARU) + ringArc(45, 135, NATSU) + ringArc(135, 225, AKI) + ringArc(225, 315, FUYU);
  // 24本の目盛り（15度ごと）
  let ticks = '';
  for (let d = 0; d < 360; d += 15) {
    const [x0, y0] = pol(cx, cy, r, d);
    const [x1, y1] = pol(cx, cy, R, d);
    const major = d % 90 === 0;
    ticks += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${BG}" stroke-width="${major ? 2.4 : 1}"/>`;
  }
  // 二至二分のラベル
  const label = (deg: number, t: string) => {
    const [lx, ly] = pol(cx, cy, R + 14, deg);
    return `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" font-size="10" font-weight="700" fill="${AI_DEEP}" text-anchor="middle">${t}</text>`;
  };
  // 太陽（春分の位置に置く）
  const [sx, sy] = pol(cx, cy, R, 0);
  return (
    `<svg class="diagram-single" viewBox="0 0 300 200" width="100%" role="img" aria-label="太陽が黄道を一周し二十四節気と四季が巡る季節リングの図">` +
    `<rect width="300" height="200" fill="${BG}"/>` +
    arcs + ticks +
    `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="${BG}"/>` +
    label(0, '春分') + label(90, '夏至') + label(180, '秋分') + label(270, '冬至') +
    `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="6" fill="${GOLD}" stroke="${BG}" stroke-width="1.5"/>` +
    `<text x="${cx}" y="${cy - 4}" font-size="11" font-weight="700" fill="${AI_DEEP}" text-anchor="middle">太陽の通り道</text>` +
    `<text x="${cx}" y="${cy + 12}" font-size="10" fill="${INK}" text-anchor="middle">（黄道）を24等分</text>` +
    `</svg>`
  );
}

// 2) 七十二候の構造（節気1つ→初候・次候・末候）
function kouStructureSvg(): string {
  const y = 60, h = 34, x0 = 24, w = 252;
  const seg = (i: number, color: string, label: string) => {
    const sw = w / 3;
    const x = x0 + i * sw;
    return `<rect x="${x}" y="${y}" width="${sw - 4}" height="${h}" rx="5" fill="${color}"/>` +
      `<text x="${x + sw / 2 - 2}" y="${y + 15}" font-size="10.5" font-weight="700" fill="#fff" text-anchor="middle">${label}</text>` +
      `<text x="${x + sw / 2 - 2}" y="${y + 28}" font-size="8.5" fill="#fff" text-anchor="middle">約5日</text>`;
  };
  return (
    `<svg class="diagram-single" viewBox="0 0 300 130" width="100%" role="img" aria-label="二十四節気のひとつが初候・次候・末候の三つに分かれて七十二候になる図">` +
    `<rect width="300" height="130" fill="${BG}"/>` +
    `<text x="150" y="34" font-size="11" font-weight="700" fill="${AI_DEEP}" text-anchor="middle">二十四節気のひとつ（約15日）</text>` +
    `<path d="M24 44 H276" stroke="${AI}" stroke-width="1.5"/>` +
    seg(0, HARU, '初候') + seg(1, NATSU, '次候') + seg(2, AKI, '末候') +
    `<text x="150" y="116" font-size="10" fill="${INK}" text-anchor="middle">3つ × 24節気 ＝ 七十二候</text>` +
    `</svg>`
  );
}

// 3) 定気法と平気法（節気の間隔の違い）
function teikiHeikiSvg(): string {
  const panel = (px: number, title: string, sub: string, ticks: number[]) => {
    let t = '';
    for (const tx of ticks) {
      t += `<line x1="${px + tx}" y1="56" x2="${px + tx}" y2="78" stroke="${AI}" stroke-width="2"/>`;
    }
    return `<g>` +
      `<text x="${px + 65}" y="34" font-size="11" font-weight="700" fill="${AI_DEEP}" text-anchor="middle">${title}</text>` +
      `<text x="${px + 65}" y="48" font-size="8.5" fill="${INK}" text-anchor="middle">${sub}</text>` +
      `<line x1="${px + 4}" y1="78" x2="${px + 126}" y2="78" stroke="${AI}" stroke-width="1.5"/>` +
      t + `</g>`;
  };
  // 平気法＝等間隔、定気法＝冬狭く夏広く（不等間隔）
  const equal = [10, 30, 50, 70, 90, 110];
  const uneven = [10, 26, 44, 66, 90, 116];
  return (
    `<svg class="diagram-single" viewBox="0 0 300 100" width="100%" role="img" aria-label="平気法は節気の間隔が等しく定気法は冬に狭く夏に広くなることを示す図">` +
    `<rect width="300" height="100" fill="${BG}"/>` +
    panel(8, '平気法', '時間で24等分（間隔が一定）', equal) +
    panel(160, '定気法', '黄経で24等分（冬は狭く夏は広い）', uneven) +
    `</svg>`
  );
}

const FIGURE_DATA: Record<string, { caption: string; inner: string }> = {
  'sekki-ring': {
    caption: '季節リング（模式図）。太陽が一年かけて黄道を一周し、その円を15度ごとに24等分した点が二十四節気にあたる。春分から反時計回りではなく、太陽の進む向きに沿って春夏秋冬が巡る。',
    inner: `<div class="diagram-wrap">${sekkiRingSvg()}</div>`,
  },
  'kou-structure': {
    caption: '七十二候の成り立ち（模式図）。二十四節気のひとつ（約15日）を初候・次候・末候の三つ（各約5日）に分け、24掛ける3で一年を72に区切る。',
    inner: `<div class="diagram-wrap">${kouStructureSvg()}</div>`,
  },
  'teiki-heiki': {
    caption: '定気法と平気法の違い（模式図）。平気法は一年の時間を等分するため節気の間隔が一定になる。定気法は黄経で等分するため、地球の公転が速い冬は間隔が狭く、遅い夏は広くなる。現在は定気法を用いる。',
    inner: `<div class="diagram-wrap">${teikiHeikiSvg()}</div>`,
  },
};

// トップの今日ダッシュボード用：季節リングに現在位置マーカーを置く（App/prerender 共用）
export function currentRingSvg(markerDeg: number): string {
  const cx = 110, cy = 110, R = 92, r = 60;
  const ringArc = (a0: number, a1: number, color: string) => {
    const [ox0, oy0] = pol(cx, cy, R, a0);
    const [ox1, oy1] = pol(cx, cy, R, a1);
    const [ix1, iy1] = pol(cx, cy, r, a1);
    const [ix0, iy0] = pol(cx, cy, r, a0);
    return `<path d="M${ox0.toFixed(1)} ${oy0.toFixed(1)} A${R} ${R} 0 0 1 ${ox1.toFixed(1)} ${oy1.toFixed(1)} L${ix1.toFixed(1)} ${iy1.toFixed(1)} A${r} ${r} 0 0 0 ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z" fill="${color}" opacity="0.85"/>`;
  };
  const arcs = ringArc(315, 45, HARU) + ringArc(45, 135, NATSU) + ringArc(135, 225, AKI) + ringArc(225, 315, FUYU);
  let ticks = '';
  for (let d = 0; d < 360; d += 15) {
    const [x0, y0] = pol(cx, cy, r, d);
    const [x1, y1] = pol(cx, cy, R, d);
    ticks += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${BG}" stroke-width="${d % 90 === 0 ? 2.2 : 1}"/>`;
  }
  const lbl = (deg: number, t: string) => {
    const [lx, ly] = pol(cx, cy, R + 13, deg);
    return `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" font-size="11" font-weight="700" fill="${AI_DEEP}" text-anchor="middle">${t}</text>`;
  };
  // 現在位置マーカー（リング中央半径に置く）
  const [mx, my] = pol(cx, cy, (R + r) / 2, markerDeg);
  const [hx, hy] = pol(cx, cy, R + 4, markerDeg);
  const [tx, ty] = pol(cx, cy, r - 4, markerDeg);
  return (
    `<svg viewBox="0 0 220 230" width="100%" role="img" aria-label="季節リング上で今日のおよその位置を示す図">` +
    `<rect width="220" height="230" fill="none"/>` +
    arcs + ticks +
    `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="${BG}"/>` +
    lbl(0, '春分') + lbl(90, '夏至') + lbl(180, '秋分') + lbl(270, '冬至') +
    `<line x1="${tx.toFixed(1)}" y1="${ty.toFixed(1)}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="${GOLD}" stroke-width="2" opacity="0.6"/>` +
    `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="8" fill="${GOLD}" stroke="${BG}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy + 4}" font-size="12" font-weight="700" fill="${AI_DEEP}" text-anchor="middle">いまここ</text>` +
    `</svg>`
  );
}

export const FIGURE_KEYS = Object.keys(FIGURE_DATA);

export function figureHtml(id: string): string | null {
  const f = FIGURE_DATA[id];
  if (!f) return null;
  return `<div class="content-figure">${f.inner}<p class="figure-caption">${f.caption}</p></div>`;
}
