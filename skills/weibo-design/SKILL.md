---
name: weibo-design
description: WEIBO 威柏科技（威柏科技貿易有限公司）品牌識別規範 V1.0 與素材庫。**任何以威柏／WEIBO 名義對外或對內的產出都必須先讀這個 skill**——簡報（新品提案、新進員工培訓、原廠簡介）、報價單、合約、公文、信封信紙、出貨箱貼、封箱膠帶、名片、Email 簽名、104／LinkedIn 封面、官網頁面、組織圖、系統架構圖、新聞稿與公司簡介文案。提供 Logo 13 檔、名片 AI 原檔、主色 #5D59FF 與 Navy #1E2A5E、字體、間距、文件編號規則、六部門組織圖、系統名稱表，以及可直接套用的 PPTX／DOCX 模板。當用戶提到「威柏」「WEIBO」「總代理」「經銷商提案」「原廠簡報」「報價單」「合約外框」「公司簡介」「組織圖」「名片」「新進員工簡報」「套公司規範」時觸發；WEiZ 專櫃、商城、消費者社群素材請改用 weiz-design。預設繁體中文（台灣）、`lang="zh-Hant"`。
---

# WEIBO Design System — 威柏科技品牌規範 V1.0

WEIBO 威柏科技貿易有限公司 · 3C 品牌總代理與供應鏈節點 · 2015 年成立於嘉義
企業標語：「讓科技更貼近生活，讓未來觸手可及」　核心精神：WEI — We Empower Innovation｜我們相互賦能，共創價值

**做任何 WEIBO 產出前，先讀 `BRAND_RULES.md`（完整規範）。** 組織圖、系統名稱、文件編號見 `ORG_AND_SYSTEMS.md`。
完整品牌書與應用範例的 HTML 在 `examples/`，可直接開啟對照。

WEIBO 與 WEiZ 是同集團：色彩 token、字體、間距共用；Logo、家族架構、文案語氣、應用版型為 WEIBO 專屬。
對消費者的 WEiZ 素材（專櫃、商城、社群）請用 `weiz-design`，不要混用。

---

## 0. 不可違反的六條

1. **名稱**：英文永遠寫 `WEIBO`（五個字母全大寫）。禁止 `Weibo`／`WeiBo`／`weibo`／`WEI BO`（後者只出現在英文全名 WEI BO TECHNOLOGY TRADE CO., LTD）。中英並列寫「WEIBO 威柏科技」。對外帳號、網域、Hashtag 用 `weiboltd` 或帶中文並列，不單獨用 WEIBO 五字母。
2. **Logo**：標誌（雙葉＋圓點）顏色、比例、相對位置不得更動；文字只能黑或白。只用 `assets/logos/` 的 13 個檔，不重打字標、不拆解重排。安全距離 = 標誌高的 ½。
3. **主色**：`#5D59FF`（與 WEiZ 集團共用）；深底用 Navy `#1E2A5E`；文字 `#333333`，禁純黑。不用促銷紅金；湖水藍 `#4DAAC0` 只出現在名片。
4. **比例 70 / 20 / 10**：70% 白／`#F4F4F8`，20% 主色，10% Navy 與灰。
5. **語氣**：B2B。對原廠、經銷商、通路採購、求職者說話，用「我們／貴公司」，用數字不用形容詞，**禁 Emoji、禁吉祥物**（太空人只屬於 WEiZ）。
6. **文件**：所有落地文件套「表頭 Logo＋右側灰色英文／文件資訊表／頁尾細線＋頁碼」的共同外框；合約每頁加「機密」水印；文件編號留給 CubeLV 文件收件匣賦予，模板只寫格式提示。

---

## 1. 動手前的流程

1. 讀 `BRAND_RULES.md`。要做組織圖、系統圖、寫文件編號時再讀 `ORG_AND_SYSTEMS.md`。
2. 從 `templates/` 挑現成檔當起點（見 §3）；要做 HTML 時，把 §2 的 token 寫進 `<style>`，Logo 用 `assets/logos/cropped/` 的裁切版轉 base64 內嵌。
3. 產出後逐條跑 §5 檢查清單，再依公司「AI 產出驗證規範」附驗證區塊（`ai-output-check` skill）。

