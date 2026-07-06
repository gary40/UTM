# UTM 連結產生器

一個獨立的全端小工具：前台填寫 UTM 表單，送出後將連結**寫入 SQLite 資料庫**永久存檔，並在頁面列出所有已存檔連結（可複製、刪除、分批載入）。

功能對齊 CubeLV「UTM 連結管理」插件的規則：參數自動正規化（轉小寫、空白轉底線）、落地頁去除既有 `utm_*` 參數避免疊加、必填欄位驗證。

## 技術架構

| 層 | 技術 |
|----|------|
| 後端 | Node.js + Express |
| 資料庫 | SQLite（`better-sqlite3`，檔案存於 `data/utm.db`） |
| 前台 | 原生 HTML / CSS / JavaScript（無框架，`public/`） |

## 目錄結構

```
utm-app/
├── server.js        Express 伺服器與 API 路由
├── db.js            SQLite 連線、建表與 CRUD
├── utm.js           UTM 參數正規化與組網址（前後端規則一致）
├── public/          前台
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── data/            資料庫檔存放處（.db 已在 .gitignore）
├── package.json
└── README.md
```

## 本機執行

需求：Node.js 18 以上。

```bash
npm install     # 安裝 express 與 better-sqlite3（會編譯原生模組）
npm start       # 啟動，預設 http://localhost:3000
```

打開瀏覽器進入 `http://localhost:3000`，填寫表單送出即寫入資料庫。
自訂埠號：`PORT=8080 npm start`。

## API

| 方法 | 路徑 | 說明 |
|------|------|------|
| `GET` | `/api/links?limit=100&offset=0` | 列出已存檔連結（分頁），回 `{ total, items }` |
| `POST` | `/api/links` | 新增。Body：`{ landingUrl, source, medium, campaign, content, term, note }`。成功回 201 與存檔紀錄；驗證失敗回 400 與 `errors` |
| `DELETE` | `/api/links/:id` | 刪除指定連結 |

必填欄位：`landingUrl`（須 http/https）、`source`、`medium`、`campaign`。

## 資料表 `utm_links`

`id / landing_url / source / medium / campaign / content / term / note / full_url / created_at`

## 推上你自己的 GitHub repo

在 GitHub 建立空 repo 後：

```bash
git init
git add -A
git commit -m "初始版本：UTM 連結產生器（前台表單 + SQLite 存檔）"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<repo 名>.git
git push -u origin main
```
