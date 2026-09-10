// WEIBO 報價單／合約 標準外框模板（DOCX）
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, Header, Footer, ImageRun, PageNumber, AlignmentType, BorderStyle, ShadingType, VerticalAlign, TabStopType } = require('docx');

const BLUE = '5252FF', B700 = '3333C2', G200 = 'E4E4EA', G400 = '999999', G600 = '666666', G900 = '333333', G50 = 'F4F4F8';
const FONT = { ascii: 'Arial', hAnsi: 'Arial', eastAsia: 'Microsoft JhengHei', cs: 'Arial' };
const logo = fs.readFileSync('logo_corp_black.png'); // 896×150
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const hair = { style: BorderStyle.SINGLE, size: 4, color: G200 };
const PAGE_W = 11906, MARG = 1134, CONTENT = PAGE_W - 2 * MARG; // A4, 20mm margins

const run = (text, o = {}) => new TextRun(Object.assign({ text, font: FONT, size: 18, color: G900 }, o));
const para = (children, o = {}) => new Paragraph(Object.assign({ children: Array.isArray(children) ? children : [children] }, o));
const cell = (children, width, o = {}) => new TableCell(Object.assign({ children: Array.isArray(children) ? children : [children], width: { size: width, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 } }, o));

function header(docType, metaLines) {
  const metaRuns = [run(docType, { bold: true, size: 20 }), ...metaLines.flatMap(l => [new TextRun({ break: 1 }), run(l, { size: 16, color: G600 })])];
  return new Header({ children: [
    new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [CONTENT * 0.55, CONTENT * 0.45], borders: noBorders, rows: [new TableRow({ children: [
      cell(para(new ImageRun({ type: 'png', data: logo, transformation: { width: 226, height: 38 } })), CONTENT * 0.55, { verticalAlign: VerticalAlign.TOP }),
      cell(para(metaRuns, { alignment: AlignmentType.RIGHT }), CONTENT * 0.45, { verticalAlign: VerticalAlign.TOP }),
    ] })] }),
    para(run(''), { spacing: { after: 120 } }),
  ] });
}
function footer(left) {
  return new Footer({ children: [para([
    run(left, { size: 14, color: G400 }),
    new TextRun({ text: '\t', font: FONT }),
    run('第 ', { size: 14, color: G400 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 14, color: G400 }),
    run(' 頁，共 ', { size: 14, color: G400 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 14, color: G400 }), run(' 頁', { size: 14, color: G400 }),
  ], { border: { top: hair }, spacing: { before: 120 }, tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }] })] });
}
const eyebrow = (t) => para(run(t, { bold: true, size: 14, color: BLUE, characterSpacing: 60 }), { spacing: { before: 240, after: 40 } });
const title = (t) => para(run(t, { bold: true, size: 36 }), { spacing: { after: 240 } });
const label = (t) => para(run(t, { bold: true, size: 14, color: BLUE, characterSpacing: 40 }), { spacing: { after: 40 } });
const small = (t, o = {}) => para(run(t, Object.assign({ size: 16, color: G600 }, o)), { spacing: { after: 40 } });

function partyTable(leftLabel, left, rightLabel, right) {
  const w = (CONTENT - 200) / 2, box = { top: hair, bottom: hair, left: hair, right: hair };
  const mk = (lab, lines) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: box, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [label(lab), ...lines.map(l => small(l, { color: G900 }))] });
  const gap = new TableCell({ width: { size: 200, type: WidthType.DXA }, borders: noBorders, children: [para(run(''))] });
  return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [w, 200, w], borders: noBorders, rows: [new TableRow({ children: [mk(leftLabel, left), gap, mk(rightLabel, right)] })] });
}
function itemsTable(headers, rows, widths, rightCols = []) {
  const hdr = new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(para(run(h, { bold: true, color: 'FFFFFF', size: 16 }), { alignment: rightCols.includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT }), widths[i], { shading: { type: ShadingType.CLEAR, fill: BLUE, color: 'auto' } })) });
  const body = rows.map((r, ri) => new TableRow({ children: r.map((t, i) => cell(para(run(String(t), { size: 17, color: i === 1 ? G900 : G600 }), { alignment: rightCols.includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT }), widths[i], { shading: ri % 2 ? { type: ShadingType.CLEAR, fill: G50, color: 'auto' } : undefined })) }));
  return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: widths, borders: { top: hair, bottom: hair, left: NONE, right: NONE, insideHorizontal: hair, insideVertical: NONE }, rows: [hdr, ...body] });
}
function signTable(left, right) {
  const w = (CONTENT - 600) / 2, top = { top: { style: BorderStyle.SINGLE, size: 6, color: G900 }, bottom: NONE, left: NONE, right: NONE };
  const mk = (lines) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: top, margins: { top: 80, left: 0, right: 0 }, children: lines.map(l => small(l)) });
  return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [w, 600, w], borders: noBorders, rows: [new TableRow({ children: [mk(left), new TableCell({ width: { size: 600, type: WidthType.DXA }, borders: noBorders, children: [para(run(''))] }), mk(right)] })] });
}
const totalLine = (k, v, big) => para([run(k, { size: big ? 20 : 17, color: G600 }), run('　' + v, { size: big ? 24 : 17, bold: big })], { alignment: AlignmentType.RIGHT, spacing: { after: 40 } });