---

## 2. 速查表

| 項目 | 規格 |
|---|---|
| 主色 / hover / press | `#5D59FF` / `#4A46E6` / `#3A37C2` |
| 淺色 / 淡填充 | `#A3A3FF` / `#D6D5FF` / `#EEEEFF` |
| Navy（深底、封面、頁尾） | `#1E2A5E` |
| 中性 | `#FFFFFF` → `#F4F4F8` → `#E4E4EA` → `#999999` → `#666666` → `#333333` |
| 標誌灰 | `#979797`（標誌本身，不另作 UI 色） |
| 功能色（僅狀態） | 綠 `#1E9E6A` 成功・琥珀 `#E8A317` 注意・紅 `#D93A1F` 錯誤・藍 `#3C62EF` 連結 |
| 名片專用 | 深藍 `#1B3065`＋湖水藍 `#4DAAC0`（只用在名片，以 AI 檔為準） |
| 品牌漸層 | `linear-gradient(135deg,#5D59FF 0%,#3A37C2 50%,#1E2A5E 100%)`，只用於封面／Hero／104 封面／信封背面 |
| 字體 | 英數 Inter・中文 Noto Sans TC；Office 檔用 Arial＋微軟正黑體；**禁明體** |
| 字級 | Hero 48–56 / H1 36 / H2 26 / Body 16 / Caption 13；眉標全大寫 `letter-spacing:.12–.3em` |
| 間距 | X = 25px 倍數；數位邊距 50px；A4 邊距 20mm；簡報 16:9 邊距 0.6in |
| 圓角 | 圖示 2px・表格／輸入框 8px・按鈕 12px・卡片 16px |
| 簡報語言 | 左上漸層斜體數字＋斜線眉標＋斜切線；右上波紋線稿；白色圓角卡＋淡紫陰影；圓形 Lucide 圖示；頁碼膠囊右下；⑥ 英文橫式黑字 Logo 左下 |
| 文件語言 | 表頭：④ 公司名橫式 Logo 高 9mm ＋ 右側兩行灰色英文全大寫；文件資訊表左欄灰底；章節標題主色；表格表頭主色底白字；頁尾細線＋頁碼 |
| Logo 位置 | 左上或左下；**不放右下**（右下是 WEiZ 慣例） |
| 文件編號 | 合約 `CON`+YYMMDD+NN・公文 `PM-`+YYYYMMDD+NN・報價／其他 `DOC-`+YYYYMMDD+`-`+NN，由文件收件匣賦予 |
| 檔名 | `YYYYMMDD_部門_主題_v版本`；升版不覆蓋 |

---

## 3. 版型與素材索引

| 要做什麼 | 直接用這個 |
|---|---|
| 新品／通路提案簡報 | `templates/20260910_行政_WEIBO新品簡報模板_v2.pptx`（10 頁：封面、議程、三軸、產品總覽、規格、競品、時程、價格條件、行銷資源、結尾） |
| 新進員工／培訓簡報 | `templates/20260910_人資_WEIBO新進員工簡報模板_v2.pptx`（11 頁） |
| 報價單 | `templates/20260910_行政_WEIBO報價單模板_v2.docx` |
| 合約（含機密水印） | `templates/20260910_行政_WEIBO合約模板_v2.docx` |
| 名片 | `templates/business-card/WEIBO_名片_印刷檔.ai`（正背面，92×51mm 含出血）；只換部門、姓名、英文名、手機、分機、信箱六個文字層。電子名片用 `WEIBO_電子名片.ai` |
| 信封信紙、箱貼、膠帶、104 封面、Email 簽名 | 規格與示意見 `examples/WEIBO 應用範例集 V1.0.html` 第 01–03 章 |
| 組織圖、系統架構圖 | `ORG_AND_SYSTEMS.md`；視覺版見範例集第 06–08 章 |
| 重建模板或素材 | `templates/source/build_pptx_v2.js`・`build_docx_v2.js`・`build_assets.js`（pptxgenjs、docx、sharp） |
| 完整規範原文 | `examples/WEIBO VIS 品牌識別規範 V1.0.html`（16 章） |

