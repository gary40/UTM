// 前台邏輯：即時預覽、送出寫入資料庫、載入與顯示已存檔連結。
const PAGE = 100;
let offset = 0;
let total = 0;

const form = document.getElementById('utm-form');
const preview = document.getElementById('preview');
const errorMsg = document.getElementById('error-msg');
const submitBtn = document.getElementById('submit-btn');
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const loadMoreBtn = document.getElementById('load-more');
const refreshBtn = document.getElementById('refresh-btn');

// —— 與後端一致的正規化（僅供預覽；權威值以後端為準） ——
function normalizeParam(s) {
  return String(s || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function buildPreview() {
  const landing = form.landingUrl.value.trim();
  if (!/^https?:\/\/.+/i.test(landing)) { preview.textContent = '—'; return; }
  let url;
  try { url = new URL(landing); } catch { preview.textContent = '—'; return; }
  [...url.searchParams.keys()].forEach(k => {
    if (k.toLowerCase().startsWith('utm_')) url.searchParams.delete(k);
  });
  const map = {
    utm_source: normalizeParam(form.source.value),
    utm_medium: normalizeParam(form.medium.value),
    utm_campaign: normalizeParam(form.campaign.value),
    utm_content: normalizeParam(form.content.value),
    utm_term: normalizeParam(form.term.value),
  };
  Object.entries(map).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
  preview.textContent = url.toString();
}

form.addEventListener('input', buildPreview);

// —— 送出 ——
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = '存檔中…';

  const payload = {
    landingUrl: form.landingUrl.value,
    source: form.source.value,
    medium: form.medium.value,
    campaign: form.campaign.value,
    content: form.content.value,
    term: form.term.value,
    note: form.note.value,
  };

  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      errorMsg.textContent = (data.errors || ['送出失敗']).join('\n');
      errorMsg.hidden = false;
    } else {
      form.reset();
      preview.textContent = '—';
      reload();
    }
  } catch (err) {
    errorMsg.textContent = '網路或伺服器錯誤：' + err.message;
    errorMsg.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出並存檔';
  }
});

// —— 列表 ——
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderItem(it) {
  const el = document.createElement('div');
  el.className = 'link-item';
  const date = (it.createdAt || '').replace('T', ' ').slice(0, 16);
  el.innerHTML = `
    <div class="link-top">
      <span class="tag">${escapeHtml(it.source)}</span>
      <span class="tag medium">${escapeHtml(it.medium)}</span>
      <span class="campaign">${escapeHtml(it.campaign)}${it.content ? ' · ' + escapeHtml(it.content) : ''}</span>
      <span class="link-actions">
        <button class="mini-btn" data-copy>複製</button>
        <button class="mini-btn danger" data-del="${it.id}">刪除</button>
      </span>
    </div>
    <a class="full-url" data-url>${escapeHtml(it.fullUrl)}</a>
    ${it.note ? `<div class="link-note">📝 ${escapeHtml(it.note)}</div>` : ''}
    <div class="link-meta">#${it.id} · ${escapeHtml(date)}</div>
  `;
  const copy = () => navigator.clipboard.writeText(it.fullUrl).then(() => {
    const b = el.querySelector('[data-copy]');
    b.textContent = '已複製'; setTimeout(() => (b.textContent = '複製'), 1200);
  });
  el.querySelector('[data-copy]').addEventListener('click', copy);
  el.querySelector('[data-url]').addEventListener('click', copy);
  el.querySelector('[data-del]').addEventListener('click', async () => {
    if (!confirm('確定刪除這筆連結？')) return;
    await fetch('/api/links/' + it.id, { method: 'DELETE' });
    reload();
  });
  return el;
}

async function load(append = false) {
  const res = await fetch(`/api/links?limit=${PAGE}&offset=${offset}`);
  const data = await res.json();
  total = data.total;
  countEl.textContent = total;
  if (!append) listEl.innerHTML = '';
  if (total === 0) {
    listEl.innerHTML = '<div class="empty">尚無存檔連結，從左側新增第一筆吧。</div>';
  } else {
    data.items.forEach(it => listEl.appendChild(renderItem(it)));
  }
  offset += data.items.length;
  loadMoreBtn.hidden = offset >= total;
}

function reload() { offset = 0; load(false); }

loadMoreBtn.addEventListener('click', () => load(true));
refreshBtn.addEventListener('click', reload);

reload();
