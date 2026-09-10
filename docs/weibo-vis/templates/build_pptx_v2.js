// WEIBO 簡報模板 v2：對齊現行簡報語言（漸層數字、斜線眉標、波紋線稿、圓角卡、圖示）
const pptxgen = require('pptxgenjs');
const fs = require('fs');

const C = { P: '5D59FF', P7: '3A37C2', P2: 'A3A3FF', P1: 'D6D5FF', P50: 'EEEEFF', NAVY: '1E2A5E', G50: 'F4F4F8', G200: 'E4E4EA', G400: '999999', G600: '666666', G900: '333333', W: 'FFFFFF' };
const FONT = 'Microsoft JhengHei';
const W = 13.33, H = 7.5, M = 0.6;
const img = (f) => 'image/png;base64,' + fs.readFileSync(f).toString('base64');
const A = (n) => img('assets/' + n);
const BG_COVER = A('bg_cover.png'), BG_INNER = A('bg_inner.png'), RULE = A('header_rule.png');
const LOGO_EN_W = img('logo_en_white.png'), LOGO_CORP_B = img('logo_corp_black.png');
const NUM = {}; for (let i = 1; i <= 15; i++) NUM[i] = A(`num_${String(i).padStart(2, '0')}.png`);
const ICO = (name, white) => A(`icon_${name}_${white ? 'FFFFFF' : C.P}.png`);

function txt(s, text, o) { s.addText(text, Object.assign({ fontFace: FONT, isTextBox: true, margin: 0 }, o)); }
const shadow = () => ({ type: 'outer', color: '5D59FF', blur: 14, offset: 4, angle: 90, opacity: 0.10 });

