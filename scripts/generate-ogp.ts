// scripts/generate-ogp.ts — OGP画像（1200×630）を public/ogp.png に生成する。
// 実行: npx tsx scripts/generate-ogp.ts
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const FONT = "'Yu Gothic','Hiragino Kaku Gothic ProN','Hiragino Sans',Meiryo,'Noto Sans JP',sans-serif";
const SERIF = "'Yu Mincho','Hiragino Mincho ProN','Noto Serif JP',serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f2ea"/>
  <rect x="0" y="0" width="16" height="630" fill="#34495e"/>
  <rect x="16" y="0" width="6" height="630" fill="#c0613f"/>
  <text x="96" y="206" font-family="${SERIF}" font-size="76" font-weight="700" fill="#243140">二十四節気・七十二候</text>
  <text x="96" y="286" font-family="${SERIF}" font-size="48" font-weight="600" fill="#34495e">ガイド</text>
  <text x="96" y="374" font-family="${FONT}" font-size="26" fill="#586472">今日の節気と候、意味と太陽の動き、日本と中国の候の対比、</text>
  <text x="96" y="412" font-family="${FONT}" font-size="26" fill="#586472">暦のしくみ、雑節までを国立天文台などの一次資料で</text>
  <line x1="96" y1="478" x2="720" y2="478" stroke="#ddd6c6" stroke-width="2"/>
  <text x="96" y="530" font-family="${FONT}" font-size="24" fill="#34495e" font-weight="600">study-apps.com/sekki-guide/</text>
  <!-- 季節リング（四季を四分割・太陽が巡る） -->
  <g transform="translate(1000 315)">
    <circle r="128" fill="#ffffff" stroke="#34495e" stroke-width="3"/>
    <path d="M0 -104 A104 104 0 0 1 104 0 L58 0 A58 58 0 0 0 0 -58 Z" fill="#7faa5a"/>
    <path d="M104 0 A104 104 0 0 1 0 104 L0 58 A58 58 0 0 0 58 0 Z" fill="#3f8fb0"/>
    <path d="M0 104 A104 104 0 0 1 -104 0 L-58 0 A58 58 0 0 0 0 58 Z" fill="#c0613f"/>
    <path d="M-104 0 A104 104 0 0 1 0 -104 L0 -58 A58 58 0 0 0 -58 0 Z" fill="#6d7f96"/>
    <circle r="52" fill="#f5f2ea"/>
    <circle cx="0" cy="-104" r="13" fill="#e8c55a" stroke="#f5f2ea" stroke-width="3"/>
  </g>
</svg>`;

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const outPath = path.join(PUBLIC_DIR, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`✓ ogp.png (1200x630) を生成: ${outPath}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
