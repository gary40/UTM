// WEIBO 報價單／合約 標準外框 v2 — 對齊現行已上線合約（BB009001）版式，合約加「機密」水印
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, Header, Footer, ImageRun, PageNumber, AlignmentType, BorderStyle, ShadingType, VerticalAlign, TabStopType, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign } = require('docx');

const P = '5D59FF', P1 = 'D6D5FF', G50 = 'F4F4F8', G200 = 'E4E4EA', G400 = '999999', G600 = '666666', G800 = '444444', G900 = '333333';
const FONT = { ascii: 'Arial', hAnsi: 'Arial', eastAsia: 'Microsoft JhengHei', cs: 'Arial' };
const logo = fs.readFileSync('logo_corp_black.png'); // 896×150
const mark = fs.readFileSync('assets/logomark_color.png');
const wm = fs.readFileSync('assets/watermark_confidential.png');
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const hair = { style: BorderStyle.SINGLE, size: 4, color: G200 };
const PAGE_W = 11906, PAGE_H = 16838, MARG = 1134, CONTENT = PAGE_W - 2 * MARG;

const run = (text, o = {}) => new TextRun(Object.assign({ text, font: FONT, size: 18, color: G800 }, o));
const para = (children, o = {}) => new Paragraph(Object.assign({ children: Array.isArray(children) ? children : [children] }, o));
const cell = (children, width, o = {}) => new TableCell(Object.assign({ children: Array.isArray(children) ? children : [children], width: { size: width, type: WidthType.DXA }, margins: { top: 70, bottom: 70, left: 120, right: 120 } }, o));

function header(rightTop, rightBottom, watermark) {
  const kids = [
    new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [CONTENT * 0.5, CONTENT * 0.5], borders: noBorders, rows: [new TableRow({ children: [
      cell(para(new ImageRun({ type: 'png', data: logo, transformation: { width: 214, height: 36 } })), CONTENT * 0.5, { verticalAlign: VerticalAlign.CENTER, margins: { top: 0, bottom: 0, left: 0, right: 0 } }),
      cell([para(run(rightTop, { size: 13, color: G400, characterSpacing: 20 }), { alignment: AlignmentType.RIGHT }), para(run(rightBottom, { size: 13, color: G400, characterSpacing: 20 }), { alignment: AlignmentType.RIGHT })], CONTENT * 0.5, { verticalAlign: VerticalAlign.CENTER, margins: { top: 0, bottom: 0, left: 0, right: 0 } }),
    ] })] }),
    para(run(''), { border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P1 } }, spacing: { before: 60, after: 160 } }),
  ];
  if (watermark) kids.unshift(para(new ImageRun({ type: 'png', data: wm, transformation: { width: 520, height: 520 }, floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, align: HorizontalPositionAlign.CENTER }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, align: VerticalPositionAlign.CENTER }, behindDocument: true, allowOverlap: true, wrap: { type: 0 } } })));
  return new Header({ children: kids });
}
function footer(text) {
  return new Footer({ children: [para([
    new ImageRun({ type: 'png', data: mark, transformation: { width: 16, height: 16 } }),
    run('  ' + text, { size: 13, color: G400 }),
    new TextRun({ text: '\t', font: FONT }),
    run('第 ', { size: 13, color: G400 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 13, color: G400 }), run(' 頁', { size: 13, color: G400 }),
  ], { border: { top: { style: BorderStyle.SINGLE, size: 6, color: P1 } }, spacing: { before: 100 }, tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }] })] });
}
const title = (t) => para(run(t, { bold: true, size: 40, color: P }), { spacing: { before: 120, after: 260 } });
const h2 = (t) => para(run(t, { bold: true, size: 22, color: P }), { spacing: { before: 280, after: 100 } });
const body = (t, o = {}) => para(run(t, Object.assign({ size: 18, color: G800 }, o)), { spacing: { after: 90, line: 300 } });
const bullet = (t) => para([run('•  ', { color: P }), run(t)], { indent: { left: 360 }, spacing: { after: 60, line: 300 } });