**Logo 檔（`assets/logos/`）**
- 六種版型 × 黑／白字：`weibo_full_stacked_*`（① 完整直式）、`weibo_full_wide_*`（② 完整寬版）、`weibo_corp_stacked_*`（③ 公司名直式）、`weibo_corp_horizontal_*`（④ 公司名橫式，文件表頭）、`weibo_zh_horizontal_*`（⑤ 中文橫式，箱貼）、`weibo_en_horizontal_*`（⑥ 英文橫式，簡報頁尾、網站 header）
- `weibo_logomark.png`：標誌單獨，限 favicon、頭像、App icon、Loading、頁尾小圖
- `cropped/`：去除透明邊的裁切版，排版時優先用這裡的檔（原檔是 900×900 正方畫布，直接放會顯得很小）

**品牌素材（`assets/brand/`）**：`bg_cover.png`（漸層封面）、`bg_inner.png`（內頁淡紫底＋波紋）、`wave_purple.png`／`wave_white.png`、`header_rule.png`（斜切線）、`watermark_confidential.png`（機密水印）、`logomark_color.png`

---

## 4. 各類產出的預設做法

- **簡報**：一律從兩套 PPTX 之一改。每頁要有圖示、卡片或表格，不做純文字頁；封面與結尾用漸層底；內頁標題 28pt 主色；字型微軟正黑體＋Arial。
- **報價單／合約／公文**：套共同外框。合約每頁機密水印；金額右對齊千分位；簽署欄兩欄表格、表頭主色。條文屬法務範圍，模板只給示範，交付時註明需法務或顧問審閱。
- **公司簡介、新聞稿、原廠提案文案**：依 `BRAND_RULES.md` §9 的七段品牌敘事順序寫；只引用總經理黃冠博的話；第一次出現寫全名「威柏科技貿易有限公司（以下簡稱『威柏科技』）」。
- **HTML 頁面**：`lang="zh-Hant"`；token 內嵌；圖片 base64；漸層數字用 `background-clip:text`；波紋線稿用範例集內的 JS 生成函式。
- **與代理品牌並列**：代理品牌 Logo 在前、WEIBO 在後，中間 1px 灰直線，視覺等高；發票、合約、公文只放 WEIBO。
- **與 WEiZ／WEILIFE 並列**：WEIBO 在前，可大 1.2 倍。

---

## 5. 交付前檢查清單

- [ ] `lang="zh-Hant"`；名稱寫法 **WEIBO**，中英並列「WEIBO 威柏科技」
- [ ] Logo 用原檔六種版型之一或標誌單獨檔；未改色、未加框陰影；安全距離 ≥ 標誌高 ½
- [ ] 主色 `#5D59FF`、深底 Navy、文字 `#333333`；沒有促銷紅金；湖水藍只在名片
- [ ] 字型 Noto Sans TC＋Inter（Office：微軟正黑體＋Arial），沒有明體
- [ ] 中英之間半形空格；型號不加空格
- [ ] 沒有 Emoji、沒有吉祥物；Logo 在左上或左下
- [ ] 文件有共同外框：表頭、文件資訊表、頁尾頁碼；合約有機密水印
- [ ] 文件編號留格式提示，未自行編號；檔名 `YYYYMMDD_部門_主題_v版本`
- [ ] 六部門名稱正確：人才資源部、行政管理部、WEiZ 營運部、售後品保部、行銷業務部、電商通路部
- [ ] 帳號密碼、成本價、薪資不出現在任何素材
- [ ] 附 AI 產出驗證區塊（`ai-output-check`）

---

## 6. 沒有明確需求時

先問三件事：**對象**（原廠／經銷商／通路 MD／求職者／內部）、**媒體**（簡報／文件／印刷／網頁）、**要他們做什麼**。
然後以威柏科技品牌設計師的身分產出，預設 HTML 或直接套 PPTX／DOCX 模板。

> 版本：WEIBO VIS V1.0，2026-09-10 總經理審核通過。v1.1 待補：Logo 向量檔、CMYK 色票、現場影像庫、代理品牌授權附錄。
> 在 Claude 桌面版／網頁版：Artifact 無法讀 skill 內檔案，Logo 請轉 base64 內嵌；Lucide CDN 不會載入，圖示需手寫 SVG（線條 1.75–2px、主色）。
