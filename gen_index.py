#!/usr/bin/env python3
"""Generate index.html — 证券行业简报及同业对标
   新设计：纯数据驱动，JS动态渲染公司卡片，期间切换联动简报链接"""

import os, re, json, shutil

# ── Config (auto-detect periods from dashboard files) ──
DASHBOARD_DIR = '/Users/peter/Desktop/券商分析数据/行业分析'
GIT_DIR = '/Users/peter/Desktop/git'
DATA_DIR = '/Users/peter/Desktop/券商分析数据'
OUT_PATH = os.path.join(GIT_DIR, 'index.html')

def detect_periods():
    """从仪表板文件自动检测可用期间列表"""
    periods = []
    labels = {}
    shorts = {}
    if not os.path.exists(DASHBOARD_DIR):
        return ['2026Q1'], {'2026Q1':'2026年一季报'}, {'2026Q1':'26Q1'}
    for f in sorted(os.listdir(DASHBOARD_DIR)):
        m = re.match(r'8家券商_(\d{4}(?:Q[1-4]|FY|H[12]))_分析仪表板\.html$', f)
        if m:
            p = m.group(1)
            periods.append(p)
            # 生成label：2026Q1 → 2026年一季报, 2025FY → 2025年年报, 2025H1 → 2025年半年报
            if p.endswith('Q1'):
                labels[p] = f'{p[:4]}年一季报'
            elif p.endswith('Q2'):
                labels[p] = f'{p[:4]}年半年报'
            elif p.endswith('Q3'):
                labels[p] = f'{p[:4]}年三季报'
            elif p.endswith('Q4'):
                labels[p] = f'{p[:4]}年年报'
            elif p.endswith('FY'):
                labels[p] = f'{p[:4]}年年报'
            elif p.endswith('H1'):
                labels[p] = f'{p[:4]}年半年报'
            elif p.endswith('H2'):
                labels[p] = f'{p[:4]}年年报'
            else:
                labels[p] = p
            shorts[p] = p[-4:] if len(p) > 4 else p
    if not periods:
        periods = ['2026Q1']
        labels['2026Q1'] = '2026年一季报'
        shorts['2026Q1'] = '26Q1'
    return periods, labels, shorts

PERIODS, PERIOD_LABEL, PERIOD_SHORT = detect_periods()

# Custom sort: 2026Q1 > 2025FY > 2025Q3 > others
PERIOD_ORDER = {'2026Q1': 0, '2025FY': 1, '2025Q3': 2}
PERIODS.sort(key=lambda p: PERIOD_ORDER.get(p, 99))

CODE_TO_NAME = {
    '000776':'广发证券', '600030':'中信证券', '600999':'招商证券',
    '601066':'中信建投', '601211':'国泰海通', '601688':'华泰证券',
    '601881':'中国银河', '601995':'中金公司'
}
NAME_TO_CODE = {v:k for k,v in CODE_TO_NAME.items()}

COMPANIES = ['广发证券', '中信证券', '招商证券', '中信建投', '国泰海通', '华泰证券', '中国银河', '中金公司']

DASHBOARD_DIR = '/Users/peter/Desktop/券商分析数据/行业分析'
DATA_DIR = '/Users/peter/Desktop/券商分析数据'
GIT_DIR = '/Users/peter/Desktop/git'