const baseDoc = (hdr, ftr, children) => new Document({
  creator: '威柏科技貿易有限公司', title: 'WEIBO 文件模板',
  styles: { default: { document: { run: { font: FONT, size: 18, color: G900 } } } },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 1020, bottom: 900, left: MARG, right: MARG, header: 500, footer: 420 } } }, headers: { default: hdr }, footers: { default: ftr }, children }],
});

/* ── 報價單 ── */
const quotation = baseDoc(
  header('報價單 QUOTATION', ['單號 Q-2026-0910-018', '日期 2026.09.10 ｜ 有效期 30 天', '承辦 電商業務部 ○○○ #236']),
  footer('威柏科技貿易有限公司 ｜ 統一編號 55903333 ｜ 05-3209919 ｜ www.weiboltd.com'),
  [
    eyebrow('QUOTATION'), title('報價單'),
    partyTable('客戶 BILL TO', ['○○○○股份有限公司', '統一編號 12345678', '採購部 王○○ 經理 ｜ 02-0000-0000'], '供應商 FROM', ['威柏科技貿易有限公司', '統一編號 55903333', '嘉義縣太保市健康路 187 號 1 樓']),
    para(run(''), { spacing: { after: 160 } }),
    itemsTable(['#', '品名／規格', '品號', '數量', '單價', '金額'], [
      ['1', 'ACEFAST T8 真無線藍牙耳機 黑', 'AF-T8-BK', '40', '1,290', '51,600'],
      ['2', 'WiWU 20000mAh 行動電源', 'WW-PB20', '60', '890', '53,400'],
      ['3', 'SMASMALL 黑夜騎士電動刮鬍刀禮盒', 'SM-NK-GB', '24', '2,180', '52,320'],
    ], [500, 3900, 1500, 1000, 1200, 1538], [3, 4, 5]),
    para(run(''), { spacing: { after: 80 } }),
    totalLine('小計', 'NT$ 157,320'), totalLine('營業稅 5%', 'NT$ 7,866'), totalLine('合計（含稅）', 'NT$ 165,186', true),
    eyebrow('TERMS'),
    small('付款條件：月結 30 天。　交貨：訂單確認後 7 個工作日。　運費：單筆滿 NT$ 30,000 免運。'),
    small('保固：依各原廠保固條款。　備註：本報價含稅，以新台幣計價；逾有效期請重新確認。'),
    para(run(''), { spacing: { after: 600 } }),
    signTable(['客戶簽章', '日期：'], ['威柏科技貿易有限公司 簽章', '日期：']),
  ]);

/* ── 合約 ── */
const clause = (h, body) => [para(run(h, { bold: true, size: 20 }), { spacing: { before: 200, after: 60 } }), ...body.map(b => para(run(b, { size: 18, color: G600 }), { spacing: { after: 60 }, indent: { left: 360 } }))];
const contract = baseDoc(
  header('合約 AGREEMENT', ['合約編號 C-2026-0910-005', '簽署日期 2026 年 9 月 10 日', '版本 v1.0 ｜ 機密']),
  footer('威柏科技貿易有限公司 ｜ 合約編號 C-2026-0910-005'),
  [
    eyebrow('DISTRIBUTION AGREEMENT'), title('經銷合作合約書'),
    partyTable('甲方', ['威柏科技貿易有限公司', '統一編號 55903333', '代表人 黃冠博', '嘉義縣太保市健康路 187 號 1 樓'], '乙方', ['○○○○股份有限公司', '統一編號 12345678', '代表人 ○○○', '地址 ○○○○○○○○']),
    para(run('甲乙雙方基於誠信互惠原則，就甲方代理商品之經銷合作事宜，同意訂立本合約，條款如下：', { size: 18, color: G600 }), { spacing: { before: 240, after: 120 } }),
    ...clause('第一條　合作範圍', ['一、甲方授權乙方於中華民國境內經銷附件一所列商品。', '二、乙方不得未經甲方書面同意，將商品轉售至指定通路以外之平台。']),
    ...clause('第二條　價格與付款', ['一、經銷價格依附件二價格表，甲方調整價格應於 30 日前書面通知。', '二、付款條件為月結 30 天，乙方應於收到發票後依約付款。']),
    ...clause('第三條　交貨與驗收', ['一、甲方於訂單確認後 7 個工作日內出貨。', '二、乙方應於收貨 3 日內完成驗收，逾期視為驗收合格。']),
    ...clause('第四條　保固與售後', ['一、商品保固依各原廠條款，由甲方售後單位受理檢測與維修。', '二、非人為損壞於保固期內免費維修或更換。']),
    ...clause('第五條　保密', ['雙方對於因本合約知悉之對方商業機密負保密義務，合約終止後亦同。']),
    ...clause('第六條　合約期間與終止', ['本合約有效期間自簽署日起一年，期滿前 60 日雙方未表示異議則自動延長一年。']),
    para(run('（以下條文依實際需求增修；正式合約請經法務或顧問審閱。）', { size: 16, color: G400 }), { spacing: { before: 120, after: 600 } }),
    signTable(['甲方　威柏科技貿易有限公司', '代表人：', '日期：'], ['乙方', '代表人：', '日期：']),
  ]);

Promise.all([
  Packer.toBuffer(quotation).then(b => fs.writeFileSync('WEIBO_報價單模板.docx', b)),
  Packer.toBuffer(contract).then(b => fs.writeFileSync('WEIBO_合約模板.docx', b)),
]).then(() => console.log('docx done'));
