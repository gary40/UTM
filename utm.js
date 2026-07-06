// UTM 參數處理工具 —— 後端寫入前用來正規化與組出完整追蹤網址。
// 與 CubeLV「UTM 連結管理」插件的規則一致：GA 對大小寫 / 空白敏感，
// 統一格式避免同一來源在報表被拆成多筆。

/** 去頭尾空白、轉小寫、內部空白轉底線。 */
export function normalizeParam(s) {
  return String(s ?? '').trim().toLowerCase().replace(/\s+/g, '_');
}

/** 落地頁必須是 http(s) 開頭的合法網址。 */
export function isValidUrl(s) {
  return /^https?:\/\/.+/i.test(String(s ?? '').trim());
}

/**
 * 由落地頁 + UTM 參數組出完整追蹤網址。
 * 會先移除落地頁上既有的 utm_* 參數，避免重複疊加。
 */
export function buildUtmUrl({ landingUrl, source, medium, campaign, content, term }) {
  const url = new URL(String(landingUrl).trim());

  // 清掉既有的 utm_* 參數
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith('utm_')) url.searchParams.delete(key);
  }

  const params = {
    utm_source: normalizeParam(source),
    utm_medium: normalizeParam(medium),
    utm_campaign: normalizeParam(campaign),
    utm_content: normalizeParam(content),
    utm_term: normalizeParam(term),
  };
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  return url.toString();
}

/**
 * 驗證並正規化一筆輸入，回傳 { ok, errors, record }。
 * source / medium / campaign / landingUrl 為必填。
 */
export function validateAndNormalize(input) {
  const errors = [];
  const landingUrl = String(input.landingUrl ?? '').trim();
  const source = normalizeParam(input.source);
  const medium = normalizeParam(input.medium);
  const campaign = normalizeParam(input.campaign);
  const content = normalizeParam(input.content);
  const term = normalizeParam(input.term);
  const note = String(input.note ?? '').trim();

  if (!isValidUrl(landingUrl)) errors.push('落地頁必須以 http:// 或 https:// 開頭');
  if (!source) errors.push('來源（utm_source）為必填');
  if (!medium) errors.push('媒介（utm_medium）為必填');
  if (!campaign) errors.push('活動代號（utm_campaign）為必填');

  if (errors.length) return { ok: false, errors, record: null };

  const fullUrl = buildUtmUrl({ landingUrl, source, medium, campaign, content, term });
  return {
    ok: true,
    errors: [],
    record: { landingUrl, source, medium, campaign, content, term, note, fullUrl },
  };
}
