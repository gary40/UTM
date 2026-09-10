// 產生簡報／文件用的向量轉點陣素材：波紋線稿、漸層數字、圖示、水印、背景
const sharp = require('sharp');
const fs = require('fs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Lu = require('react-icons/lu');
fs.mkdirSync('assets', { recursive: true });

const P = '5D59FF', P2 = '8B7CFF', P7 = '3A37C2', NAVY = '1E2A5E';
const CJK = "'WenQuanYi Zen Hei','Noto Sans TC',sans-serif";

// ── 波紋線稿：多條相位微調的貝茲曲線 ──
function waveSVG(w, h, stroke, opacity, n = 28) {
  let paths = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const y0 = h * (0.15 + 0.55 * t), y1 = h * (0.65 - 0.5 * t), y2 = h * (0.2 + 0.7 * t), y3 = h * (0.55 - 0.35 * t);
    paths += `<path d="M ${-w * 0.05} ${y0} C ${w * 0.3} ${y1}, ${w * 0.55} ${y2}, ${w * 1.05} ${y3}" fill="none" stroke="#${stroke}" stroke-opacity="${(opacity * (0.35 + 0.65 * (1 - Math.abs(t - 0.5) * 2))).toFixed(3)}" stroke-width="1.1"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${paths}</svg>`;
}
// ── 漸層數字 ──
function numeralSVG(txt, size = 260) {
  const w = Math.round(size * 0.62 * txt.length + size * 0.3), h = Math.round(size * 1.05);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${P2}" stop-opacity=".95"/><stop offset="1" stop-color="#${P}" stop-opacity=".55"/></linearGradient></defs>
  <text x="${size * 0.1}" y="${size * 0.9}" font-family="'Liberation Sans','DejaVu Sans',sans-serif" font-style="italic" font-weight="300" font-size="${size}" fill="url(#g)" letter-spacing="-6">${txt}</text></svg>`;
}
// ── 表頭斜切線 ──
function ruleSVG(w = 1400, h = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#${P}" stop-opacity=".9"/><stop offset="1" stop-color="#${P2}" stop-opacity=".2"/></linearGradient></defs>
  <path d="M0 ${h - 2} H ${w - 40} L ${w - 2} 2" fill="none" stroke="url(#g)" stroke-width="2.5" stroke-linecap="round"/></svg>`;
}
// ── 圖示 ──
const ICONS = ['LuBox', 'LuTruck', 'LuHeadphones', 'LuBatteryCharging', 'LuShieldCheck', 'LuStore', 'LuGlobe', 'LuBarChart3', 'LuUsers', 'LuTarget', 'LuRocket', 'LuCalendar', 'LuTag', 'LuMegaphone', 'LuHandshake', 'LuSettings', 'LuDatabase', 'LuMail', 'LuPhone', 'LuClipboardCheck', 'LuLightbulb', 'LuTrendingUp', 'LuLayers', 'LuPackage', 'LuWrench', 'LuServer', 'LuLock', 'LuHeart', 'LuSparkles', 'LuCheckCircle2', 'LuBuilding2', 'LuFileText', 'LuWarehouse', 'LuMonitor', 'LuSmartphone', 'LuCreditCard', 'LuSearch', 'LuScale', 'LuZap', 'LuBookOpen', 'LuGraduationCap', 'LuFlag', 'LuClock', 'LuAward', 'LuShoppingCart', 'LuMessageSquare', 'LuGauge', 'LuNetwork', 'LuBadgeCheck', 'LuCompass', 'LuLeaf', 'LuInfinity', 'LuKeyRound', 'LuFolderOpen', 'LuUserCheck', 'LuLineChart', 'LuPercent', 'LuListChecks', 'LuBriefcase', 'LuDroplets', 'LuRepeat'];
async function icon(name, color, px = 256) {
  const C = Lu[name]; if (!C) { console.log('missing', name); return; }
  const svg = renderToStaticMarkup(React.createElement(C, { color: '#' + color, size: px, strokeWidth: 1.75 }));
  await sharp(Buffer.from(svg)).png().toFile(`assets/icon_${name.slice(2)}_${color}.png`);
}
(async () => {
  // 波紋：淺色頁用紫、深色封面用白
  await sharp(Buffer.from(waveSVG(1400, 900, P, 0.55))).png().toFile('assets/wave_purple.png');
  await sharp(Buffer.from(waveSVG(1400, 900, 'FFFFFF', 0.5))).png().toFile('assets/wave_white.png');
  // 數字 01–15
  for (let i = 1; i <= 15; i++) await sharp(Buffer.from(numeralSVG(String(i).padStart(2, '0')))).png().toFile(`assets/num_${String(i).padStart(2, '0')}.png`);
  await sharp(Buffer.from(ruleSVG())).png().toFile('assets/header_rule.png');
  // 內頁背景 1920×1080：淡紫→白 ＋ 右上波紋
  const bgLight = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6F6FF"/><stop offset=".55" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F3F3FC"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/></svg>`;
  const waveTR = await sharp(Buffer.from(waveSVG(1000, 640, P, 0.5))).png().toBuffer();
  await sharp(Buffer.from(bgLight)).composite([{ input: waveTR, left: 1000, top: -140 }]).png().toFile('assets/bg_inner.png');
  // 封面背景：深靛藍漸層 ＋ 白色波紋
  const bgDark = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${P}"/><stop offset=".5" stop-color="#${P7}"/><stop offset="1" stop-color="#${NAVY}"/></linearGradient><radialGradient id="r" cx="80%" cy="15%" r="60%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".18"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><rect width="1920" height="1080" fill="url(#r)"/></svg>`;
  const waveW = await sharp(Buffer.from(waveSVG(1300, 800, 'FFFFFF', 0.45))).png().toBuffer();
  await sharp(Buffer.from(bgDark)).composite([{ input: waveW, left: 760, top: -120 }]).png().toFile('assets/bg_cover.png');
  // 「機密」水印
  const wm = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600"><g transform="rotate(-32 800 800)"><text x="800" y="880" text-anchor="middle" font-family="${CJK}" font-weight="700" font-size="420" fill="#${P}" fill-opacity=".07" letter-spacing="40">機 密</text><text x="800" y="1040" text-anchor="middle" font-family="'Liberation Sans',sans-serif" font-weight="700" font-size="110" fill="#${P}" fill-opacity=".07" letter-spacing="30">CONFIDENTIAL</text></g></svg>`;
  await sharp(Buffer.from(wm)).png().toFile('assets/watermark_confidential.png');
  // 標誌單獨（從 en 白字版裁出左側圖形；供頁尾小圖）
  const meta = await sharp('logo_corp_black.png').metadata();
  await sharp('logo_corp_black.png').extract({ left: 0, top: 0, width: Math.round(meta.height * 1.02), height: meta.height }).png().toFile('assets/logomark_color.png');
  // 圖示：主色與白色
  for (const n of ICONS) { await icon(n, P); await icon(n, 'FFFFFF'); }
  console.log('assets done', fs.readdirSync('assets').length);
})();
