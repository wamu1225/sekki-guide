// 「いまの節気・候」を日付から算出するためのデータとロジック（単一の真実源）。
// 日付（月日）は年によって前後する目安。正確な日付は国立天文台の暦要項による。
// App.tsx（トップの今日ダッシュボード）と prerender（ビルド時点の今日でフォールバック生成）が共用する。

export type Season = '春' | '夏' | '秋' | '冬';
export type Bun = '初候' | '次候' | '末候';

export type Kou = {
  i: number;        // 0始まりの通し番号（立春初候=0）
  sekki: string;    // 所属する節気
  sekkiYomi: string;
  bun: Bun;
  name: string;     // 候名（日本の候）
  yomi: string;
  season: Season;
  m: number;        // 開始の目安（月）
  d: number;        // 開始の目安（日）
};

// 立春→大寒の順。開始日は目安（年で前後する）。
export const KOU: Kou[] = [
  { i: 0, sekki: '立春', sekkiYomi: 'りっしゅん', bun: '初候', name: '東風解凍', yomi: 'はるかぜこおりをとく', season: '春', m: 2, d: 4 },
  { i: 1, sekki: '立春', sekkiYomi: 'りっしゅん', bun: '次候', name: '黄鶯睍睆', yomi: 'うぐいすなく', season: '春', m: 2, d: 9 },
  { i: 2, sekki: '立春', sekkiYomi: 'りっしゅん', bun: '末候', name: '魚上氷', yomi: 'うおこおりをいずる', season: '春', m: 2, d: 14 },
  { i: 3, sekki: '雨水', sekkiYomi: 'うすい', bun: '初候', name: '土脉潤起', yomi: 'つちのしょううるおいおこる', season: '春', m: 2, d: 19 },
  { i: 4, sekki: '雨水', sekkiYomi: 'うすい', bun: '次候', name: '霞始靆', yomi: 'かすみはじめてたなびく', season: '春', m: 2, d: 24 },
  { i: 5, sekki: '雨水', sekkiYomi: 'うすい', bun: '末候', name: '草木萌動', yomi: 'そうもくめばえいずる', season: '春', m: 3, d: 1 },
  { i: 6, sekki: '啓蟄', sekkiYomi: 'けいちつ', bun: '初候', name: '蟄虫啓戸', yomi: 'すごもりむしとをひらく', season: '春', m: 3, d: 5 },
  { i: 7, sekki: '啓蟄', sekkiYomi: 'けいちつ', bun: '次候', name: '桃始笑', yomi: 'ももはじめてさく', season: '春', m: 3, d: 10 },
  { i: 8, sekki: '啓蟄', sekkiYomi: 'けいちつ', bun: '末候', name: '菜虫化蝶', yomi: 'なむしちょうとなる', season: '春', m: 3, d: 15 },
  { i: 9, sekki: '春分', sekkiYomi: 'しゅんぶん', bun: '初候', name: '雀始巣', yomi: 'すずめはじめてすくう', season: '春', m: 3, d: 21 },
  { i: 10, sekki: '春分', sekkiYomi: 'しゅんぶん', bun: '次候', name: '桜始開', yomi: 'さくらはじめてひらく', season: '春', m: 3, d: 26 },
  { i: 11, sekki: '春分', sekkiYomi: 'しゅんぶん', bun: '末候', name: '雷乃発声', yomi: 'かみなりすなわちこえをはっす', season: '春', m: 3, d: 31 },
  { i: 12, sekki: '清明', sekkiYomi: 'せいめい', bun: '初候', name: '玄鳥至', yomi: 'つばめきたる', season: '春', m: 4, d: 5 },
  { i: 13, sekki: '清明', sekkiYomi: 'せいめい', bun: '次候', name: '鴻雁北', yomi: 'こうがんかえる', season: '春', m: 4, d: 10 },
  { i: 14, sekki: '清明', sekkiYomi: 'せいめい', bun: '末候', name: '虹始見', yomi: 'にじはじめてあらわる', season: '春', m: 4, d: 15 },
  { i: 15, sekki: '穀雨', sekkiYomi: 'こくう', bun: '初候', name: '葭始生', yomi: 'あしはじめてしょうず', season: '春', m: 4, d: 20 },
  { i: 16, sekki: '穀雨', sekkiYomi: 'こくう', bun: '次候', name: '霜止出苗', yomi: 'しもやんでなえいずる', season: '春', m: 4, d: 25 },
  { i: 17, sekki: '穀雨', sekkiYomi: 'こくう', bun: '末候', name: '牡丹華', yomi: 'ぼたんはなさく', season: '春', m: 4, d: 30 },
  { i: 18, sekki: '立夏', sekkiYomi: 'りっか', bun: '初候', name: '蛙始鳴', yomi: 'かわずはじめてなく', season: '夏', m: 5, d: 5 },
  { i: 19, sekki: '立夏', sekkiYomi: 'りっか', bun: '次候', name: '蚯蚓出', yomi: 'みみずいずる', season: '夏', m: 5, d: 10 },
  { i: 20, sekki: '立夏', sekkiYomi: 'りっか', bun: '末候', name: '竹笋生', yomi: 'たけのこしょうず', season: '夏', m: 5, d: 15 },
  { i: 21, sekki: '小満', sekkiYomi: 'しょうまん', bun: '初候', name: '蚕起食桑', yomi: 'かいこおきてくわをはむ', season: '夏', m: 5, d: 21 },
  { i: 22, sekki: '小満', sekkiYomi: 'しょうまん', bun: '次候', name: '紅花栄', yomi: 'べにばなさかう', season: '夏', m: 5, d: 26 },
  { i: 23, sekki: '小満', sekkiYomi: 'しょうまん', bun: '末候', name: '麦秋至', yomi: 'むぎのときいたる', season: '夏', m: 5, d: 31 },
  { i: 24, sekki: '芒種', sekkiYomi: 'ぼうしゅ', bun: '初候', name: '蟷螂生', yomi: 'かまきりしょうず', season: '夏', m: 6, d: 6 },
  { i: 25, sekki: '芒種', sekkiYomi: 'ぼうしゅ', bun: '次候', name: '腐草為蛍', yomi: 'くされたるくさほたるとなる', season: '夏', m: 6, d: 11 },
  { i: 26, sekki: '芒種', sekkiYomi: 'ぼうしゅ', bun: '末候', name: '梅子黄', yomi: 'うめのみきばむ', season: '夏', m: 6, d: 16 },
  { i: 27, sekki: '夏至', sekkiYomi: 'げし', bun: '初候', name: '乃東枯', yomi: 'なつかれくさかるる', season: '夏', m: 6, d: 21 },
  { i: 28, sekki: '夏至', sekkiYomi: 'げし', bun: '次候', name: '菖蒲華', yomi: 'あやめはなさく', season: '夏', m: 6, d: 26 },
  { i: 29, sekki: '夏至', sekkiYomi: 'げし', bun: '末候', name: '半夏生', yomi: 'はんげしょうず', season: '夏', m: 7, d: 1 },
  { i: 30, sekki: '小暑', sekkiYomi: 'しょうしょ', bun: '初候', name: '温風至', yomi: 'あつかぜいたる', season: '夏', m: 7, d: 7 },
  { i: 31, sekki: '小暑', sekkiYomi: 'しょうしょ', bun: '次候', name: '蓮始開', yomi: 'はすはじめてひらく', season: '夏', m: 7, d: 12 },
  { i: 32, sekki: '小暑', sekkiYomi: 'しょうしょ', bun: '末候', name: '鷹乃学習', yomi: 'たかすなわちわざをならう', season: '夏', m: 7, d: 17 },
  { i: 33, sekki: '大暑', sekkiYomi: 'たいしょ', bun: '初候', name: '桐始結花', yomi: 'きりはじめてはなをむすぶ', season: '夏', m: 7, d: 23 },
  { i: 34, sekki: '大暑', sekkiYomi: 'たいしょ', bun: '次候', name: '土潤溽暑', yomi: 'つちうるおうてむしあつし', season: '夏', m: 7, d: 28 },
  { i: 35, sekki: '大暑', sekkiYomi: 'たいしょ', bun: '末候', name: '大雨時行', yomi: 'たいうときどきにふる', season: '夏', m: 8, d: 2 },
  { i: 36, sekki: '立秋', sekkiYomi: 'りっしゅう', bun: '初候', name: '涼風至', yomi: 'すずかぜいたる', season: '秋', m: 8, d: 8 },
  { i: 37, sekki: '立秋', sekkiYomi: 'りっしゅう', bun: '次候', name: '寒蝉鳴', yomi: 'ひぐらしなく', season: '秋', m: 8, d: 13 },
  { i: 38, sekki: '立秋', sekkiYomi: 'りっしゅう', bun: '末候', name: '蒙霧升降', yomi: 'ふかききりまとう', season: '秋', m: 8, d: 18 },
  { i: 39, sekki: '処暑', sekkiYomi: 'しょしょ', bun: '初候', name: '綿柎開', yomi: 'わたのはなしべひらく', season: '秋', m: 8, d: 23 },
  { i: 40, sekki: '処暑', sekkiYomi: 'しょしょ', bun: '次候', name: '天地始粛', yomi: 'てんちはじめてさむし', season: '秋', m: 8, d: 28 },
  { i: 41, sekki: '処暑', sekkiYomi: 'しょしょ', bun: '末候', name: '禾乃登', yomi: 'こくものすなわちみのる', season: '秋', m: 9, d: 2 },
  { i: 42, sekki: '白露', sekkiYomi: 'はくろ', bun: '初候', name: '草露白', yomi: 'くさのつゆしろし', season: '秋', m: 9, d: 8 },
  { i: 43, sekki: '白露', sekkiYomi: 'はくろ', bun: '次候', name: '鶺鴒鳴', yomi: 'せきれいなく', season: '秋', m: 9, d: 13 },
  { i: 44, sekki: '白露', sekkiYomi: 'はくろ', bun: '末候', name: '玄鳥去', yomi: 'つばめさる', season: '秋', m: 9, d: 18 },
  { i: 45, sekki: '秋分', sekkiYomi: 'しゅうぶん', bun: '初候', name: '雷乃収声', yomi: 'かみなりすなわちこえをおさむ', season: '秋', m: 9, d: 23 },
  { i: 46, sekki: '秋分', sekkiYomi: 'しゅうぶん', bun: '次候', name: '蟄虫坏戸', yomi: 'むしかくれてとをふさぐ', season: '秋', m: 9, d: 28 },
  { i: 47, sekki: '秋分', sekkiYomi: 'しゅうぶん', bun: '末候', name: '水始涸', yomi: 'みずはじめてかるる', season: '秋', m: 10, d: 3 },
  { i: 48, sekki: '寒露', sekkiYomi: 'かんろ', bun: '初候', name: '鴻雁来', yomi: 'こうがんきたる', season: '秋', m: 10, d: 8 },
  { i: 49, sekki: '寒露', sekkiYomi: 'かんろ', bun: '次候', name: '菊花開', yomi: 'きくのはなひらく', season: '秋', m: 10, d: 13 },
  { i: 50, sekki: '寒露', sekkiYomi: 'かんろ', bun: '末候', name: '蟋蟀在戸', yomi: 'きりぎりすとにあり', season: '秋', m: 10, d: 18 },
  { i: 51, sekki: '霜降', sekkiYomi: 'そうこう', bun: '初候', name: '霜始降', yomi: 'しもはじめてふる', season: '秋', m: 10, d: 24 },
  { i: 52, sekki: '霜降', sekkiYomi: 'そうこう', bun: '次候', name: '霎時施', yomi: 'こさめときどきふる', season: '秋', m: 10, d: 29 },
  { i: 53, sekki: '霜降', sekkiYomi: 'そうこう', bun: '末候', name: '楓蔦黄', yomi: 'もみじつたきばむ', season: '秋', m: 11, d: 3 },
  { i: 54, sekki: '立冬', sekkiYomi: 'りっとう', bun: '初候', name: '山茶始開', yomi: 'つばきはじめてひらく', season: '冬', m: 11, d: 7 },
  { i: 55, sekki: '立冬', sekkiYomi: 'りっとう', bun: '次候', name: '地始凍', yomi: 'ちはじめてこおる', season: '冬', m: 11, d: 12 },
  { i: 56, sekki: '立冬', sekkiYomi: 'りっとう', bun: '末候', name: '金盞香', yomi: 'きんせんかさく', season: '冬', m: 11, d: 17 },
  { i: 57, sekki: '小雪', sekkiYomi: 'しょうせつ', bun: '初候', name: '虹蔵不見', yomi: 'にじかくれてみえず', season: '冬', m: 11, d: 22 },
  { i: 58, sekki: '小雪', sekkiYomi: 'しょうせつ', bun: '次候', name: '朔風払葉', yomi: 'きたかぜこのはをはらう', season: '冬', m: 11, d: 27 },
  { i: 59, sekki: '小雪', sekkiYomi: 'しょうせつ', bun: '末候', name: '橘始黄', yomi: 'たちばなはじめてきばむ', season: '冬', m: 12, d: 2 },
  { i: 60, sekki: '大雪', sekkiYomi: 'たいせつ', bun: '初候', name: '閉塞成冬', yomi: 'そらさむくふゆとなる', season: '冬', m: 12, d: 7 },
  { i: 61, sekki: '大雪', sekkiYomi: 'たいせつ', bun: '次候', name: '熊蟄穴', yomi: 'くまあなにこもる', season: '冬', m: 12, d: 12 },
  { i: 62, sekki: '大雪', sekkiYomi: 'たいせつ', bun: '末候', name: '鱖魚群', yomi: 'さけのうおむらがる', season: '冬', m: 12, d: 16 },
  { i: 63, sekki: '冬至', sekkiYomi: 'とうじ', bun: '初候', name: '乃東生', yomi: 'なつかれくさしょうず', season: '冬', m: 12, d: 22 },
  { i: 64, sekki: '冬至', sekkiYomi: 'とうじ', bun: '次候', name: '麋角解', yomi: 'おおしかのつのおつる', season: '冬', m: 12, d: 26 },
  { i: 65, sekki: '冬至', sekkiYomi: 'とうじ', bun: '末候', name: '雪下出麦', yomi: 'ゆきわたりてむぎいづる', season: '冬', m: 12, d: 31 },
  { i: 66, sekki: '小寒', sekkiYomi: 'しょうかん', bun: '初候', name: '芹乃栄', yomi: 'せりすなわちさかう', season: '冬', m: 1, d: 5 },
  { i: 67, sekki: '小寒', sekkiYomi: 'しょうかん', bun: '次候', name: '水泉動', yomi: 'しみずあたたかをふくむ', season: '冬', m: 1, d: 10 },
  { i: 68, sekki: '小寒', sekkiYomi: 'しょうかん', bun: '末候', name: '雉始雊', yomi: 'きじはじめてなく', season: '冬', m: 1, d: 15 },
  { i: 69, sekki: '大寒', sekkiYomi: 'だいかん', bun: '初候', name: '款冬華', yomi: 'ふきのはなさく', season: '冬', m: 1, d: 20 },
  { i: 70, sekki: '大寒', sekkiYomi: 'だいかん', bun: '次候', name: '水沢腹堅', yomi: 'さわみずこおりつめる', season: '冬', m: 1, d: 25 },
  { i: 71, sekki: '大寒', sekkiYomi: 'だいかん', bun: '末候', name: '鶏始乳', yomi: 'にわとりはじめてとやにつく', season: '冬', m: 1, d: 30 },
];

