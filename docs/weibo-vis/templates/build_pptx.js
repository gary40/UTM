// WEIBO 簡報模板 ×2：新品簡報、新進員工簡報
const pptxgen = require('pptxgenjs');
const fs = require('fs');

const C = { BLUE:'5252FF', B700:'3333C2', B200:'A8A8FF', B50:'EEEEFF', NAVY:'1E2A5E', G50:'F4F4F8', G200:'E4E4EA', G400:'999999', G600:'666666', G900:'333333', WHITE:'FFFFFF', OK:'1E9E6A' };
const FONT = 'Microsoft JhengHei';
const W = 13.33, H = 7.5, M = 0.56;
const img = (f) => 'image/png;base64,' + fs.readFileSync(f).toString('base64');
const LOGO_EN_W = img('logo_en_white.png');     // 714×166
const LOGO_CORP_B = img('logo_corp_black.png'); // 896×150
const BG = img('bg_gradient.png');

function txt(slide, text, o) { slide.addText(text, Object.assign({ fontFace: FONT, isTextBox: true, margin: 0 }, o)); }

function cover(pres, eyebrow, title, sub, foot) {
  const s = pres.addSlide();
  s.background = { data: BG };
  txt(s, eyebrow, { x: M, y: 2.1, w: 10, h: 0.35, fontSize: 12, bold: true, color: C.B200, charSpacing: 4 });
  txt(s, title, { x: M, y: 2.55, w: 11.5, h: 1.9, fontSize: 40, bold: true, color: C.WHITE, valign: 'top', lineSpacingMultiple: 1.1 });
  txt(s, sub, { x: M, y: 4.55, w: 11, h: 0.5, fontSize: 16, color: 'D6D6FF' });
  txt(s, foot, { x: M, y: 5.25, w: 11, h: 0.4, fontSize: 11, color: 'B9BEFF' });
  s.addImage({ data: LOGO_EN_W, x: M, y: H - M - 0.42, w: 1.81, h: 0.42 });
  txt(s, '威柏科技貿易有限公司　WEIBO Technology Trade Co., Ltd', { x: W - M - 6, y: H - M - 0.3, w: 6, h: 0.3, fontSize: 9, color: 'B9BEFF', align: 'right' });
  return s;
}
function inner(pres, eyebrow, title, pn) {
  const s = pres.addSlide();
  s.background = { color: C.WHITE };
  txt(s, eyebrow, { x: M, y: 0.5, w: 8, h: 0.3, fontSize: 11, bold: true, color: C.BLUE, charSpacing: 4 });
  txt(s, title, { x: M, y: 0.85, w: 12, h: 0.8, fontSize: 30, bold: true, color: C.G900 });
  s.addImage({ data: LOGO_CORP_B, x: M, y: H - M - 0.28, w: 1.67, h: 0.28 });
  txt(s, String(pn).padStart(2, '0'), { x: W - M - 1, y: H - M - 0.28, w: 1, h: 0.28, fontSize: 10, color: C.G400, align: 'right' });
  return s;
}
function closing(pres, eyebrow, title, lines) {
  const s = pres.addSlide();
  s.background = { color: C.NAVY };
  txt(s, eyebrow, { x: M, y: 2.3, w: 10, h: 0.35, fontSize: 12, bold: true, color: C.B200, charSpacing: 4 });
  txt(s, title, { x: M, y: 2.75, w: 11.5, h: 1.2, fontSize: 34, bold: true, color: C.WHITE });
  txt(s, lines, { x: M, y: 4.2, w: 11, h: 1.2, fontSize: 14, color: 'D6D6FF', lineSpacingMultiple: 1.4 });
  s.addImage({ data: LOGO_EN_W, x: M, y: H - M - 0.42, w: 1.81, h: 0.42 });
  return s;
}
function card(s, x, y, w, h, head, body, opt = {}) {
  s.addShape('roundRect', { x, y, w, h, rectRadius: 0.12, fill: { color: opt.fill || C.WHITE }, line: { color: opt.line || C.G200, width: 1 } });
  txt(s, head, { x: x + 0.22, y: y + 0.18, w: w - 0.44, h: 0.4, fontSize: opt.headSize || 15, bold: true, color: opt.headColor || C.G900 });
  txt(s, body, { x: x + 0.22, y: y + 0.62, w: w - 0.44, h: h - 0.8, fontSize: opt.bodySize || 12, color: opt.bodyColor || C.G600, valign: 'top', lineSpacingMultiple: 1.25 });
}
function stat(s, x, y, w, big, label) {
  txt(s, big, { x, y, w, h: 0.9, fontSize: 44, bold: true, color: C.BLUE });
  txt(s, label, { x, y: y + 0.9, w, h: 0.4, fontSize: 12, color: C.G600 });
}
function steps(s, y, items, h = 1.55) {
  const gap = 0.2, w = (W - 2 * M - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = M + i * (w + gap), hl = it.highlight;
    s.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: hl ? C.BLUE : C.B50 }, line: { color: hl ? C.BLUE : C.B50, width: 0 } });
    txt(s, it.head, { x: x + 0.2, y: y + 0.18, w: w - 0.4, h: 0.4, fontSize: 16, bold: true, color: hl ? C.WHITE : C.B700 });
    txt(s, it.body, { x: x + 0.2, y: y + 0.6, w: w - 0.4, h: h - 0.75, fontSize: 11.5, color: hl ? C.WHITE : C.G600, valign: 'top', lineSpacingMultiple: 1.25 });
  });
}
function table(s, y, header, rows, colW, opt = {}) {
  const hdr = header.map(t => ({ text: t, options: { bold: true, color: C.WHITE, fill: { color: C.BLUE }, fontSize: opt.fs || 12 } }));
  const body = rows.map((r, ri) => r.map((t, ci) => ({ text: String(t), options: { fontSize: opt.fs || 12, color: ci === 0 ? C.G900 : C.G600, bold: ci === 0, fill: { color: ri % 2 ? C.G50 : C.WHITE }, align: (opt.right || []).includes(ci) ? 'right' : 'left' } })));
  s.addTable([hdr, ...body], { x: M, y, w: W - 2 * M, colW, fontFace: FONT, border: { type: 'solid', color: C.G200, pt: 0.5 }, rowH: opt.rowH || 0.42, valign: 'middle', margin: 0.08 });
}
const bullets = (arr) => arr.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < arr.length - 1, paraSpaceAfter: 6 } }));