function cover(pres, eyebrow, title, sub, foot) {
  const s = pres.addSlide(); s.background = { data: BG_COVER };
  txt(s, eyebrow, { x: M, y: 2.3, w: 10, h: 0.35, fontSize: 12, bold: true, color: C.P1, charSpacing: 5 });
  txt(s, title, { x: M, y: 2.75, w: 11.5, h: 1.8, fontSize: 40, bold: true, color: C.W, valign: 'top', lineSpacingMultiple: 1.1 });
  txt(s, sub, { x: M, y: 4.65, w: 11, h: 0.5, fontSize: 16, color: 'E6E6FF' });
  txt(s, foot, { x: M, y: 5.3, w: 11, h: 0.4, fontSize: 11, color: 'B9BEFF' });
  s.addImage({ data: LOGO_EN_W, x: M, y: H - M - 0.42, w: 1.81, h: 0.42 });
  txt(s, '威柏科技貿易有限公司　WEIBO Technology Trade Co., Ltd', { x: W - M - 6, y: H - M - 0.3, w: 6, h: 0.3, fontSize: 9, color: 'B9BEFF', align: 'right' });
  return s;
}
function inner(pres, n, eyebrow, title, total) {
  const s = pres.addSlide(); s.background = { data: BG_INNER };
  // 漸層數字 ＋ 斜線 ＋ 眉標 ＋ 斜切線
  s.addImage({ data: NUM[n], x: M - 0.08, y: 0.32, w: 1.55, h: 1.0 });
  s.addShape('line', { x: 2.15, y: 0.55, w: 0.18, h: 0.62, line: { color: C.P2, width: 1.25 }, flipH: true });
  txt(s, eyebrow, { x: 2.5, y: 0.62, w: 8, h: 0.4, fontSize: 13, color: '8B8BC8', charSpacing: 2 });
  s.addImage({ data: RULE, x: M, y: 1.36, w: 6.6, h: 0.11 });
  txt(s, title, { x: M, y: 1.62, w: 11.8, h: 0.75, fontSize: 28, bold: true, color: C.P });
  // 頁尾：Logo 左下、頁碼膠囊右下
  s.addImage({ data: LOGO_CORP_B, x: M, y: H - M - 0.3, w: 1.8, h: 0.3 });
  s.addShape('roundRect', { x: W - M - 1.35, y: H - M - 0.34, w: 1.35, h: 0.34, rectRadius: 0.17, fill: { color: C.P50 }, line: { color: C.P50, width: 0 } });
  txt(s, `Page ${String(n).padStart(2, '0')} / ${total}`, { x: W - M - 1.35, y: H - M - 0.34, w: 1.35, h: 0.34, fontSize: 9.5, color: C.P, align: 'center', valign: 'middle' });
  return s;
}
function closing(pres, eyebrow, title, lines) {
  const s = pres.addSlide(); s.background = { data: BG_COVER };
  txt(s, eyebrow, { x: M, y: 2.4, w: 10, h: 0.35, fontSize: 12, bold: true, color: C.P1, charSpacing: 5 });
  txt(s, title, { x: M, y: 2.85, w: 11.5, h: 1.2, fontSize: 34, bold: true, color: C.W });
  txt(s, lines, { x: M, y: 4.3, w: 11, h: 1.2, fontSize: 14, color: 'E6E6FF', lineSpacingMultiple: 1.4 });
  s.addImage({ data: LOGO_EN_W, x: M, y: H - M - 0.42, w: 1.81, h: 0.42 });
  return s;
}
// 圓角卡（白底、淡紫陰影）＋ 圓形圖示
function card(s, x, y, w, h, icon, head, body, o = {}) {
  s.addShape('roundRect', { x, y, w, h, rectRadius: 0.16, fill: { color: o.fill || C.W }, line: { color: o.line || 'ECECF8', width: 0.75 }, shadow: shadow() });
  // 圖示圓在左、標題在右同一列；內文從下一列開始，避免壓到卡片底部
  let hx = x + 0.24, by = y + 0.7;
  if (icon) {
    s.addShape('ellipse', { x: x + 0.24, y: y + 0.22, w: 0.56, h: 0.56, fill: { color: o.iconBg || C.P50 }, line: { color: o.iconBg || C.P50, width: 0 } });
    s.addImage({ data: ICO(icon, !!o.iconWhite), x: x + 0.37, y: y + 0.35, w: 0.3, h: 0.3 });
    hx = x + 0.95; by = y + 0.95;
  }
  txt(s, head, { x: hx, y: y + 0.24, w: w - (hx - x) - 0.24, h: 0.52, fontSize: o.headSize || 15, bold: true, color: o.headColor || C.G900, valign: 'middle' });
  txt(s, body, { x: x + 0.24, y: by, w: w - 0.48, h: h - (by - y) - 0.2, fontSize: o.bodySize || 11.5, color: o.bodyColor || C.G600, valign: 'top', lineSpacingMultiple: 1.3 });
}
// 膠囊標籤
function pill(s, x, y, text, w = 1.1) {
  s.addShape('roundRect', { x, y, w, h: 0.34, rectRadius: 0.17, fill: { color: C.W }, line: { color: C.P, width: 1 } });
  txt(s, text, { x, y, w, h: 0.34, fontSize: 10.5, color: C.P, align: 'center', valign: 'middle', charSpacing: 2 });
}
function stat(s, x, y, w, big, label, icon) {
  if (icon) s.addImage({ data: ICO(icon), x, y: y + 0.08, w: 0.42, h: 0.42 });
  txt(s, big, { x: x + (icon ? 0.55 : 0), y, w: w - 0.55, h: 0.8, fontSize: 40, bold: true, color: C.P });
  txt(s, label, { x: x + (icon ? 0.55 : 0), y: y + 0.82, w: w - 0.55, h: 0.4, fontSize: 11.5, color: C.G600 });
}
// 步驟／時程卡列
function steps(s, y, items, h = 1.7) {
  const gap = 0.22, w = (W - 2 * M - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = M + i * (w + gap), hl = it.highlight;
    s.addShape('roundRect', { x, y, w, h, rectRadius: 0.14, fill: { color: hl ? C.P : C.W }, line: { color: hl ? C.P : 'ECECF8', width: 0.75 }, shadow: shadow() });
    if (it.icon) s.addImage({ data: ICO(it.icon, hl), x: x + 0.22, y: y + 0.22, w: 0.36, h: 0.36 });
    txt(s, it.head, { x: x + (it.icon ? 0.68 : 0.22), y: y + 0.2, w: w - 0.9, h: 0.4, fontSize: 15, bold: true, color: hl ? C.W : C.P7 });
    txt(s, it.body, { x: x + 0.22, y: y + 0.72, w: w - 0.44, h: h - 0.85, fontSize: 11, color: hl ? 'EEEEFF' : C.G600, valign: 'top', lineSpacingMultiple: 1.3 });
  });
}
function table(s, y, header, rows, colW, o = {}) {
  const fs_ = o.fs || 11.5;
  const hdr = header.map(t => ({ text: t, options: { bold: true, color: C.W, fill: { color: C.P }, fontSize: fs_ } }));
  const body = rows.map((r, ri) => r.map((t, ci) => ({ text: String(t), options: { fontSize: fs_, color: ci === 0 ? C.G900 : C.G600, bold: ci === 0, fill: { color: ri % 2 ? 'F7F7FD' : C.W }, align: (o.right || []).includes(ci) ? 'right' : 'left' } })));
  s.addTable([hdr, ...body], { x: M, y, w: W - 2 * M, colW, fontFace: FONT, border: { type: 'solid', color: 'E4E4EE', pt: 0.5 }, rowH: o.rowH || 0.42, valign: 'middle', margin: 0.08 });
}
const bullets = (arr) => arr.map((t, i) => ({ text: t, options: { bullet: { code: '25A0' }, breakLine: i < arr.length - 1, paraSpaceAfter: 8 } }));