// 文件資訊表：左欄灰底標籤（如現行合約）
function metaTable(rows) {
  const lw = 2400, vw = CONTENT - lw;
  return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [lw, vw], borders: { top: hair, bottom: hair, left: hair, right: hair, insideHorizontal: hair, insideVertical: hair },
    rows: rows.map(([k, v]) => new TableRow({ children: [
      cell(para(run(k, { size: 17, color: G600 })), lw, { shading: { type: ShadingType.CLEAR, fill: G50, color: 'auto' } }),
      cell(para(run(v, { size: 17, color: G900 })), vw),
    ] })) });
}
function itemsTable(headers, rows, widths, rightCols = []) {
  const hdr = new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(para(run(h, { bold: true, color: 'FFFFFF', size: 16 }), { alignment: rightCols.includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT }), widths[i], { shading: { type: ShadingType.CLEAR, fill: P, color: 'auto' } })) });
  const rws = rows.map((r, ri) => new TableRow({ children: r.map((t, i) => cell(para(run(String(t), { size: 17, color: i === 1 ? G900 : G600 }), { alignment: rightCols.includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT }), widths[i], { shading: ri % 2 ? { type: ShadingType.CLEAR, fill: 'F9F9FE', color: 'auto' } : undefined })) }));
  return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: widths, borders: { top: hair, bottom: hair, left: NONE, right: NONE, insideHorizontal: hair, insideVertical: NONE }, rows: [hdr, ...rws] });
}
// 簽署欄：兩欄表格，表頭主色（如現行合約第 6 頁）
function signTable(lh, rh, lines) {
  const w = CONTENT / 2, box = { top: hair, bottom: hair, left: hair, right: hair, insideHorizontal: hair, insideVertical: hair };
  const hdr = new TableRow({ children: [lh, rh].map(t => cell(para(run(t, { bold: true, color: 'FFFFFF', size: 17 })), w, { shading: { type: ShadingType.CLEAR, fill: P, color: 'auto' } })) });
  const rows = lines.map(([l, r]) => new TableRow({ children: [cell(para(run(l, { size: 17 })), w, { margins: { top: 110, bottom: 110, left: 140, right: 140 } }), cell(para(run(r, { size: 17 })), w, { margins: { top: 110, bottom: 110, left: 140, right: 140 } })] }));
  return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [w, w], borders: box, rows: [hdr, ...rows] });
}
const totalLine = (k, v, big) => para([run(k, { size: big ? 19 : 17, color: G600 }), run('　' + v, { size: big ? 24 : 17, bold: big, color: big ? P : G900 })], { alignment: AlignmentType.RIGHT, spacing: { after: 40 } });

const baseDoc = (hdr, ftr, children) => new Document({
  creator: '威柏科技貿易有限公司', title: 'WEIBO 文件模板',
  styles: { default: { document: { run: { font: FONT, size: 18, color: G800 } } } },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: 1560, bottom: 1000, left: MARG, right: MARG, header: 560, footer: 480 } } }, headers: { default: hdr }, footers: { default: ftr }, children }],
});

/* ── 報價單 ── */
const quotation = baseDoc(
  header('WEI BO TECHNOLOGY TRADE CO., LTD', 'QUOTATION - BUSINESS DOCUMENT', false),
  footer('威柏科技貿易有限公司｜報價文件｜統一編號 55903333｜05-3209919｜www.weiboltd.com'),
  [
    title('報價單'),
    metaTable([['文件編號', 'DOC-YYYYMMDD-NN（由文件收件匣定稿時賦予）'], ['版本', 'V1（2026.09.10）'], ['發文部門', '電商通路部'], ['日期', '2026.09.10'], ['有效期', '報價日起 30 天']]),
    h2('立約雙方'),
    body('客戶（Bill To）：○○○○股份有限公司　統一編號 12345678'),
    bullet('聯絡窗口：採購部 王○○ 經理 ｜ 02-0000-0000 ｜ buyer@example.com'),
    body('供應商（From）：威柏科技貿易有限公司 WEI BO TECHNOLOGY TRADE CO., LTD'),
    bullet('地址：臺灣嘉義縣太保市健康路 187 號 1 樓 ｜ 電話：(05) 320-9919 ｜ 統一編號：55903333'),
    bullet('承辦：電商通路部 ○○○ #236 ｜ weibo.sd8@weiboltd.com'),
    h2('報價品項'),
    itemsTable(['#', '品名／規格', '品號', '數量', '單價', '金額'], [
      ['1', 'ACEFAST T8 真無線藍牙耳機 黑', 'AF-T8-BK', '40', '1,290', '51,600'],
      ['2', 'WiWU 20000mAh 行動電源', 'WW-PB20', '60', '890', '53,400'],
      ['3', 'SMASMALL 黑夜騎士電動刮鬍刀禮盒', 'SM-NK-GB', '24', '2,180', '52,320'],
    ], [500, 3900, 1500, 1000, 1200, 1538], [3, 4, 5]),
    para(run(''), { spacing: { after: 60 } }),
    totalLine('小計', 'NT$ 157,320'), totalLine('營業稅 5%', 'NT$ 7,866'), totalLine('合計（含稅）', 'NT$ 165,186', true),
    h2('交易條件'),
    bullet('付款條件：月結 30 天。'), bullet('交貨：訂單確認後 7 個工作日內出貨（太保倉）。'), bullet('運費：單筆滿 NT$ 30,000 免運，未達者運費 NT$ 150／箱。'), bullet('保固：依各原廠保固條款，由威柏售後品保部受理檢測與維修。'), bullet('本報價含稅，以新台幣計價；逾有效期請重新確認。'),
    para(run(''), { spacing: { after: 240 } }),
    signTable('客戶（Buyer）', '威柏科技貿易有限公司（Seller）', [['公司：', '公司：威柏科技貿易有限公司'], ['代表人／簽章：', '代表人／簽章：'], ['日期（西元）：＿＿＿＿ 年 ＿＿ 月 ＿＿ 日', '日期（西元）：＿＿＿＿ 年 ＿＿ 月 ＿＿ 日']]),
  ]);