/* ───────────── A. 新品簡報 ───────────── */
(function buildA() {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE'; pres.lang = 'zh-TW';
  pres.author = '威柏科技貿易有限公司'; pres.company = 'WEIBO'; pres.title = 'WEIBO 新品簡報模板';

  cover(pres, 'NEW PRODUCT · 2026 Q4', 'ACEFAST T8 真無線藍牙耳機\n上市提案', '台灣總代理 ｜ 對象：momo・PChome MD／區域經銷商', '威柏科技貿易有限公司 ｜ 電商通路部 ｜ 2026.09（範例內容，請替換）');

  let s = inner(pres, 'AGENDA', '今天要談的五件事', 1);
  txt(s, bullets(['產品定位與三大賣點', '規格與包裝內容', '同價位競品比較', '上市時程與行銷資源', '價格結構與供貨條件']), { x: M, y: 2.0, w: 6.2, h: 3.6, fontSize: 18, color: C.G900, valign: 'top', lineSpacingMultiple: 1.2 });
  card(s, 7.2, 2.0, 5.57, 3.4, '本次提案重點', '首批 2,000 pcs 現貨\n建議售價 NT$ 1,990\n10/01 momo 首賣、11/11 KOL ×3\n18 個月原廠保固，太保倉 D+1 出貨', { fill: C.B50, line: C.B50, headColor: C.B700, bodySize: 14, bodyColor: C.G900 });

  s = inner(pres, 'ABOUT WEIBO', 'WEIBO 威柏科技：台灣最強品牌落地能力', 2);
  txt(s, '2015 年成立，專營 3C 品牌總代理。以供應鏈管理、全通路營運與資訊系統整合，協助國際品牌在 500+ 實體據點與 11 個主流電商平台快速落地。', { x: M, y: 1.8, w: 12.2, h: 0.8, fontSize: 14, color: C.G600 });
  const cw = (W - 2 * M - 0.4) / 3;
  card(s, M, 2.85, cw, 2.6, '體驗 ｜ WEiZ', '自營專櫃與商城（嘉義・高雄・台中），OMO 整合，直接面對消費者。');
  card(s, M + cw + 0.2, 2.85, cw, 2.6, '科技 ｜ WEIBO', '代理、供應鏈、全通路營運、資訊系統。讓品牌被看見、被喜歡、被信任。', { fill: C.B50, line: C.BLUE, headColor: C.B700 });
  card(s, M + 2 * (cw + 0.2), 2.85, cw, 2.6, '未來 ｜ WEILIFE', '台灣原創 3C 品牌，自主開發具設計感與實用性的生活產品。');
  txt(s, 'WiWU ・ ACEFAST ・ SMASMALL 昔馬 ・ FRAMULA 芬乘（總代理）　另有 50+ 經銷品牌', { x: M, y: 5.7, w: 12.2, h: 0.4, fontSize: 12, color: C.G400 });

  s = inner(pres, 'PRODUCT OVERVIEW', '一句話賣點：40 小時續航的主動降噪耳機', 3);
  s.addShape('roundRect', { x: M, y: 1.95, w: 5.6, h: 4.3, rectRadius: 0.12, fill: { color: C.G50 }, line: { color: C.G50, width: 0 } });
  txt(s, '產品去背圖\n（替換：白底或透明背景，佔框 70%）', { x: M, y: 1.95, w: 5.6, h: 4.3, fontSize: 12, color: C.G400, align: 'center', valign: 'middle' });
  stat(s, 6.7, 2.0, 3, '40h', '總續航（含充電盒）');
  stat(s, 9.9, 2.0, 3, 'ANC', '主動降噪 −35dB');
  stat(s, 6.7, 3.7, 3, 'IPX5', '防水防汗');
  stat(s, 9.9, 3.7, 3, '18 個月', '原廠保固');
  txt(s, '目標客群：通勤與健身的 25–40 歲上班族；購買動機：預算 2,000 內想要 ANC。', { x: 6.7, y: 5.4, w: 6.1, h: 0.8, fontSize: 12.5, color: C.G600 });

  s = inner(pres, 'SPECIFICATIONS', '規格與包裝內容', 4);
  table(s, 1.9, ['項目', '規格', '項目', '規格'], [
    ['藍牙版本', '5.3，雙耳同時傳輸', '單耳續航', '10 小時（ANC 關）'],
    ['晶片', 'Qualcomm QCC3071', '充電盒', '30 小時，Type-C 快充'],
    ['驅動單體', '10mm 動圈', '防水', 'IPX5'],
    ['降噪', 'ANC 混合式 −35dB ＋ ENC 通話', '重量', '單耳 4.6g ／ 含盒 48g'],
    ['編碼', 'aptX Adaptive・AAC・SBC', '包裝內容', '耳機・充電盒・耳塞 S/M/L・線・說明書'],
    ['顏色', '黑・白・藍', '保固', '18 個月（原廠）'],
  ], [1.7, 4.4, 1.7, 4.41], { fs: 12 });

  s = inner(pres, 'COMPARISON', '與同價位競品比較', 5);
  table(s, 1.9, ['項目', 'ACEFAST T8', '競品 A', '競品 B'], [
    ['建議售價', 'NT$ 1,990', 'NT$ 2,290', 'NT$ 1,890'],
    ['總續航', '40 小時', '30 小時', '24 小時'],
    ['降噪', 'ANC −35dB', 'ENC 通話降噪', '無'],
    ['防水', 'IPX5', 'IPX4', 'IPX4'],
    ['保固', '18 個月', '12 個月', '12 個月'],
    ['台灣售後', '威柏太保倉 D+2 檢測', '原廠寄送海外', '通路代收'],
  ], [2.6, 3.2, 3.2, 3.21], { fs: 13 });
  txt(s, '資料日期 2026.09；競品價格取 momo 頁面標價，替換時請更新。', { x: M, y: 5.6, w: 12, h: 0.3, fontSize: 10, color: C.G400 });

  s = inner(pres, 'LAUNCH PLAN', '上市時程與檔期', 6);
  steps(s, 2.0, [
    { head: '10/01', body: 'momo 首賣\n站內 BN、mo 幣回饋 5%\n關鍵字廣告首週 $1,000/品' },
    { head: '10/15', body: 'PChome 24h\n3C 品類活動\n品牌館上架' },
    { head: '11/11', body: '雙 11 檔期\nKOL ×3 開箱（我是賴瑞等）\n折扣：滿千折百' },
    { head: '12/01', body: '實體通路\n燦坤・全國電子・三井 3C\nWEiZ 三櫃體驗陳列' },
  ], 2.4);
  txt(s, '每一檔提報表由電商通路部於檔期前 14 天送 MD／PM，回壓後於前台巡查。', { x: M, y: 4.75, w: 12.2, h: 0.4, fontSize: 12.5, color: C.G600 });

  s = inner(pres, 'PRICING & TERMS', '價格結構與供貨條件', 7);
  card(s, M, 1.95, 6.0, 3.3, '價格結構', '建議售價　NT$ 1,990\n經銷價　　依合約級距\n活動價　　最低 NT$ 1,690（限雙 11）\n最低售價　依經銷合約，不得低於 NT$ 1,590', { bodySize: 14, bodyColor: C.G900 });
  card(s, M + 6.2, 1.95, 6.01, 3.3, '供貨與售後', '首批到貨　2,000 pcs（2026.09.25 入太保倉）\n出貨　　　D+1，momo 轉單／三方物流\n保固　　　18 個月原廠保固\n檢測維修　威柏售後 D+2 判定、D+7 完修', { bodySize: 14, bodyColor: C.G900 });
  txt(s, '報價有效 30 天，含稅未含運；單筆滿 3 萬免運。', { x: M, y: 5.5, w: 12, h: 0.35, fontSize: 12, color: C.G400 });

  s = inner(pres, 'MARKETING SUPPORT', '威柏提供的行銷資源', 8);
  const mw = (W - 2 * M - 0.4) / 3;
  card(s, M, 1.95, mw, 3.4, '素材包', '主圖、情境圖、短影音 15s／30s、圓標底標、活動 BN 模板；上架前 7 天交付。');
  card(s, M + mw + 0.2, 1.95, mw, 3.4, 'KOL 與口碑', '我是賴瑞、Onion man 洋蔥男、人夫阿康開箱；Dcard／PTT 體驗文佈局。');
  card(s, M + 2 * (mw + 0.2), 1.95, mw, 3.4, '廣告與流量', '站內關鍵字廣告出價、ROAS 監控；站外社群與聯盟行銷導流（UTM 追蹤）。');

  closing(pres, 'CONTACT', '讓品牌在台灣被看見、被喜歡、被信任', '電商通路部 ｜ 05-3209919 #236 ｜ weibo.sd8@weiboltd.com\n威柏科技貿易有限公司 ｜ 嘉義縣太保市健康路 187 號 1 樓 ｜ www.weiboltd.com');

  pres.writeFile({ fileName: 'WEIBO_新品簡報模板.pptx' }).then(() => console.log('A done'));
})();