const key = (m: number, d: number) => m * 100 + d;
// 非閏年を基準にした通日（目安の差分計算用）
const DAYS_BEFORE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const doy = (m: number, d: number) => DAYS_BEFORE[m - 1] + d;

// 今日が属する候を返す（年で前後する目安）。
export function currentKou(date: Date): Kou {
  const t = key(date.getMonth() + 1, date.getDate());
  let best: Kou | null = null;
  for (const k of KOU) {
    if (key(k.m, k.d) <= t && (best === null || key(k.m, k.d) > key(best.m, best.d))) best = k;
  }
  // どれも今日以下でない（1月初め、小寒前）→ 年をまたいで冬至末
  if (best === null) {
    best = KOU.reduce((a, b) => (key(b.m, b.d) > key(a.m, a.d) ? b : a));
  }
  return best;
}

// 次の節気（初候）と、そこまでの日数の目安を返す。
export function nextSekki(date: Date): { kou: Kou; days: number } {
  const cur = currentKou(date);
  let n = (cur.i + 1) % KOU.length;
  while (KOU[n].bun !== '初候') n = (n + 1) % KOU.length;
  const nx = KOU[n];
  let days = doy(nx.m, nx.d) - doy(date.getMonth() + 1, date.getDate());
  if (days <= 0) days += 365;
  return { kou: nx, days };
}

// 季節リング上の現在位置（度・0=真上=春分の黄経0°）。立春が黄経315°、以後5°刻みの目安。
export function ringDegFor(k: Kou): number {
  return (315 + k.i * 5) % 360;
}

export const SEASON_OF: Record<Season, string> = { 春: 'haru', 夏: 'natsu', 秋: 'aki', 冬: 'fuyu' };