/* ── 合約 ── */
const clause = (h, items) => [h2(h), ...items.map((t, i) => body(`${['一', '二', '三', '四', '五'][i]}、${t}`))];
const contract = baseDoc(
  header('WEI BO TECHNOLOGY TRADE CO., LTD', 'CONFIDENTIAL - CONTRACT DOCUMENT', true),
  footer('威柏科技貿易有限公司｜合約文件｜未經書面同意不得轉載或揭露'),
  [
    title('經銷合作合約書'),
    metaTable([['合約編號', 'CONYYMMDDNN（由文件收件匣定稿時賦予）'], ['版本', 'V1.0（2026.09.10 定稿）'], ['發文部門', '行政管理部'], ['日期', '2026.09.10'], ['機密等級', '機密 CONFIDENTIAL']]),
    h2('立約雙方'),
    body('甲方（供應方 / Seller）：威柏科技貿易有限公司 WEI BO TECHNOLOGY TRADE CO., LTD'),
    bullet('地址：臺灣嘉義縣太保市健康路 187 號 1 樓'), bullet('電話：(05) 320-9919'), bullet('代表人：黃冠博 ・ 統一編號：55903333'),
    body('乙方（經銷方 / Distributor）：○○○○股份有限公司'),
    bullet('地址：○○○○○○○○'), bullet('電話：○○-○○○○-○○○○'), bullet('代表人：○○○ ・ 統一編號：12345678'),
    h2('前言'),
    body('甲乙雙方基於誠信互惠原則，就甲方代理商品之經銷合作事宜，同意訂立本合約，條款如下：'),
    ...clause('第一條 合作範圍', ['甲方授權乙方於中華民國境內經銷附件一所列商品。', '乙方不得未經甲方書面同意，將商品轉售至指定通路以外之平台。']),
    ...clause('第二條 價格與付款', ['經銷價格依附件二價格表，甲方調整價格應於 30 日前書面通知。', '付款條件為月結 30 天，乙方應於收到發票後依約付款。']),
    ...clause('第三條 交貨與驗收', ['甲方於訂單確認後 7 個工作日內出貨。', '乙方應於收貨 3 日內完成驗收，逾期視為驗收合格。']),
    ...clause('第四條 保固與售後', ['商品保固依各原廠條款，由甲方售後品保部受理檢測與維修。', '非人為損壞於保固期內免費維修或更換。']),
    ...clause('第五條 保密義務', ['雙方對於因本合約知悉之對方商業機密負保密義務，合約終止後亦同。']),
    ...clause('第六條 合約期間與終止', ['本合約有效期間自簽署日起一年，期滿前 60 日雙方未表示異議則自動延長一年。', '一方重大違約經書面催告未於 30 日內改善者，他方得終止本合約。']),
    ...clause('第七條 準據法與管轄', ['本合約以臺灣地區現行法律為準據法；因本合約所生之爭議，合意以臺灣嘉義地方法院為第一審管轄法院。']),
    body('本合約書經雙方詳閱條款並充分理解後簽署，特立此據，共同信守。（以下條文依實際需求增修；正式合約請經法務或顧問審閱。）', { size: 16, color: G400 }),
    h2('簽署欄'),
    signTable('甲方（供應方）', '乙方（經銷方）', [['公司：威柏科技貿易有限公司', '公司：'], ['代表人：＿＿＿＿＿＿＿＿', '代表人：＿＿＿＿＿＿＿＿'], ['統一編號：55903333', '統一編號：＿＿＿＿＿＿'], ['簽章／用印：', '簽章／用印：'], ['日期（西元）：＿＿＿＿ 年 ＿＿ 月 ＿＿ 日', '日期（西元）：＿＿＿＿ 年 ＿＿ 月 ＿＿ 日']]),
  ]);

Promise.all([
  Packer.toBuffer(quotation).then(b => fs.writeFileSync('20260910_行政_WEIBO報價單模板_v2.docx', b)),
  Packer.toBuffer(contract).then(b => fs.writeFileSync('20260910_行政_WEIBO合約模板_v2.docx', b)),
]).then(() => console.log('docx v2 done'));