/* ───────────── A. 新品簡報 ───────────── */
(function buildA() {
  const T = 10;
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE'; pres.lang = 'zh-TW';
  pres.author = '威柏科技貿易有限公司'; pres.company = 'WEIBO'; pres.title = 'WEIBO 新品簡報模板';

  cover(pres, 'NEW PRODUCT  ·  2026 Q4', 'ACEFAST T8 真無線藍牙耳機\n上市提案', '台灣總代理 ｜ 對象：momo・PChome MD／區域經銷商', '威柏科技貿易有限公司 ｜ 電商通路部 ｜ 2026.09（範例內容，請替換）');

  let s = inner(pres, 1, 'AGENDA｜今天要談的五件事', '一次講清楚：定位、規格、競品、時程、條件', T);
  const ag = [['Target', '產品定位與三大賣點'], ['ClipboardCheck', '規格與包裝內容'], ['Scale', '同價位競品比較'], ['Calendar', '上市時程與行銷資源'], ['Tag', '價格結構與供貨條件']];
  ag.forEach(([ic, t], i) => {
    const y = 2.6 + i * 0.72;
    s.addShape('ellipse', { x: M, y, w: 0.5, h: 0.5, fill: { color: C.P50 }, line: { color: C.P50, width: 0 } });
    s.addImage({ data: ICO(ic), x: M + 0.12, y: y + 0.12, w: 0.26, h: 0.26 });
    txt(s, `0${i + 1}`, { x: M + 0.7, y, w: 0.5, h: 0.5, fontSize: 13, bold: true, color: C.P, valign: 'middle' });
    txt(s, t, { x: M + 1.25, y, w: 5.2, h: 0.5, fontSize: 16, color: C.G900, valign: 'middle' });
  });
  card(s, 7.4, 2.6, 5.33, 3.5, 'Sparkles', '本次提案重點', '首批 2,000 pcs 現貨\n建議售價 NT$ 1,990\n10/01 momo 首賣、11/11 KOL ×3\n18 個月原廠保固，太保倉 D+1 出貨', { fill: 'F7F7FF', line: 'E6E6FA', bodySize: 13.5, bodyColor: C.G900 });

  s = inner(pres, 2, 'ABOUT WEIBO｜三大生態軸心', '一個生態系，三種承諾', T);
  txt(s, '公司願景：成為亞洲最具影響力的科技生活創新生態平台　｜　WEI = We Empower Innovation → 我們相互賦能，共創價值', { x: M, y: 2.45, w: 12.1, h: 0.4, fontSize: 12, color: C.G600 });
  const cw = (W - 2 * M - 0.5) / 3;
  [['體 驗', 'Store', 'WEiZ 讓科技變得更友善', '透過專櫃、體驗店與 OMO 整合，打造「放心試、安心買、開心用」的沉浸式 3C 環境。', false], ['科 技', 'Network', 'WEIBO 台灣最強品牌落地能力', '以專業代理、供應鏈管理與全通路營運，協助全球科技品牌快速落地台灣市場。', true], ['未 來', 'Rocket', 'WEILIFE 重新定義生活質感', '以未來視角自主開發產品，探索下一個世代兼具設計與實用的生活方式。', false]].forEach(([tag, ic, h, b, hl], i) => {
    const x = M + i * (cw + 0.25);
    pill(s, x + (cw - 1.1) / 2, 3.05, tag);
    card(s, x, 3.55, cw, 2.55, ic, h, b, hl ? { fill: 'F7F7FF', line: C.P2, headColor: C.P } : {});
  });
  txt(s, '三軸共構，共同為人們創造更好的科技生活', { x: M, y: 6.25, w: 12.1, h: 0.35, fontSize: 12, color: C.P, align: 'center', charSpacing: 3 });

  s = inner(pres, 3, 'PRODUCT OVERVIEW｜一句話賣點', '40 小時續航的主動降噪耳機', T);
  s.addShape('roundRect', { x: M, y: 2.6, w: 5.4, h: 3.7, rectRadius: 0.16, fill: { color: C.W }, line: { color: 'ECECF8', width: 0.75 }, shadow: shadow() });
  txt(s, '產品去背圖\n（替換：透明背景，佔框 70%）', { x: M, y: 2.6, w: 5.4, h: 3.7, fontSize: 11.5, color: C.G400, align: 'center', valign: 'middle' });
  stat(s, 6.6, 2.65, 3.1, '40h', '總續航（含充電盒）', 'BatteryCharging');
  stat(s, 9.9, 2.65, 3.0, 'ANC', '主動降噪 −35dB', 'Headphones');
  stat(s, 6.6, 4.25, 3.1, 'IPX5', '防水防汗', 'Droplets');
  stat(s, 9.9, 4.25, 3.0, '18 個月', '原廠保固', 'ShieldCheck');
  txt(s, '目標客群：通勤與健身的 25–40 歲上班族；購買動機：預算 2,000 內想要 ANC。', { x: 6.6, y: 5.7, w: 6.1, h: 0.6, fontSize: 12, color: C.G600 });

  s = inner(pres, 4, 'SPECIFICATIONS｜規格與包裝內容', '規格一覽', T);
  table(s, 2.6, ['項目', '規格', '項目', '規格'], [
    ['藍牙版本', '5.3，雙耳同時傳輸', '單耳續航', '10 小時（ANC 關）'],
    ['晶片', 'Qualcomm QCC3071', '充電盒', '30 小時，Type-C 快充'],
    ['驅動單體', '10mm 動圈', '防水', 'IPX5'],
    ['降噪', 'ANC 混合式 −35dB ＋ ENC 通話', '重量', '單耳 4.6g ／ 含盒 48g'],
    ['編碼', 'aptX Adaptive・AAC・SBC', '包裝內容', '耳機・充電盒・耳塞 S/M/L・線・說明書'],
    ['顏色', '黑・白・藍', '保固', '18 個月（原廠）'],
  ], [1.7, 4.4, 1.7, 4.33]);

  s = inner(pres, 5, 'COMPARISON｜同價位競品', '規格對照：T8 在續航、降噪與售後領先', T);
  table(s, 2.6, ['項目', 'ACEFAST T8', '競品 A', '競品 B'], [
    ['建議售價', 'NT$ 1,990', 'NT$ 2,290', 'NT$ 1,890'],
    ['總續航', '40 小時', '30 小時', '24 小時'],
    ['降噪', 'ANC −35dB', 'ENC 通話降噪', '無'],
    ['防水', 'IPX5', 'IPX4', 'IPX4'],
    ['保固', '18 個月', '12 個月', '12 個月'],
    ['台灣售後', '威柏太保倉 D+2 檢測', '原廠寄送海外', '通路代收'],
  ], [2.6, 3.2, 3.2, 3.13], { fs: 12.5 });
  txt(s, '資料日期 2026.09；競品價格取 momo 頁面標價，替換時請更新。', { x: M, y: 6.2, w: 12, h: 0.3, fontSize: 10, color: C.G400 });

  s = inner(pres, 6, 'LAUNCH PLAN｜上市時程', '四個檔期，線上先行、實體接力', T);
  steps(s, 2.65, [
    { icon: 'ShoppingCart', head: '10/01', body: 'momo 首賣\n站內 BN、mo 幣回饋 5%\n關鍵字廣告首週 $1,000/品' },
    { icon: 'Globe', head: '10/15', body: 'PChome 24h\n3C 品類活動\n品牌館上架' },
    { icon: 'Megaphone', head: '11/11', body: '雙 11 檔期\nKOL ×3 開箱\n折扣：滿千折百', highlight: true },
    { icon: 'Store', head: '12/01', body: '實體通路\n燦坤・全國電子・三井 3C\nWEiZ 三櫃體驗陳列' },
  ], 2.45);
  txt(s, '每一檔提報表由電商通路部於檔期前 14 天送 MD／PM，回壓後於前台巡查。', { x: M, y: 5.4, w: 12.1, h: 0.4, fontSize: 12, color: C.G600 });

  s = inner(pres, 7, 'PRICING & TERMS｜價格與供貨', '價格結構與供貨條件', T);
  card(s, M, 2.6, 6.0, 3.5, 'Tag', '價格結構', '建議售價　NT$ 1,990\n經銷價　　依合約級距\n活動價　　最低 NT$ 1,690（限雙 11）\n最低售價　依經銷合約，不得低於 NT$ 1,590', { bodySize: 13, bodyColor: C.G900 });
  card(s, M + 6.2, 2.6, 5.93, 3.5, 'Truck', '供貨與售後', '首批到貨　2,000 pcs（2026.09.25 入太保倉）\n出貨　　　D+1，momo 轉單／三方物流\n保固　　　18 個月原廠保固\n檢測維修　威柏售後 D+2 判定、D+7 完修', { bodySize: 13, bodyColor: C.G900 });
  txt(s, '報價有效 30 天，含稅未含運；單筆滿 3 萬免運。', { x: M, y: 6.25, w: 12, h: 0.3, fontSize: 11, color: C.G400 });

  s = inner(pres, 8, 'MARKETING SUPPORT｜行銷資源', '威柏提供的行銷資源', T);
  const mw = (W - 2 * M - 0.5) / 3;
  card(s, M, 2.6, mw, 3.5, 'Layers', '素材包', '主圖、情境圖、短影音 15s／30s、圓標底標、活動 BN 模板；上架前 7 天交付。');
  card(s, M + mw + 0.25, 2.6, mw, 3.5, 'Users', 'KOL 與口碑', '我是賴瑞、Onion man 洋蔥男、人夫阿康開箱；Dcard／PTT 體驗文佈局。');
  card(s, M + 2 * (mw + 0.25), 2.6, mw, 3.5, 'TrendingUp', '廣告與流量', '站內關鍵字廣告出價、ROAS 監控；站外社群與聯盟行銷導流（UTM 追蹤）。');

  closing(pres, 'CONTACT', '讓品牌在台灣被看見、被喜歡、被信任', '電商通路部 ｜ 05-3209919 #236 ｜ weibo.sd8@weiboltd.com\n威柏科技貿易有限公司 ｜ 嘉義縣太保市健康路 187 號 1 樓 ｜ www.weiboltd.com');
  pres.writeFile({ fileName: '20260910_行政_WEIBO新品簡報模板_v2.pptx' }).then(() => console.log('A done'));
})();