/* ───────────── B. 新進員工簡報 ───────────── */
(function buildB() {
  const pres = new pptxgen(); pres.layout = 'LAYOUT_WIDE'; pres.lang = 'zh-TW';
  pres.author = '威柏科技貿易有限公司'; pres.company = 'WEIBO'; pres.title = 'WEIBO 新進員工簡報模板';

  cover(pres, 'ONBOARDING · 2026', '新進人員引導與職務培訓', '電商通路部 ｜ 電商行銷助理 ｜ 我們相互賦能，共創價值', '培訓對象 ○○○ ｜ 員工編號 T2026XX ｜ 到職 2026.XX.XX ｜ 培訓導師 黃冠博 Gary（範例，請替換）');

  let s = inner(pres, 'AGENDA', '今天會講四件事', 1);
  steps(s, 2.0, [
    { head: '01 關於威柏', body: '三軸使命、六大核心價值、品牌矩陣' },
    { head: '02 組織與你的位置', body: '職能架構、直屬主管、協作部門' },
    { head: '03 職能與 90 天藍圖', body: '核心職能、三個檢核點、個人職能手冊' },
    { head: '04 系統與第一週', body: '帳號開通、第一週時程、週報節奏' },
  ], 2.2);
  txt(s, '培訓原則：邊學邊記，最終產出自己的《個人職能手冊》；不懂就當場問，不要留到事後。', { x: M, y: 4.6, w: 12.2, h: 0.4, fontSize: 13, color: C.G600 });

  s = inner(pres, 'OUR MISSION', '一個生態系，三種承諾', 2);
  txt(s, '公司願景：成為亞洲最具影響力的科技生活創新生態平台\nWEI = We Empower Innovation → 我們相互賦能，共創價值', { x: M, y: 1.8, w: 12.2, h: 0.9, fontSize: 14, color: C.G600, lineSpacingMultiple: 1.3 });
  const cw = (W - 2 * M - 0.4) / 3;
  card(s, M, 2.95, cw, 2.7, '體驗 ｜ WEiZ', '讓科技變得更友善。透過專櫃、體驗店與 OMO 整合，打造「放心試、安心買、開心用」的環境。');
  card(s, M + cw + 0.2, 2.95, cw, 2.7, '科技 ｜ WEIBO', '台灣最強品牌落地能力。以專業代理、供應鏈管理與全通路營運，協助全球科技品牌落地台灣。', { fill: C.B50, line: C.BLUE, headColor: C.B700 });
  card(s, M + 2 * (cw + 0.2), 2.95, cw, 2.7, '未來 ｜ WEILIFE', '重新定義生活質感。以未來視角自主開發產品，探索下一個世代的生活方式。');

  s = inner(pres, 'CORE VALUES', '品牌靈魂：六大核心價值', 3);
  const vals = [['自由與責任', '各抒己見、勇於發聲；共識形成後全力負責。'], ['顧客至上', '以用戶需求為核心快速行動，落實「用心、放心、貼心」。'], ['成長心態', '保持好奇心、擁抱變化、勇於升級。'], ['凡事從簡', 'Less is More。以最有效率的方式完成最重要的事。'], ['永續經營', '追求長期更好、更強與更有意義。'], ['創造價值', '每一次交付、互動與產出，都必須帶來實質價值。']];
  const vw = (W - 2 * M - 0.4) / 3, vh = 1.75;
  vals.forEach(([h, b], i) => card(s, M + (i % 3) * (vw + 0.2), 1.95 + Math.floor(i / 3) * (vh + 0.2), vw, vh, h, b, { bodySize: 12 }));

  s = inner(pres, 'BRAND PORTFOLIO', '你將接觸的品牌矩陣', 4);
  table(s, 1.9, ['品牌', '類型', '定位', '主力商品'], [
    ['WEILIFE', '自有品牌', '以未來視角開發產品，台灣設計', '特殊 3C、麥克風音響、磁吸無線充電'],
    ['WiWU', '總代理', '為現代游牧工作者而生', '行動電源、無線充電、保護膜、HUB'],
    ['ACEFAST', '總代理', '「探索科技美學」透明系列', '藍牙耳機、充電器、傳輸線、支架'],
    ['SMASMALL 昔馬', '總代理', '復古未來主義個護', '鋅合金電動刮鬍刀禮盒'],
    ['FRAMULA 芬乘', '總代理', '嗅覺科技 × 調香工藝', '居家擴香儀、車載香氛、寵物香氛'],
    ['50+ 經銷品牌', '經銷', '上架前先確認總代理或經銷，定價權限不同', '—'],
  ], [2.3, 1.5, 4.2, 4.21], { fs: 12 });

  s = inner(pres, 'ORGANIZATION', '組織架構與你的位置', 5);
  steps(s, 1.95, [
    { head: '威柏', body: '代理進口與商品 PM\n平台電商營運 ★\n行銷業務：品牌行銷、經銷業務', highlight: true },
    { head: 'WEiZ', body: '後勤：供貨採購、供應商管理、營運管理、行銷活動\n現場：嘉義・高雄・台中櫃位' },
    { head: '客服與商品保', body: '客服\n代理商品檢測與維修' },
    { head: '資訊與系統管理', body: '帳號權限、設備\n人資與合約' },
    { head: '倉儲與物流', body: '內倉／外倉庫存\n代理商品倉管\n進出貨與物流對帳' },
  ], 2.7);
  txt(s, '★ 你在「平台電商營運」（momo／PChome／Pinkoi／蝦皮），直屬主管：○○○。每天最常協作：倉儲物流（出貨）、客服與商品保（客訴）、行銷業務（素材）。', { x: M, y: 4.95, w: 12.2, h: 0.7, fontSize: 12.5, color: C.G600 });

  s = inner(pres, 'GROWTH ROADMAP', '90 天成長藍圖：從 0 到轉正', 6);
  steps(s, 1.95, [
    { head: '前 3 日', body: '熟悉三軸品牌與組織\n帳號開通：T8／NAS／信箱／後台\n▶ 認知驗收' },
    { head: '第 1 個月', body: '第一週打底、第二週輪崗\n第三週 momo 實戰\n▶ 操作驗收' },
    { head: '第 2 個月', body: '獨立操作平台日常\n主責 1 檔完整活動\n啟動 KOL 邀約' },
    { head: '第 3 個月', body: '獨立主責 1–2 個平台\n數據化成效覆盤\n▶ 轉正面談', highlight: true },
  ], 2.6);
  txt(s, '每階段結束由培訓導師檢核，未達標則延長輔導期；每週五提交工作週報。', { x: M, y: 4.85, w: 12.2, h: 0.4, fontSize: 12.5, color: C.G600 });

  s = inner(pres, 'CORE COMPETENCIES', '電商行銷核心職能（必備能力）', 7);
  const comps = [['數字敏感度', '看得懂銷量、毛利率、ROAS、DOI；每個決策都能用數字說明。'], ['平台規則熟練度', '活動機制、抽成、罰則與時限都不同，規則就是成本。'], ['細心與時效意識', '出貨 D+1、客訴 D+2、評價 D+5，遲一天就是罰金。'], ['跨部門溝通', '串接倉儲、品保、行銷、採購，任一環節斷線檔期就開天窗。'], ['競品與趨勢敏感', '掌握競品價格、案型、素材，作為與 MD 談版位的籌碼。'], ['成長心態與 AI 工具', '主動學習；善用 AI 提升素材產出與資料整理效率。']];
  comps.forEach(([h, b], i) => card(s, M + (i % 3) * (vw + 0.2), 1.95 + Math.floor(i / 3) * (vh + 0.2), vw, vh, h, b, { bodySize: 12 }));

  s = inner(pres, 'SYSTEMS', '你會用到的系統與帳號', 8);
  table(s, 1.9, ['系統', '用途', '入口', '帳號'], [
    ['人資考勤 NUEiP', '打卡、請假、福利假申請', 'NUEiP 網頁／APP', '員工編號'],
    ['NAS 雲端', '檔案存取與歸檔規則', 'QuickConnect', '員工編號'],
    ['Email、行事曆', '對外聯繫、MD／PM 提報信件', 'webmail.weiboltd.com', '員工編號@weiboltd.com'],
    ['ERP 正航 T8 ★', '電商發貨單、調撥單、庫存查詢', 'T8 應用程式（電腦版）', '員工編號'],
    ['雲端總機 EVOX', '客服來電接聽', '分機', '行政配發'],
    ['CubeLV ／ Notion', '專案、AI 工作、會議紀錄、定稿登記', '網頁', '公司 Google 帳號'],
  ], [2.6, 4.2, 3.0, 2.41], { fs: 12 });
  txt(s, '初始密碼由行政管理部另行提供，首次登入請立即更改；帳密不得外借，不寫在任何簡報或文件內。', { x: M, y: 5.35, w: 12.2, h: 0.4, fontSize: 11.5, color: C.G400 });

  s = inner(pres, 'WEEK 1', '你的第一個星期', 9);
  table(s, 1.9, ['日', '上午', '下午', '產出／檢核'], [
    ['第 1 日', '公司概覽：三軸、組織、通路與產品', '系統入門：T8 查詢、信箱、NAS、分機；建立個人 AI 助理', '完成所有帳號登入'],
    ['第 2 日', 'momo／PChome 後台導覽', '職能①–④：上架、提報、撈單出貨、客服評價', '獨立完成一筆轉單出貨'],
    ['第 3 日', '職能⑤–⑦：站內廣告、素材、流量推廣', '產品毛利試算：抽成、運費、後扣、mo 幣', '毛利試算表一份'],
    ['第 4 日', '倉儲品保輪崗：收貨、檢測、退貨路徑', '行銷業務輪崗：素材需求、經銷提報', '輪崗筆記'],
    ['第 5 日', '週報格式與提交機制', '首週驗收：導師檢核前四日交辦', '個人職能手冊初稿'],
  ], [1.2, 3.9, 4.4, 2.71], { fs: 11.5, rowH: 0.55 });

  closing(pres, 'WELCOME', '再次歡迎加入威柏科技', '讓我們相互賦能，共創精彩生活與未來。\n培訓導師 黃冠博 Gary ｜ 直屬主管 ○○○ ｜ 有問題直接問，不要留到事後');

  pres.writeFile({ fileName: 'WEIBO_新進員工簡報模板.pptx' }).then(() => console.log('B done'));
})();
