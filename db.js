// SQLite 資料庫層 —— 建表與 CRUD。資料庫檔存在 data/utm.db。
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'utm.db');

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS utm_links (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    landing_url TEXT    NOT NULL,
    source      TEXT    NOT NULL,
    medium      TEXT    NOT NULL,
    campaign    TEXT    NOT NULL,
    content     TEXT    DEFAULT '',
    term        TEXT    DEFAULT '',
    note        TEXT    DEFAULT '',
    full_url    TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertStmt = db.prepare(`
  INSERT INTO utm_links (landing_url, source, medium, campaign, content, term, note, full_url)
  VALUES (@landingUrl, @source, @medium, @campaign, @content, @term, @note, @fullUrl)
`);

const listStmt = db.prepare(`
  SELECT id, landing_url AS landingUrl, source, medium, campaign, content, term, note,
         full_url AS fullUrl, created_at AS createdAt
  FROM utm_links
  ORDER BY id DESC
  LIMIT @limit OFFSET @offset
`);

const getStmt = db.prepare(`
  SELECT id, landing_url AS landingUrl, source, medium, campaign, content, term, note,
         full_url AS fullUrl, created_at AS createdAt
  FROM utm_links WHERE id = ?
`);

const deleteStmt = db.prepare(`DELETE FROM utm_links WHERE id = ?`);
const countStmt = db.prepare(`SELECT COUNT(*) AS n FROM utm_links`);

export function createLink(record) {
  const info = insertStmt.run(record);
  return getStmt.get(info.lastInsertRowid);
}

export function listLinks({ limit = 100, offset = 0 } = {}) {
  return listStmt.all({ limit, offset });
}

export function deleteLink(id) {
  return deleteStmt.run(id).changes > 0;
}

export function countLinks() {
  return countStmt.get().n;
}

export default db;