/* ───────────── B. 新進員工簡報 ───────────── */
(function buildB() {
  const T = 11;
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE'; pres.lang = 'zh-TW';
  pres.author = '威柏科技貿易有限公司'; pres.company = 'WEIBO'; pres.title = 'WEIBO 新進員工簡報模板';

  cover(pres, 'ONBOARDING  ·  2026', '新進人員引導與職務培訓', '電商通路部 ｜ 電商行銷助理 ｜ 我們相互賦能，共創價值', '培訓對象 ○○○ ｜ 員工編號 T2026XX ｜ 到職 2026.XX.XX ｜ 培訓導師 黃冠博 Gary（範例，請替換）');

  let s = inner(pres, 1, 'AGENDA｜今天會講四件事', '從認識公司到第一週安排', T);
  steps(s, 2.65, [
    { icon: 'Building2', head: '01 關於威柏', body: '三軸使命、六大核心價值、品牌矩陣' },
    { icon: 'Network', head: '02 組織與位置', body: '六大部門、直屬主管、協作部門' },
    { icon: 'Compass', head: '03 職能與藍圖', body: '核心職能、三個檢核點、個人職能手冊' },
    { icon: 'Monitor', head: '04 系統與第一週', body: '帳號開通、第一週時程、週報節奏' },
  ], 2.2);
  txt(s, '培訓原則：邊學邊記，最終產出自己的《個人職能手冊》；不懂就當場問，不要留到事後。', { x: M, y: 5.2, w: 12.1, h: 0.4, fontSize: 12.5, color: C.G600 });

  s = inner(pres, 2, 'OUR MISSION｜三大生態軸心', '一個生態系，三種承諾', T);
  txt(s, '公司願景：成為亞洲最具影響力的科技生活創新生態平台　｜　WEI = We Empower Innovation → 我們相互賦能，共創價值', { x: M, y: 2.45, w: 12.1, h: 0.4, fontSize: 12, color: C.G600 });
  const cw = (W - 2 * M - 0.5) / 3;
  [['體 驗', 'Store', 'WEiZ 讓科技變得更友善', '透過專櫃、體驟店與 OMO 整合，打造「放心試、安心買、開心用」的沉浸式 3C 環境。'.replace('體驟', '體驗'), false], ['科 技', 'Network', 'WEIBO 台灣最強品牌落地能力', '以專業代理、供應鏈管理與全通路營運，協助全球科技品牌快速落地台灣市場。', true], ['未 來', 'Rocket', 'WEILIFE 重新定義生活質感', '以未來視角自主開發產品，探索下一個世代兼具設計與實用的生活方式。', false]].forEach(([tag, ic, h, b, hl], i) => {
    const x = M + i * (cw + 0.25);
    pill(s, x + (cw - 1.1) / 2, 3.05, tag);
    card(s, x, 3.55, cw, 2.55, ic, h, b, hl ? { fill: 'F7F7FF', line: C.P2, headColor: C.P } : {});
  });
  txt(s, '三軸共構，共同為人們創造更好的科技生活', { x: M, y: 6.25, w: 12.1, h: 0.35, fontSize: 12, color: C.P, align: 'center', charSpacing: 3 });

  s = inner(pres, 3, 'CORE VALUES｜威柏人的行為準則', '品牌靈魂：六大核心價值', T);
  const vals = [['Flag', '自由與責任', '各抒己見、勇於發聲；共識形成後全力負責。'], ['Heart', '顧客至上', '以用戶需求為核心快速行動，落實「用心、放心、貼心」。'], ['TrendingUp', '成長心態', '保持好奇心、擁抱變化、勇於升級。'], ['Zap', '凡事從簡', 'Less is More。以最有效率的方式完成最重要的事。'], ['Leaf', '永續經營', '追求長期更好、更強與更有意義。'], ['Award', '創造價值', '每一次交付、互動與產出，都必須帶來實質價值。']];
  const vw = (W - 2 * M - 0.5) / 3, vh = 1.75;
  vals.forEach(([ic, h, b], i) => card(s, M + (i % 3) * (vw + 0.25), 2.55 + Math.floor(i / 3) * (vh + 0.22), vw, vh, ic, h, b, { bodySize: 11 }));

  s = inner(pres, 4, 'BRAND PORTFOLIO｜品牌矩陣', '你將接觸的品牌矩陣', T);
  table(s, 2.6, ['品牌', '類型', '定位', '主力商品'], [
    ['WEILIFE', '自有品牌', '以未來視角開發產品，台灣設計', '特殊 3C、麥克風音響、磁吸無線充電'],
    ['WiWU', '總代理', '為現代游牧工作者而生', '行動電源、無線充電、保護膜、HUB'],
    ['ACEFAST', '總代理', '「探索科技美學」透明系列', '藍牙耳機、充電器、傳輸線、支架'],
    ['SMASMALL 昔馬', '總代理', '復古未來主義個護', '鋅合金電動刮鬍刀禮盒'],
    ['FRAMULA 芬乘', '總代理', '嗅覺科技 × 調香工藝', '居家擴香儀、車載香氛、寵物香氛'],
    ['50+ 經銷品牌', '經銷', '上架前先確認總代理或經銷，定價權限不同', '—'],
  ], [2.3, 1.5, 4.2, 4.13]);

  s = inner(pres, 5, 'ORGANIZATION｜六大部門', '組織架構與你的位置', T);
  const depts = [['Users', '人才資源部', '人資與系統 MIS'], ['Briefcase', '行政管理部', '採購／行政／專案'], ['Store', 'WEiZ 營運部', '三櫃營運、供應商、OMO'], ['Wrench', '售後品保部', '倉儲、客服、檢測維修'], ['Megaphone', '行銷業務部', '品牌行銷、經銷業務'], ['ShoppingCart', '電商通路部 ★', 'momo／PChome／蝦皮／Pinkoi']];
  const dw = (W - 2 * M - 5 * 0.2) / 6;
  depts.forEach(([ic, h, b], i) => {
    const x = M + i * (dw + 0.2), hl = i === 5;
    s.addShape('roundRect', { x, y: 2.65, w: dw, h: 2.3, rectRadius: 0.14, fill: { color: hl ? C.P : C.W }, line: { color: hl ? C.P : 'ECECF8', width: 0.75 }, shadow: shadow() });
    s.addShape('ellipse', { x: x + (dw - 0.62) / 2, y: 2.9, w: 0.62, h: 0.62, fill: { color: hl ? '7A78FF' : C.P50 }, line: { color: hl ? '7A78FF' : C.P50, width: 0 } });
    s.addImage({ data: ICO(ic, hl), x: x + (dw - 0.32) / 2, y: 3.05, w: 0.32, h: 0.32 });
    txt(s, h, { x: x + 0.1, y: 3.7, w: dw - 0.2, h: 0.4, fontSize: 13, bold: true, color: hl ? C.W : C.G900, align: 'center' });
    txt(s, b, { x: x + 0.1, y: 4.12, w: dw - 0.2, h: 0.75, fontSize: 10.5, color: hl ? 'EEEEFF' : C.G600, align: 'center', valign: 'top' });
  });
  txt(s, '總經理室統籌六大部門。★ 你在電商通路部，直屬主管：○○○。每天最常協作：售後品保部（出貨、客訴）、行銷業務部（素材）、行政管理部（採購進口）。', { x: M, y: 5.25, w: 12.1, h: 0.7, fontSize: 12, color: C.G600 });

  s = inner(pres, 6, 'GROWTH ROADMAP｜90 天成長藍圖', '從 0 到轉正的四個階段', T);
  steps(s, 2.65, [
    { icon: 'Compass', head: '前 3 日', body: '熟悉三軸品牌與組織\n帳號開通：T8／NAS／信箱／後台\n▶ 認知驗收' },
    { icon: 'BookOpen', head: '第 1 個月', body: '第一週打底、第二週輪崗\n第三週 momo 實戰\n▶ 操作驗收' },
    { icon: 'Target', head: '第 2 個月', body: '獨立操作平台日常\n主責 1 檔完整活動\n啟動 KOL 邀約' },
    { icon: 'Award', head: '第 3 個月', body: '獨立主責 1–2 個平台\n數據化成效覆盤\n▶ 轉正面談', highlight: true },
  ], 2.6);
  txt(s, '每階段結束由培訓導師檢核，未達標則延長輔導期；每週五提交工作週報。', { x: M, y: 5.5, w: 12.1, h: 0.4, fontSize: 12, color: C.G600 });

  s = inner(pres, 7, 'CORE COMPETENCIES｜必備能力', '電商行銷六大核心職能', T);
  const comps = [['Percent', '數字敏感度', '看得懂銷量、毛利率、ROAS、DOI；每個決策都能用數字說明。'], ['ListChecks', '平台規則熟練度', '活動機制、抽成、罰則與時限都不同，規則就是成本。'], ['Clock', '細心與時效意識', '出貨 D+1、客訴 D+2、評價 D+5，遲一天就是罰金。'], ['Handshake', '跨部門溝通', '串接倉儲、品保、行銷、採購，任一環節斷線檔期就開天窗。'], ['Search', '競品與趨勢敏感', '掌握競品價格、案型、素材，作為與 MD 談版位的籌碼。'], ['Sparkles', '成長心態與 AI 工具', '主動學習；善用 AI 提升素材產出與資料整理效率。']];
  comps.forEach(([ic, h, b], i) => card(s, M + (i % 3) * (vw + 0.25), 2.55 + Math.floor(i / 3) * (vh + 0.22), vw, vh, ic, h, b, { bodySize: 11 }));

  s = inner(pres, 8, 'SYSTEMS｜系統與帳號', '你會用到的系統', T);
  table(s, 2.6, ['系統', '用途', '入口', '帳號'], [
    ['人資考勤 NUEiP', '打卡、請假、福利假申請', 'NUEiP 網頁／APP', '員工編號'],
    ['NAS 雲端', '檔案存取與歸檔規則', 'QuickConnect', '員工編號'],
    ['Email、行事曆', '對外聯繫、MD／PM 提報信件', 'webmail.weiboltd.com', '員工編號@weiboltd.com'],
    ['ERP 正航 T8 ★', '電商發貨單、調撥單、庫存查詢', 'T8 應用程式（電腦版）', '員工編號'],
    ['雲端總機 EVOX', '客服來電接聽', '分機', '行政配發'],
    ['CubeLV ／ Notion', '專案、AI 工作、會議紀錄、定稿登記', '網頁', '公司 Google 帳號'],
  ], [2.6, 4.2, 3.0, 2.33]);
  txt(s, '初始密碱由行政管理部另行提供，首次登入請立即更改；帳密不得外借，不寫在任何簡報或文件內。'.replace('密碱', '密碼'), { x: M, y: 5.95, w: 12.1, h: 0.4, fontSize: 11, color: C.G400 });

  s = inner(pres, 9, 'WEEK 1｜第一個星期', '你的第一個星期', T);
  table(s, 2.55, ['日', '上午', '下午', '產出／檢核'], [
    ['第 1 日', '公司概覽：三軸、組織、通路與產品', '系統入門：T8 查詢、信箱、NAS、分機；建立個人 AI 助理', '完成所有帳號登入'],
    ['第 2 日', 'momo／PChome 後台導覽', '職能①–④：上架、提報、撈單出貨、客服評價', '獨立完成一筆轉單出貨'],
    ['第 3 日', '職能⑤–⑦：站內廣告、素材、流量推廣', '產品毛利試算：抽成、運費、後扣、mo 幣', '毛利試算表一份'],
    ['第 4 日', '售後品保輪崗：收貨、檢測、退貨路徑', '行銷業務輪崗：素材需求、經銷提報', '輪崗筆記'],
    ['第 5 日', '週報格式與提交機制', '首週驗收：導師檢核前四日交辦', '個人職能手冊初稿'],
  ], [1.2, 3.9, 4.4, 2.63], { fs: 11, rowH: 0.55 });

  closing(pres, 'WELCOME', '再次歡迎加入威柏科技', '讓我們相互賦能，共創精彩生活與未來。\n培訓導師 黃冠博 Gary ｜ 直屬主管 ○○○ ｜ 有問題直接問，不要留到事後');
  pres.writeFile({ fileName: '20260910_人資_WEIBO新進員工簡報模板_v2.pptx' }).then(() => console.log('B done'));
})();
