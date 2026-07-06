// UTM 連結產生器 —— Express 伺服器。
// 前台送出表單 → 驗證正規化 → 寫入 SQLite → 回傳存檔結果。
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAndNormalize } from './utm.js';
import { createLink, listLinks, deleteLink, countLinks } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 列表（分頁）：GET /api/links?limit=100&offset=0
app.get('/api/links', (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
  res.json({ total: countLinks(), items: listLinks({ limit, offset }) });
});

// 新增：POST /api/links  { landingUrl, source, medium, campaign, content, term, note }
app.post('/api/links', (req, res) => {
  const { ok, errors, record } = validateAndNormalize(req.body || {});
  if (!ok) return res.status(400).json({ errors });
  try {
    const saved = createLink(record);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ errors: ['寫入資料庫失敗：' + err.message] });
  }
});

// 刪除：DELETE /api/links/:id
app.delete('/api/links/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) return res.status(400).json({ errors: ['id 無效'] });
  res.json({ deleted: deleteLink(id) });
});

app.listen(PORT, () => {
  console.log(`UTM 連結產生器已啟動 → http://localhost:${PORT}`);
});
