import json, re, sys
from collections import Counter, defaultdict
from datetime import datetime, timezone, timedelta

raw = open(sys.argv[1], encoding='utf-8').read()
# 依 markdown 表格切成多個 sheet 區塊：每個表格開頭是一行全 :-: 的分隔列
blocks = re.split(r'\n\|\s*:-:\s*\|[^\n]*\n', raw)
headers_lines = re.findall(r'\n\|\s*:-:\s*\|[^\n]*\n', raw)
tables = []
for i in range(1, len(blocks)):
    lines = [l for l in blocks[i].strip().splitlines() if l.strip().startswith('|')]
    if not lines: tables.append([]); continue
    cols = [c.strip().replace('\\_', '_') for c in lines[0].strip('|').split('|')]
    rows = []
    for line in lines[1:]:
        vals = [v.strip().replace('\\_', '_') for v in line.strip('|').split('|')]
        if len(vals) != len(cols): continue
        rows.append(dict(zip(cols, vals)))
    tables.append(rows)

# 依欄位特徵辨識三個分頁（順序為 shares, leads, results，但用欄位判斷較保險）
def find(cols_needed):
    for t in tables:
        if t and all(c in t[0] for c in cols_needed): return t
    return []
shares = find(['share_id','platform'])
leads = find(['email','persona'])
results = find(['centerYear','rightN'])

def is_test(r): return str(r.get('test_mode','')).strip() == '1' or r.get('persona')=='測試資料' or 'test=1' in str(r.get('utm','')) or str(r.get('attempt_id','')).startswith('verifytest')
TPE = timezone(timedelta(hours=8))
def day(ts):
    try: return datetime.fromisoformat(ts.replace('Z','+00:00')).astimezone(TPE).strftime('%Y-%m-%d')
    except Exception: return ts[:10]

res_real = [r for r in results if not is_test(r)]
ages = [float(r['age']) for r in res_real if r.get('age')]
mean = sum(ages)/len(ages) if ages else 0
sd = (sum((a-mean)**2 for a in ages)/len(ages))**0.5 if ages else 0
persona_dist = Counter(r.get('persona','') for r in res_real)
decade_dist = Counter(r.get('decade','') or '（略過）' for r in res_real)
by_day = Counter(day(r['ts']) for r in res_real if r.get('ts'))
challenger_n = sum(1 for r in res_real if r.get('challenger'))
avg_right = sum(float(r['rightN']) for r in res_real if r.get('rightN'))/len(res_real) if res_real else 0
avg_newrate = sum(float(r['newRate']) for r in res_real if r.get('newRate') not in (None,''))/len(res_real) if res_real else 0

leads_real = [l for l in leads if str(l.get('test_mode','')).strip() != '1' and 'test' not in str(l.get('email','')).lower()]
lead_emails = set(l['email'] for l in leads_real if l.get('email'))

shares_real = [s for s in shares if not is_test(s)]
platform_dist = Counter(s.get('platform','') for s in shares_real)
content_dist = Counter(s.get('content_type','') for s in shares_real)

game = {
  'generated_at': datetime.now(timezone.utc).isoformat(),
  'totals': {'results': len(res_real), 'leads': len(leads_real), 'unique_leads': len(lead_emails), 'shares': len(shares_real)},
  'avg_age': round(mean,1), 'sd_age': round(sd,1), 'avg_right_n': round(avg_right,1), 'avg_new_rate': round(avg_newrate,1),
  'persona_dist': dict(persona_dist), 'decade_dist': dict(decade_dist),
  'by_day': dict(sorted(by_day.items())),
  'challenger_n': challenger_n,
  'lead_conversion_pct': round(len(leads_real)/len(res_real)*100,1) if res_real else 0,
  'platform_dist': dict(platform_dist), 'content_type_dist': dict(content_dist),
}

# ===== 寄信統計（v1.3-draft 部署、leads 分頁出現 mail_status 欄位後才有資料）=====
mail_log = find(['status','coupon_version'])
has_mail_cols = bool(leads) and 'mail_status' in leads[0]
if not has_mail_cols:
    mail = {'available': False, 'generated_at': game['generated_at']}
else:
    ml_real = [l for l in leads_real]  # 已用同一套排除測試資料的規則
    status_of = lambda l: str(l.get('mail_status','')).strip().lower()
    sent = [l for l in ml_real if status_of(l) == 'sent']
    failed = [l for l in ml_real if status_of(l) == 'failed']
    pending = [l for l in ml_real if status_of(l) not in ('sent','failed')]
    sent_by_day = Counter(day(l['mail_sent_at']) for l in sent if l.get('mail_sent_at'))
    error_samples = Counter(l.get('mail_error','')[:60] for l in failed if l.get('mail_error'))
    last_sent = max((l['mail_sent_at'] for l in sent if l.get('mail_sent_at')), default='')
    mail = {
      'available': True, 'generated_at': game['generated_at'],
      'totals': {'leads': len(ml_real), 'sent': len(sent), 'failed': len(failed), 'pending': len(pending)},
      'send_rate_pct': round(len(sent)/len(ml_real)*100,1) if ml_real else 0,
      'by_day': dict(sorted(sent_by_day.items())),
      'last_sent_at': last_sent,
      'top_errors': dict(error_samples.most_common(5)),
      'log_rows_seen': len(mail_log),
    }

print(json.dumps({'game': game, 'mail': mail}, ensure_ascii=False, indent=1))