# ── Step 0: Sync dashboard and brief files to git folder ──
def sync_files():
    print("⏳ 同步文件到 git 文件夹...")
    count = 0

    # Dashboard files (with nav-link injection for triangle navigation)
    for pi, p in enumerate(PERIODS):
        src = os.path.join(DASHBOARD_DIR, f'8家券商_{p}_分析仪表板.html')
        dst = os.path.join(GIT_DIR, f'8家券商_{p}_分析仪表板.html')
        if not os.path.exists(src):
            print(f"  ✗ 未找到仪表板: {src}")
            continue
        with open(src, 'r', encoding='utf-8') as f:
            content = f.read()
        # Inject nav-links into dashboard (idempotent - checks if already present)
        if 'class="nav-link"' not in content:
            # CSS
            content = content.replace(
                '.tab-nav { display: flex; background: #fff;',
                '.tab-nav { display: flex; align-items: center; background: #fff;'
            )
            content = content.replace(
                '.tab-btn.active { color: #0f3460; border-bottom-color: #0f3460; font-weight: 600; }',
                '.tab-btn.active { color: #0f3460; border-bottom-color: #0f3460; font-weight: 600; }\n'
                '.nav-link { padding: 14px 16px; font-size: 13px; font-weight: 500; color: #888; text-decoration: none; white-space: nowrap; transition: color 0.15s; }\n'
                '.nav-link:hover { color: #0f3460; }\n'
                '.nav-sep { display: inline-block; width: 1px; height: 24px; background: #d0d5dd; margin: 0 4px; flex-shrink: 0; }'
            )
            # Responsive
            content = content.replace(
                '.tab-btn { padding: 10px 12px; font-size: 12px; }',
                '.tab-btn { padding: 10px 12px; font-size: 12px; }\n    .nav-link { padding: 10px 12px; font-size: 12px; }'
            )
            # HTML nav links — all other periods
            other_links = ''
            for p2 in PERIODS:
                if p2 == p: continue
                other_links += f'<a href="8家券商_{p2}_分析仪表板.html" class="nav-link">{PERIOD_SHORT[p2]}</a>\n'
            other_links += '<span class="nav-sep"></span>\n'
            content = content.replace(
                '<div class="tab-nav" id="tabNav">\n<button class="tab-btn active">',
                f'<div class="tab-nav" id="tabNav">\n'
                f'<a href="index.html" class="nav-link">← 返回首页</a>\n'
                f'{other_links}'
                f'<button class="tab-btn active">'
            )
        with open(dst, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ 仪表板: 8家券商_{p}_分析仪表板.html")
        count += 1

    # Brief files (one per company per period)
    for company in COMPANIES:
        brief_src_dir = os.path.join(DATA_DIR, company, '简报')
        brief_dst_dir = os.path.join(GIT_DIR, '简报', company)
        os.makedirs(brief_dst_dir, exist_ok=True)
        for p in PERIODS:
            fname = f'{company}_{p}_财务简报_无分析.html'
            src = os.path.join(brief_src_dir, fname)
            dst = os.path.join(brief_dst_dir, fname)
            if os.path.exists(src):
                shutil.copy2(src, dst)
                count += 1
            else:
                print(f"  ✗ 未找到简报: {company}/{p}")
    print(f"  ✓ 共同步 {count} 个文件\n")

sync_files()

KPI_FIELDS = [
    ('营业总收入', 'revenue', 'yi', False),
    ('营收同比', 'revenue_yoy', 'pct', True),
    ('归母净利润', 'np', 'yi', False),
    ('净利同比', 'np_yoy', 'pct', True),
    ('扣非净利润', 'deducted_np', 'yi', False),
    ('ROE', 'roe', 'pct2', False),
    ('净利率', 'np_margin', 'pct2', False),
    ('EPS(元)', 'eps', 'dec4', False),
]

# ── Data extraction from dashboard HTML ──
def _find_brace_end(s, start):
    depth = 0; in_str = False; escape = False
    for i in range(start, len(s)):
        ch = s[i]
        if escape: escape = False; continue
        if ch == '\\': escape = True; continue
        if ch == '"': in_str = not in_str; continue
        if in_str: continue
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0: return i + 1
    return -1

def _clean_trailing_commas(s):
    return re.sub(r',\s*([}\]])', r'\1', s)

def extract_dashboard_data(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    marker = 'const DATA = '
    start = content.find(marker)
    if start < 0: return None
    obj_start = start + len(marker)
    end = _find_brace_end(content, obj_start)
    if end < 0: return None
    data_str = content[obj_start:end]
    return json.loads(_clean_trailing_commas(data_str))

# ── Load data from dashboards ──
all_data = {}
all_order = {}
for p in PERIODS:
    path = os.path.join(DASHBOARD_DIR, f'8家券商_{p}_分析仪表板.html')
    raw = extract_dashboard_data(path)
    compact = {}
    for code in CODE_TO_NAME:
        if code not in raw: continue
        e = raw[code]
        kpi = e.get('kpi', {})
        compact[code] = {'name': e.get('name', CODE_TO_NAME.get(code,'?')), 'kpi': kpi}
    # Dynamic ranking by revenue (handle None)
    def safe_rev(code):
        v = compact[code]['kpi'].get('revenue', 0)
        return v if v is not None else 0
    order = sorted(compact.keys(), key=safe_rev, reverse=True)
    all_data[p] = compact
    all_order[p] = order

# ── Build JS data blob embedded in page ──
data_js_lines = ['const DATA = {']
for pi, p in enumerate(PERIODS):
    comma = ',' if pi < len(PERIODS)-1 else ''
    data_js_lines.append(f'  "{p}": {{')
    order = all_order[p]
    for ci, code in enumerate(order):
        if code not in all_data[p]: continue
        entry = all_data[p][code]
        kpi = entry['kpi']
        c = ',' if ci < len(order)-1 else ''
        kpi_items = []
        for k, v in kpi.items():
            if isinstance(v, (float, int)):
                kpi_items.append(f'"{k}":{v}')
            else:
                kpi_items.append(f'"{k}":"{v}"')
        kpi_str = '{' + ','.join(kpi_items) + '}'
        data_js_lines.append(f'    "{code}": {{"name":"{entry["name"]}","kpi":{kpi_str}}}{c}')
    data_js_lines.append(f'  }}{comma}')
data_js_lines.append('};')
data_js_code = '\n'.join(data_js_lines)

# ── Build HTML ──
CSS = '''<style>
:root {
  --navy: #0f1b3d;
  --navy-light: #1a2d5e;
  --navy-mid: #2a4a8a;
  --blue: #3b82f6;
  --blue-light: #60a5fa;
  --bg: #f4f6fa;
  --card: #ffffff;
  --text: #1a1a2e;
  --text-light: #6b7a8f;
  --border: #e2e8f0;
  --up: #d32f2f;
  --down: #388e3c;
  --shadow: 0 2px 12px rgba(0,0,0,0.06);
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg); color: var(--text); min-height: 100vh;
}

/* ── Header ── */
.header {
  background: linear-gradient(135deg, #0a1628 0%, #0f1b3d 40%, #1a3068 70%, #2a5aaa 100%);
  color: #fff; padding: 32px 32px 20px; position: relative; overflow: hidden;
}
.header::after {
  content: ''; position: absolute; top: -60%; right: -10%;
  width: 400px; height: 400px; background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
  border-radius: 50%;
}
.header h1 { font-size: 26px; font-weight: 700; letter-spacing: 2px; position: relative; z-index: 1; }
.header h1 span { color: var(--blue-light); }
.header .subtitle { font-size: 13px; opacity: 0.65; margin-top: 6px; letter-spacing: 1px; position: relative; z-index: 1; }

/* ── Period Toggle Bar ── */
.toolbar {
  display: flex; align-items: center; gap: 12px;
  background: var(--card); padding: 14px 24px;
  border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04); flex-wrap: wrap;
}
.toolbar-label { font-size: 13px; color: var(--text-light); font-weight: 500; white-space: nowrap; }
.period-btn {
  padding: 4px 14px; font-size: 12px; font-weight: 600; color: var(--text-light);
  background: var(--bg); border: 1px solid var(--border); border-radius: 16px;
  cursor: pointer; transition: all 0.2s;
}
.period-btn:hover { background: #e8eef8; border-color: var(--blue); }
.period-btn.active { background: var(--navy); color: #fff; border-color: var(--navy); }

/* ── Container ── */
.container { max-width: 1400px; margin: 0 auto; padding: 24px; }

/* ── Table ── */
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 12px; }
.table-scroll::-webkit-scrollbar { height: 5px; }
.table-scroll::-webkit-scrollbar-track { background: #eaf0f8; border-radius: 3px; }
.table-scroll::-webkit-scrollbar-thumb { background: #b8cfe8; border-radius: 3px; }
.data-table {
  width: 100%; border-collapse: separate; border-spacing: 0;
  font-size: 13px; min-width: 820px; background: var(--card);
  border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
  margin-bottom: 20px;
}
.data-table thead { position: sticky; top: 0; z-index: 5; }
.data-table th {
  background: var(--navy); color: #c8d8f8; font-weight: 600;
  padding: 11px 10px; text-align: center; font-size: 12px;
  letter-spacing: 0.3px; white-space: nowrap; border-bottom: 2px solid #2a4a7a;
}
.data-table th:first-child { text-align: center; width: 64px; }
.data-table th:nth-child(2) { text-align: left; }
.data-table td {
  padding: 11px 10px; text-align: center; border-bottom: 1px solid var(--border);
  white-space: nowrap; color: #334155; font-size: 12.5px;
}
.data-table td:first-child { text-align: center; font-size: 15px; }
.data-table td:nth-child(2) { text-align: left; font-weight: 600; color: var(--navy); }
.data-table td.num { font-weight: 700; color: var(--navy); font-variant-numeric: tabular-nums; }
.data-table td.up { color: var(--up); font-weight: 600; }
.data-table td.down { color: var(--down); font-weight: 600; }
.data-table tbody tr { transition: background 0.15s; }
.data-table tbody tr:hover td { background: #f0f6ff; }
.data-table tbody tr:last-child td { border-bottom: none; }
.rank-num { font-weight: 600; color: var(--text-light); font-size: 12px; }

/* ── Section Title ── */
.section-title {
  font-size: 17px; font-weight: 600; color: var(--navy);
  padding-left: 14px; border-left: 4px solid var(--blue);
  margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
}
.section-title .badge {
  font-size: 11px; font-weight: 500; color: var(--text-light);
  background: var(--bg); padding: 2px 10px; border-radius: 10px;
}

/* ── Deep Analysis Button ── */
.deep-btn-row {
  display: flex; justify-content: flex-end; margin-bottom: 28px;
}
.deep-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 20px; border-radius: 10px; text-decoration: none;
  font-size: 13px; font-weight: 600; transition: all 0.2s;
  background: linear-gradient(135deg, var(--navy), var(--navy-mid));
  color: #fff; box-shadow: 0 2px 8px rgba(15,27,61,0.2);
  cursor: pointer;
}
.deep-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(15,27,61,0.3); }

/* ── Company Grid ── */
.company-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
  margin-bottom: 28px;
}
@media (max-width: 1100px) { .company-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .company-grid { grid-template-columns: 1fr; } }

.company-card {
  background: var(--card); border-radius: 12px; overflow: hidden;
  box-shadow: var(--shadow); transition: all 0.2s;
  border: 1px solid var(--border);
}
.company-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.company-card-header {
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
}
.company-card-header .card-name { font-size: 15px; font-weight: 700; color: var(--navy); }
.company-card-header .card-code { font-size: 11px; color: var(--text-light); }
.company-card-body { padding: 12px 16px; }
.company-card-body .card-metric {
  display: flex; justify-content: space-between; padding: 3px 0;
  font-size: 12.5px;
}
.company-card-body .card-metric .card-label { color: var(--text-light); }
.company-card-body .card-metric .card-value { font-weight: 600; color: var(--navy); }
.company-card-body .card-metric .card-value.up { color: var(--up); }
.company-card-body .card-metric .card-value.down { color: var(--down); }
.company-card-actions {
  padding: 10px 16px 14px; display: flex; gap: 6px; flex-wrap: wrap;
}
.card-brief-btn {
  padding: 5px 12px; font-size: 11px; font-weight: 500;
  border-radius: 6px; text-decoration: none; transition: all 0.15s;
  background: var(--bg); color: var(--navy); border: 1px solid var(--border);
}
.card-brief-btn:hover { background: var(--navy); color: #fff; border-color: var(--navy); }

/* ── Footer ── */
.footer {
  text-align: center; padding: 24px; color: var(--text-light);
  font-size: 12px; line-height: 1.8;
}

/* ── Animation ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.period-content { display: none; }
.period-content.active { display: block; animation: fadeUp 0.35s ease; }
</style>'''

# ── KPI table builder ──
def build_kpi_table(p, data, order):
    lines = []
    lines.append('<div class="section-title">核心KPI排名 <span class="badge">按营收降序</span></div>')
    lines.append('<div class="table-scroll"><table class="data-table"><thead><tr>')
    lines.append('<th>#</th><th>公司</th>')
    for label, _, _, _ in KPI_FIELDS:
        lines.append(f'<th>{label}</th>')
    lines.append('</tr></thead><tbody>')

    medals = {1:'🥇', 2:'🥈', 3:'🥉'}
    for rank, code in enumerate(order, 1):
        if code not in data: continue
        entry = data[code]
        kpi = entry['kpi']
        name = entry['name']
        medal = medals.get(rank, '')
        rank_display = medal if medal else f'<span class="rank-num">#{rank}</span>'
        lines.append(f'<tr><td>{rank_display}</td><td>{name}</td>')
        for _, field, style, is_chg in KPI_FIELDS:
            val = kpi.get(field)
            if val is None or val == 'None':
                lines.append('<td class="na">-</td>')
            elif is_chg:
                cls = ' up' if float(val) >= 0 else ' down'
                lines.append(f'<td class="num{cls}">{float(val):+.2f}%</td>')
            elif style == 'yi':
                lines.append(f'<td class="num">{float(val)/1e8:.2f}</td>')
            elif style == 'pct2':
                lines.append(f'<td class="num">{float(val):.2f}</td>')
            elif style == 'dec4':
                lines.append(f'<td class="num">{float(val):.4f}</td>')
            else:
                lines.append(f'<td class="num">{float(val):.2f}</td>')
        lines.append('</tr>')
    lines.append('</tbody></table></div>')
    return '\n'.join(lines)

# ── Assemble HTML ──
html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>证券行业简报及同业对标</title>
{CSS}
</head>
<body>

<div class="header">
<h1><span>证券</span>行业简报及同业对标</h1>
<div class="subtitle">中信建投 · 中信证券 · 中国银河 · 中金公司 · 华泰证券 · 国泰海通 · 广发证券 · 招商证券 ｜ 由Peter的行业分析Skill自动生成</div>
</div>

<div class="toolbar">
<span class="toolbar-label">报告期间：</span>
'''

for pi, p in enumerate(PERIODS):
    cls = 'period-btn active' if pi == 0 else 'period-btn'
    html += f'<button class="{cls}" onclick="switchPeriod(\'{p}\')">{PERIOD_LABEL[p]}</button>\n'

html += '''
</div>

<div class="container">
'''

for pi, p in enumerate(PERIODS):
    disp = ' active' if pi == 0 else ''
    order = all_order[p]
    html += f'<div class="period-content{disp}" id="period-{p}">\n'
    html += build_kpi_table(p, all_data[p], order)
    html += f'''<div class="deep-btn-row">
<a href="8家券商_{p}_分析仪表板.html" class="deep-btn">详细行业分析</a>
</div>
</div>
'''

html += '''
<!-- Dynamic Company Brief Section -->
<div class="section-title">公司简报 <span class="badge">点击查看详细财务简报</span></div>
<div class="company-grid" id="company-grid">
</div>

</div> <!-- container -->

<div class="footer">
数据来源：各公司定期报告（合并利润表及资产负债表） ｜ 单位：人民币亿元（除特别注明） ｜ 行业分析仪表板由Peter的行业分析Skill自动生成
</div>

<script>
''' + data_js_code + f'''

function fmtYi(val) {{
  return (val / 100000000).toFixed(2) + "亿";
}}

function fmtPct(val) {{
  if (val === "None" || val === null || val === undefined) return "N/A";
  var n = Number(val);
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}}

function fmtSign(v) {{
  if (v === "None" || v === null || v === undefined) return "N/A";
  return (Number(v) >= 0 ? "up" : "down");
}}

function renderCompanyCards(period) {{
  var grid = document.getElementById("company-grid");
  var codes = Object.keys(DATA[period]).filter(function(c) {{ return c.length === 6 && DATA[period][c].kpi; }});
  codes.sort(function(a, b) {{ return (DATA[period][b].kpi.revenue||0) - (DATA[period][a].kpi.revenue||0); }});
  var html = "";
  for (var i = 0; i < codes.length; i++) {{
    var code = codes[i];
    var d = DATA[period][code];
    if (!d) continue;
    var k = d.kpi;
    var name = d.name;
    var revYoYClass = fmtSign(k.revenue_yoy);
    var briefBase = "简报/" + name + "/" + name;
    var briefPath = briefBase + "_" + period + "_财务简报_无分析.html";

    html += '<div class="company-card">';
    html += '<div class="company-card-header">';
    html += '<div><span class="card-name">' + name + '</span> <span class="card-code">' + code + '</span></div>';
    html += '</div>';
    html += '<div class="company-card-body">';
    html += '<div class="card-metric"><span class="card-label">营业总收入</span><span class="card-value">' + fmtYi(k.revenue) + '</span></div>';
    html += '<div class="card-metric"><span class="card-label">营收同比</span><span class="card-value ' + revYoYClass + '">' + fmtPct(k.revenue_yoy) + '</span></div>';
    html += '<div class="card-metric"><span class="card-label">归母净利润</span><span class="card-value">' + fmtYi(k.np) + '</span></div>';
    html += '<div class="card-metric"><span class="card-label">ROE</span><span class="card-value">' + (k.roe === "None" ? "N/A" : Number(k.roe).toFixed(2) + "%") + '</span></div>';
    html += '<div class="card-metric"><span class="card-label">EPS</span><span class="card-value">' + Number(k.eps).toFixed(4) + '元</span></div>';
    html += '<div class="card-metric"><span class="card-label">净利率</span><span class="card-value">' + Number(k.np_margin).toFixed(2) + '%</span></div>';
    html += '</div>';
    html += '<div class="company-card-actions">';
    html += '<a href="' + briefPath + '" class="card-brief-btn">简报</a>';
    html += '</div>';
    html += '</div>';
  }}
  grid.innerHTML = html;
}}

function switchPeriod(period) {{
  document.querySelectorAll(".period-btn").forEach(function(b) {{
    b.classList.remove("active");
    if (b.getAttribute("onclick") && b.getAttribute("onclick").indexOf("'" + period + "'") !== -1) {{
      b.classList.add("active");
    }}
  }});
  document.querySelectorAll(".period-content").forEach(function(c) {{
    c.classList.remove("active");
  }});
  var target = document.getElementById("period-" + period);
  if (target) target.classList.add("active");
  renderCompanyCards(period);
}}

renderCompanyCards("' + PERIODS[0] + '");
</script>

</body>
</html>'''

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✓ Generated: {OUT_PATH}")
print(f"  Size: {len(html)} bytes, {html.count(chr(10))} lines")
print(f"  Periods: {', '.join(PERIODS)}")
