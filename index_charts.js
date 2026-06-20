// Auto-generated unified chart renderer
let chartInstances = {};
let currentPeriod = "2026Q1";
let currentTab = 0;

function destroyAllCharts() {
    Object.values(chartInstances).forEach(function(inst) {
        try { inst.destroy(); } catch(e) {}
    });
    chartInstances = {};
}

function registerChart(key, chart) {
    if (chartInstances[key]) {
        try { chartInstances[key].destroy(); } catch(e) {}
    }
    chartInstances[key] = chart;
}

function fmtYi(v) { if (v == null) return "-"; return (v).toFixed(2); }
function fmtPct(v) { if (v == null) return "-"; return (v>0?"+":"")+v.toFixed(2)+"%"; }
function fmtPctChg(v) { if (v == null) return "-"; return (v>0?"+":"")+v.toFixed(2)+"pct"; }
function yoyClass(v) { if (v == null) return ""; return v > 0 ? "up" : v < 0 ? "down" : ""; }

// Period rendering
function renderPeriod(period) {
    currentPeriod = period;
    destroyAllCharts();
    var periodData = ALL_DATA[period];
    if (!periodData) return;
    // Set global DATA and ORDER for chart functions
    window.DATA = periodData;
    window.ORDER = Object.keys(periodData);
    var companies = window.ORDER;
    var codes = companies.map(function(c) { return periodData[c].short || c; });
    document.getElementById("periodTitle").textContent = period + " " + (PERIOD_LABELS[period] || "");

    // Build tab panel HTML (same structure as dashboard template)
    buildTabHTML(companies, codes, period);
    // Render current tab
    switchDashTab(currentTab, DATA, companies, codes);
}

function buildTabHTML(companies, codes, period) {
    // Tab 0: Overview
    var html = '';
    html += '<div class="tab-panel active" id="tab0"><div class="section-title">关键指标速览</div><div class="kpi-grid" id="kpiGrid"></div>';
    html += '<div class="section-title">营收与归母净利润</div><div class="card"><div class="chart-container"><canvas id="chartRevenue"></canvas></div></div>';
    html += '<div class="section-title">核心盈利能力</div><div class="card"><div class="chart-container"><canvas id="chartROE"></canvas></div></div>';
    html += '<div class="section-title">业务收入构成</div><div class="card"><div class="chart-row"><div class="chart-container"><canvas id="chartBizMix"></canvas></div><div class="chart-container"><canvas id="chartBizYoY"></canvas></div></div></div></div>';

    // Tab 1: KPI Matrix
    html += '<div class="tab-panel" id="tab1"><div class="section-title">核心KPI矩阵</div><div class="card kpi-matrix-wrap"><table class="data-table" id="kpiMatrix"></table></div></div>';

    // Tab 2: Revenue structure
    html += '<div class="tab-panel" id="tab2"><div class="section-title">营收结构对比</div><div class="card"><div class="chart-container"><canvas id="chartRevenueStructure"></canvas></div></div><div class="card"><div class="chart-container"><canvas id="chartBizCompare"></canvas></div></div></div>';

    // Tab 3: Biz detail
    html += '<div class="tab-panel" id="tab3"><div class="section-title">业务线深度分析</div><div class="card"><div id="bizDetailCharts"></div></div></div>';

    // Tab 4: Investment
    html += '<div class="tab-panel" id="tab4"><div class="section-title">投资业务收入构成</div><div class="card"><div class="chart-container"><canvas id="chartInvestIncome"></canvas></div></div>';
    html += '<div class="section-title">金融资产总数变动</div><div class="card"><div class="chart-container"><canvas id="chartFinAssetsTotal"></canvas></div></div>';
    html += '<div class="section-title">四类金融资产明细变动</div><div class="card"><div class="chart-row"><div class="chart-container" style="height:340px"><canvas id="chartFinAsset0"></canvas></div><div class="chart-container" style="height:340px"><canvas id="chartFinAsset1"></canvas></div></div><div class="chart-row" style="margin-top:20px"><div class="chart-container" style="height:340px"><canvas id="chartFinAsset2"></canvas></div><div class="chart-container" style="height:340px"><canvas id="chartFinAsset3"></canvas></div></div></div>';
    html += '<div class="section-title">衍生工具头寸变动</div><div class="card"><div class="chart-container"><canvas id="chartDerivPosition"></canvas></div></div></div>';

    // Tab 5: Efficiency
    html += '<div class="tab-panel" id="tab5"><div class="section-title">财务效率及风险控制指标</div><div class="efficiency-grid"><div class="card"><div class="chart-container" style="height:320px"><canvas id="chartEffMargin"></canvas></div></div><div class="card"><div class="chart-container" style="height:320px"><canvas id="chartEffCost"></canvas></div></div><div class="card"><div class="chart-container" style="height:320px"><canvas id="chartEffROE"></canvas></div></div></div>';
    html += '<div class="section-title" style="margin-top:30px">风险控制指标</div><div class="risk-grid"><div class="card"><div class="chart-container" style="height:320px"><canvas id="chartRiskCoverage"></canvas></div></div><div class="card"><div class="chart-container" style="height:320px"><canvas id="chartCapitalLeverage"></canvas></div></div><div class="card"><div class="chart-container" style="height:320px"><canvas id="chartLiquidityCoverage"></canvas></div></div><div class="card"><div class="chart-container" style="height:320px"><canvas id="chartStableFunding"></canvas></div></div></div></div>';

    // Tab 6: Raw data
    html += '<div class="tab-panel" id="tab6"><div class="section-title">原始报表浏览</div><div class="card"><div id="rawDataTable"></div></div></div>';

    document.getElementById("tabPanels").innerHTML = html;
}

function switchDashTab(idx, DATA, companies, codes) {
    currentTab = idx;
    window.DATA = DATA;
    window.ORDER = companies;
    document.querySelectorAll(".tab-panel").forEach(function(t) { t.classList.remove("active"); });
    var panel = document.getElementById("tab" + idx);
    if (panel) panel.classList.add("active");
    setTimeout(function() { window.dispatchEvent(new Event("resize")); }, 50);

    switch(idx) {
        case 0: renderTab0(DATA, companies, codes); break;
        case 1: renderTab1(DATA, companies, codes); break;
        case 2: renderTab2(DATA, companies, codes); break;
        case 3: renderTab3(DATA, companies, codes); break;
        case 4: renderTab4(DATA, companies, codes); break;
        case 5: renderTab5(DATA, companies, codes); break;
        case 6: renderTab6(DATA, companies, codes); break;
    }
}


const SHORT = {};
for (const sc of ORDER) { SHORT[sc] = DATA[sc].short; }

function switchTab(i) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab'+i).classList.add('active');
    document.querySelectorAll('.tab-btn')[i].classList.add('active');
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
}

document.getElementById('tabNav').addEventListener('click', function(e) {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const btns = Array.from(this.querySelectorAll('.tab-btn'));
    const idx = btns.indexOf(btn);
    if (idx < 0) return;
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab' + idx).classList.add('active');
    btn.classList.add('active');
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
});

function fmt(v) {
    if (v == null || v === '-') return '-';
    let abs = Math.abs(v);
    if (abs >= 1e8) return (v/1e8).toFixed(2)+'亿';
    if (abs >= 1e4) return (v/1e4).toFixed(2)+'万';
    return v.toFixed(2);
}
function fmtYi(v) {
    // v 已经是亿元单位（浮点数）
    if (v == null || v === '-') return '-';
    return v.toFixed(2) + '亿';
}
function fmtYiSep(v) {
    // v 已经是亿元单位，加千分位分隔符
    if (v == null || v === '-') return '-';
    const num = v.toFixed(2);
    const parts = num.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return intPart + '.' + parts[1] + '亿';
}
function fmtPct(v) {
    if (v == null) return '-';
    return (v > 0 ? '+' : '') + v.toFixed(2) + '%';
}
function yoyClass(v) {
    if (v == null) return '';
    return v >= 0 ? 'up' : 'down';
}

function getBizVal(sc, k) {
    // DATA[sc].biz[k] 已经是亿元单位（浮点数，保留2位小数）
    if (k === 'investment') {
        // 投资业务合计直接使用 biz.investment（已在 Python 中计算并四舍五入）
        return DATA[sc].biz.investment != null ? DATA[sc].biz.investment : null;
    }
    const v = DATA[sc].biz[k];
    return v != null ? v : null;
}
function getBizRawVal(sc, k) {
    // 返回原始值（亿元单位），用于计算占比
    if (k === 'investment') {
        return DATA[sc].biz.investment != null ? DATA[sc].biz.investment : null;
    }
    return DATA[sc].biz[k];
}

const COLORS = ['#d4729a','#5fa37c','#8b7ec8','#d4a843','#5b9bd5','#a5a5a5','#4fa8a0','#c08070'];
const COLORS_ALPHA = ['rgba(212,114,154,0.6)','rgba(95,163,124,0.6)','rgba(139,126,200,0.6)','rgba(212,168,67,0.6)','rgba(91,155,213,0.6)','rgba(165,165,165,0.6)','rgba(79,168,160,0.6)','rgba(192,128,112,0.6)'];

try {
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.register(ChartDataLabels);
    Chart.defaults.plugins.datalabels = { display: false };
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
    Chart.defaults.plugins.legend.labels.font = { size: 10 };
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
} catch(e) { console.warn('Chart.js init warning:', e); }

/* ===== KPI Grid ===== */
function buildKpiGrid() {
    const grid = document.getElementById('kpiGrid');
    const items = [
        { label: '营业总收入', key: 'revenue', yoy: 'revenue_yoy', show: true },
        { label: '归母净利润', key: 'np', yoy: 'np_yoy', show: true },
        { label: '扣非归母净利润', key: 'deducted_np', yoy: 'deducted_np_yoy', show: true },
        { label: '加权平均ROE', key: 'roe', suffix: '%' },
        { label: '基本每股收益', key: 'eps', suffix: '元' },
        { label: '扣非归母净利率', key: 'np_margin', suffix: '%' },
    ];
    let totalRev = 0, totalNP = 0;
    for (const sc of ORDER) { const k = DATA[sc].kpi; if (k.revenue) totalRev += k.revenue; if (k.np) totalNP += k.np; }
    items.unshift({ label: '行业营收合计', value: totalRev, sub: '9家券商' });
    items.unshift({ label: '行业利润合计', value: totalNP, sub: '9家券商' });

    let html = '';
    for (let idx = 0; idx < items.length; idx++) {
        const it = items[idx];
        if (it.key) {
            const vals = ORDER.map(sc => DATA[sc].kpi[it.key]).filter(v => v != null);
            const avg = vals.length > 0 ? vals.reduce((a,b) => a+b, 0) / vals.length : 0;
            const maxVal = Math.max(...vals);
            const maxSc = ORDER.find(sc => DATA[sc].kpi[it.key] === maxVal);
            const maxName = maxSc ? DATA[maxSc].short : '';

            // 获取华泰证券的数值（601688 是华泰证券的代码）
            const huataiSc = "601688";
            const huataiVal = DATA[huataiSc] ? DATA[huataiSc].kpi[it.key] : null;

            // 计算华泰证券的排名（降序，数值越大排名越靠前）
            let huataiRank = '';
            if (huataiVal != null) {
                // 按指标值降序排序所有公司
                const sortedSc = [...ORDER].sort((a, b) => {
                    const va = DATA[a].kpi[it.key];
                    const vb = DATA[b].kpi[it.key];
                    if (va == null && vb == null) return 0;
                    if (va == null) return 1;
                    if (vb == null) return -1;
                    return vb - va;  // 降序
                });
                const rank = sortedSc.indexOf(huataiSc) + 1;
                // 转换为中文序数
                const chineseNums = ['', '第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九', '第十'];
                huataiRank = rank <= 10 ? chineseNums[rank] : `第${rank}`;
            }

            // 格式化华泰证券的数值
            let huataiDisplay = '';
            if (huataiVal != null) {
                if (it.suffix === '%') huataiDisplay = huataiVal.toFixed(2) + '%';
                else if (it.suffix === '元') huataiDisplay = huataiVal.toFixed(2) + '元';
                else huataiDisplay = fmtYi(huataiVal);
            } else {
                huataiDisplay = '-';
            }

            // 指标3-8（索引2到7）：使用新格式
            const isNewFormat = (idx >= 2);  // 指标3-8（所有带 key 的指标）

            let displayVal;
            if (it.suffix === '%') displayVal = avg.toFixed(2) + '%';
            else if (it.suffix === '元') displayVal = avg.toFixed(2) + '元';
            else displayVal = fmtYi(avg);

            html += '<div class="kpi-card">'
                + '<div class="kpi-label">';
            if (isNewFormat) {
                // 新格式：指标名称(行业平均)
                html += it.label + '(行业平均)';
            } else {
                // 旧格式：保持原样
                html += it.label;
            }
            html += '</div>'
                + '<div class="kpi-value">' + displayVal + '</div>';
            if (!isNewFormat) {
                // 指标1-2：保留"行业平均"那一行
                html += '<div class="kpi-sub">行业平均</div>';
            }
            // 指标3-8：所有带 key 的指标都显示"最高"
            html += '<div class="kpi-sub" style="margin-top:2px;color:#5b9bd5">最高: ' + maxName + ' (' + (it.suffix ? (it.suffix === '%' ? maxVal.toFixed(2)+'%' : maxVal.toFixed(2)+it.suffix) : fmtYi(maxVal)) + ')</div>';
            // 指标3-8：添加华泰证券的那一行
            if (isNewFormat && huataiVal != null) {
                html += '<div class="kpi-sub" style="margin-top:2px;color:#666">华泰证券（' + huataiDisplay + '，' + huataiRank + '）</div>';
            }
            html += '</div>';
        } else {
            html += '<div class="kpi-card"><div class="kpi-label">' + it.label + '</div><div class="kpi-value">' + fmtYi(it.value) + '</div><div class="kpi-sub">' + it.sub + '</div></div>';
        }
    }
    grid.innerHTML = html;
}

/* ===== KPI Matrix ===== */
let _matrixSort = { colKey: null, asc: false };
function buildKpiMatrix() {
    const metrics = [
        { key: 'revenue', label: '营业总收入', fmt: 'money', yoyKey: 'revenue_yoy' },
        { key: 'np', label: '归母净利润', fmt: 'money', yoyKey: 'np_yoy' },
        { key: 'deducted_np', label: '扣非归母净利润', fmt: 'money', yoyKey: 'deducted_np_yoy' },
        { key: 'eps', label: '基本每股收益', fmt: 'raw', unit: '元', yoyKey: 'eps_yoy' },
        { key: 'roe', label: '加权平均ROE', fmt: 'raw', unit: '%', yoyKey: 'roe_yoy', yoyFmt: 'bp' },
        { key: 'np_margin', label: '扣非归母净利率', fmt: 'raw', unit: '%', yoyKey: 'np_margin_chg', yoyFmt: 'bp' },
        { key: 'cost_ratio', label: '管理费率', fmt: 'raw', unit: '%', yoyKey: 'cost_ratio_chg', yoyFmt: 'bp' },
        { key: 'total_assets', label: '总资产', fmt: 'money', yoyKey: 'total_assets_yoy' },
        { key: 'net_assets', label: '归母净资产', fmt: 'money', yoyKey: 'net_assets_yoy' },
    ];
    function fmtYoy(v, fmt) {
        if (v == null) return null;
        if (fmt === 'bp') return (v > 0 ? '+' : '') + v.toFixed(2) + 'pct';
        return (v > 0 ? '+' : '') + v.toFixed(2) + '%';
    }
    function getRank(sc, key) {
        const sorted = [...ORDER].sort((a,b) => {
            const va = DATA[a].kpi[key]; const vb = DATA[b].kpi[key];
            if (va == null && vb == null) return 0;
            if (va == null) return 1; if (vb == null) return -1;
            if (key === 'cost_ratio') return va - vb;
            return vb - va;
        });
        const rank = sorted.indexOf(sc) + 1;
        return rank > 0 ? rank : '-';
    }
    let rowOrder;
    if (_matrixSort.colKey && metrics.some(m => m.key === _matrixSort.colKey)) {
        rowOrder = [...ORDER].sort((a,b) => {
            const va = DATA[a].kpi[_matrixSort.colKey]; const vb = DATA[b].kpi[_matrixSort.colKey];
            if (va == null && vb == null) return 0;
            if (va == null) return 1; if (vb == null) return -1;
            return _matrixSort.asc ? va - vb : vb - va;
        });
    } else {
        rowOrder = [...ORDER].sort((a,b) => {
            const va = DATA[a].kpi.revenue; const vb = DATA[b].kpi.revenue;
            if (va == null && vb == null) return 0;
            if (va == null) return 1; if (vb == null) return -1;
            return vb - va;
        });
    }
    let html = '<tr><th style="min-width:70px">公司</th>';
    for (const m of metrics) {
        const isSorted = _matrixSort.colKey === m.key;
        const arrow = isSorted ? (_matrixSort.asc ? ' ▲' : ' ▼') : '';
        html += '<th style="cursor:pointer" onclick="sortMatrixCol(\'' + m.key + '\')" title="点击排序">' + m.label + arrow + '</th>';
    }
    html += '</tr>';
    for (const sc of rowOrder) {
        html += '<tr><td style="text-align:left;font-weight:600">' + DATA[sc].short + '</td>';
        for (const m of metrics) {
            const v = DATA[sc].kpi[m.key];
            const rank = getRank(sc, m.key);
            let displayVal = '-';
            if (v != null) {
                if (m.fmt === 'money') displayVal = fmtYiSep(v);
                else displayVal = v.toFixed(2) + (m.unit || '');
            }
            let yoyTxt = '', yoyCls = '';
            if (m.yoyKey) {
                const yv = DATA[sc].kpi[m.yoyKey];
                if (yv != null) { yoyTxt = fmtYoy(yv, m.yoyFmt); yoyCls = yoyClass(yv); }
            }
            html += '<td style="text-align:center;padding:8px 4px">'
                + '<div style="font-weight:600;font-size:13px">' + displayVal + '</div>'
                + '<div style="font-size:11px;color:#888;margin-top:3px">#' + rank + '</div>'
                + (yoyTxt ? '<div style="font-size:11px;margin-top:3px" class="' + yoyCls + '">' + yoyTxt + '</div>' : '<div style="font-size:11px;color:#ccc;margin-top:3px">-</div>')
                + '</td>';
        }
        html += '</tr>';
    }
    document.getElementById('kpiMatrix').innerHTML = html;
}
function sortMatrixCol(key) {
    if (_matrixSort.colKey === key) _matrixSort.asc = !_matrixSort.asc;
    else { _matrixSort.colKey = key; _matrixSort.asc = false; }
    buildKpiMatrix();
}

/* ===== Revenue chart ===== */
function buildRevenueChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    // DATA[sc].kpi.revenue 和 np 已经是亿元单位，直接使用
    const rev = ORDER.map(sc => DATA[sc].kpi.revenue != null ? DATA[sc].kpi.revenue : null);
    const np = ORDER.map(sc => DATA[sc].kpi.np != null ? DATA[sc].kpi.np : null);
    const revYoy = ORDER.map(sc => DATA[sc].kpi.revenue_yoy);
    const npYoy = ORDER.map(sc => DATA[sc].kpi.np_yoy);
    new Chart(document.getElementById('chartRevenue'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '营业总收入（亿元）', data: rev, backgroundColor: 'rgba(67,126,188,0.55)', borderColor: '#437ebc', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
                { label: '归母净利润（亿元）', data: np, backgroundColor: 'rgba(74,158,106,0.45)', borderColor: '#4a9e6a', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
                { label: '营收同比(%)', data: revYoy, type: 'line', borderColor: '#cb6b5e', backgroundColor: 'rgba(203,107,94,0.1)', borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#cb6b5e', fill: true, tension: 0.3, yAxisID: 'y1' },
                { label: '净利润同比(%)', data: npYoy, type: 'line', borderColor: '#d9a844', backgroundColor: 'rgba(217,168,68,0.1)', borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#d9a844', borderDash: [6,3], fill: false, tension: 0.3, yAxisID: 'y1' },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: {
                y: { beginAtZero: true, position: 'left', title: { display: true, text: '单位：亿元' } },
                y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '同比(%)' } },
            },
        },
    });
}

/* ===== ROE + EPS chart ===== */
function buildROEChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const roe = ORDER.map(sc => DATA[sc].kpi.roe);
    const eps = ORDER.map(sc => DATA[sc].kpi.eps);
    new Chart(document.getElementById('chartROE'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '加权平均ROE(%)', data: roe, backgroundColor: 'rgba(74,158,106,0.5)', borderColor: '#4a9e6a', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
                { label: '基本每股收益（元）', data: eps, backgroundColor: 'rgba(203,107,94,0.45)', borderColor: '#cb6b5e', borderWidth: 1, borderRadius: 4, yAxisID: 'y1' },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: {
                y: { beginAtZero: true, position: 'left', title: { display: true, text: 'ROE(%)' } },
                y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'EPS(元)' } },
            },
        },
    });
}

/* ===== Biz mix stacked bar ===== */
function buildBizMixChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const bizKeys = ['brokerage_fee','ib','am','interest','investment','invest_assoc','other_fee','other_performance'];
    const bizLabels = ['经纪业务','投行业务','资管业务','利息净收入','投资业务','合联营收益','其他手续费','其他'];
    const colors = ['rgba(212,114,154,0.65)','rgba(95,163,124,0.65)','rgba(139,126,200,0.65)','rgba(212,168,67,0.65)','rgba(91,155,213,0.65)','rgba(165,165,165,0.65)','rgba(79,168,160,0.65)','rgba(192,128,112,0.65)'];
    const datasets = bizKeys.map((k, i) => ({
        label: bizLabels[i],
        data: ORDER.map(sc => getBizVal(sc, k)),
        backgroundColor: colors[i],
        borderRadius: 2,
    }));
    new Chart(document.getElementById('chartBizMix'), {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: '单位：亿元' } } },
        },
    });
}

/* Compute derived biz fields */
for (const sc of ORDER) {
    const b = DATA[sc].biz;
    b.other_fee_prev = (b.brokerage_prev != null && b.brokerage_fee_prev != null && b.ib_prev != null && b.am_prev != null)
        ? b.brokerage_prev - b.brokerage_fee_prev - b.ib_prev - b.am_prev : null;
    const other_fee_cur = (b.brokerage||0) - (b.brokerage_fee||0) - (b.ib||0) - (b.am||0);
    b.other_fee = other_fee_cur;
    b.other_fee_yoy = (b.other_fee_prev != null && b.other_fee_prev !== 0) ? (other_fee_cur - b.other_fee_prev) / b.other_fee_prev * 100 : null;
    b.invest_assoc_yoy = (b.invest_assoc_prev != null && b.invest_assoc_prev !== 0) ? (b.invest_assoc - b.invest_assoc_prev) / Math.abs(b.invest_assoc_prev) * 100 : null;
    b.other_performance_prev = (b.other_revenue_prev != null ? b.other_revenue_prev : 0) + (b.asset_disposal_prev != null ? b.asset_disposal_prev : 0) + (b.other_income_prev != null ? b.other_income_prev : 0);
    const other_perf_cur = (b.other_revenue||0) + (b.asset_disposal||0) + (b.other_income||0);
    b.other_performance = other_perf_cur;
    b.other_performance_yoy = (b.other_performance_prev !== 0) ? (other_perf_cur - b.other_performance_prev) / Math.abs(b.other_performance_prev) * 100 : null;
}

function buildBizYoYChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const bizKeys = ['brokerage_fee_yoy','ib_yoy','am_yoy','interest_yoy','investment_yoy',
                     'other_fee_yoy','invest_assoc_yoy','other_performance_yoy'];
    const bizLabels = ['经纪同比','投行同比','资管同比','利息同比','投资同比',
                       '其他手续费同比','合联营收益同比','其他同比'];
    const lineColors = ['#d4729a','#5fa37c','#8b7ec8','#d4a843','#5b9bd5',
                    '#a5a5a5','#4fa8a0','#c08070'];
    const fillColors = ['rgba(212,114,154,0.25)','rgba(95,163,124,0.25)','rgba(139,126,200,0.25)','rgba(212,168,67,0.25)','rgba(91,155,213,0.25)',
                    'rgba(165,165,165,0.25)','rgba(79,168,160,0.25)','rgba(192,128,112,0.25)'];
    const datasets = bizKeys.map((k, i) => ({
        label: bizLabels[i],
        data: ORDER.map(sc => DATA[sc].biz[k]),
        borderColor: lineColors[i],
        backgroundColor: fillColors[i],
        tension: 0.3,
        pointRadius: 4,
        spanGaps: true,
    }));
    new Chart(document.getElementById('chartBizYoY'), {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: { y: { beginAtZero: true, title: { display: true, text: '同比(%)' } } },
        },
    });
}

/* ===== Revenue structure ===== */
function buildRevenueStructureChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const pctKeys = ['brokerage_fee','ib','am','interest','investment','invest_assoc','other_fee','other_performance'];
    const pctLabels = ['经纪业务','投行','资管','利息','投资','合联营','其他手续费','其他'];
    const colors = ['rgba(212,114,154,0.7)','rgba(95,163,124,0.7)','rgba(139,126,200,0.7)','rgba(212,168,67,0.7)','rgba(91,155,213,0.7)','rgba(165,165,165,0.7)','rgba(79,168,160,0.7)','rgba(192,128,112,0.7)'];
    const datasets = pctKeys.map((k, i) => ({
        label: pctLabels[i],
        data: ORDER.map(sc => {
            const val = getBizRawVal(sc, k); const rev = DATA[sc].biz.revenue;
            return rev && val != null ? Math.round(val / rev * 10000) / 100 : null;
        }),
        backgroundColor: colors[i],
        borderRadius: 2,
    }));
    new Chart(document.getElementById('chartRevenueStructure'), {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: { x: { stacked: true }, y: { stacked: true, max: 100, beginAtZero: true, title: { display: true, text: '占比(%)' } } },
        },
    });
}

/* ===== Biz compare radar ===== */
function buildBizCompareChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const categories = ['brokerage_fee','ib','am','interest','investment','invest_assoc','other_fee','other_performance'];
    const catLabels = ['经纪','投行','资管','利息','投资业务','合联营','其他手续费','其他'];
    const lightColors = ['rgba(212,114,154,0.2)','rgba(95,163,124,0.2)','rgba(139,126,200,0.2)','rgba(212,168,67,0.2)','rgba(91,155,213,0.2)','rgba(165,165,165,0.2)','rgba(79,168,160,0.2)','rgba(192,128,112,0.2)'];
    const borderColors = ['#d4729a','#5fa37c','#8b7ec8','#d4a843','#5b9bd5','#a5a5a5','#4fa8a0','#c08070'];
    const datasets = categories.map((k, i) => ({
        label: catLabels[i],
        data: ORDER.map(sc => getBizVal(sc, k)),
        backgroundColor: lightColors[i],
        borderColor: borderColors[i],
        borderWidth: 2,
        pointBackgroundColor: borderColors[i],
    }));
    new Chart(document.getElementById('chartBizCompare'), {
        type: 'radar',
        data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: { r: { beginAtZero: true, ticks: { display: false }, grid: { color: 'rgba(0,0,0,0.08)' } } },
        },
    });
}

/* ===== Biz detail charts ===== */
const BIZ_CONFIGS = [
    { key: 'brokerage_fee', label: '经纪业务手续费净收入' },
    { key: 'ib', label: '投行业务净收入' },
    { key: 'am', label: '资管业务净收入' },
    { key: 'investment', label: '投资净收入(扣合联营)', formula: '投资业务 = 投资收益(扣联营) + 公允价值变动收益 + 汇兑收益' },
    { key: 'interest', label: '利息净收入' },
    { key: 'invest_assoc', label: '合联营收益' },
    { key: 'other_performance', label: '其他', formula: '其他 = 其他收益 + 资产处置损益 + 其他业务收入' },
];
const bizCharts = [];
function createBizDetailChart(idx) {
    const cfg = BIZ_CONFIGS[idx];
    const labels = ORDER.map(sc => DATA[sc].short);
    const values = ORDER.map(sc => getBizVal(sc, cfg.key));
    const yoys = ORDER.map(sc => cfg.key === 'investment' ? DATA[sc].biz.investment_yoy : DATA[sc].biz[cfg.key + '_yoy']);
    const hasYoy = yoys.some(v => v != null);
    const container = document.getElementById('bizDetailCharts');
    if (!container) return;
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-bottom:24px';
    const title = document.createElement('div');
    title.style.cssText = 'font-size:14px;font-weight:600;color:#333;margin-bottom:8px';
    title.textContent = cfg.label + (cfg.formula ? ' (' + cfg.formula + ')' : '');
    wrapper.appendChild(title);
    const canvasDiv = document.createElement('div');
    canvasDiv.style.cssText = 'position:relative;height:320px';
    const canvas = document.createElement('canvas');
    canvas.id = 'chartBizDetail' + idx;
    canvasDiv.appendChild(canvas);
    wrapper.appendChild(canvasDiv);
    container.appendChild(wrapper);
    const ctx = canvas.getContext('2d');
    if (bizCharts[idx]) bizCharts[idx].destroy();
    const datasets = [
        { label: cfg.label + '（亿元）', data: values, backgroundColor: COLORS_ALPHA, borderColor: COLORS, borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
    ];
    if (hasYoy) {
        datasets.push({ label: '同比增速（%）', data: yoys, type: 'line', borderColor: '#cb6b5e', backgroundColor: 'rgba(203,107,94,0.1)', borderWidth: 3, pointBackgroundColor: '#cb6b5e', pointRadius: 4, pointHoverRadius: 6, fill: true, tension: 0.3, yAxisID: 'y1' });
    }
    const opts = {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
        scales: {
            y: { beginAtZero: true, position: 'left', title: { display: true, text: '单位：亿元' } },
        },
    };
    if (hasYoy) {
        opts.scales.y1 = { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '同比(%)' } };
    }
    bizCharts[idx] = new Chart(ctx, { type: 'bar', data: { labels, datasets }, options: opts });
}

/* ===== Fin Assets chart ===== */
function buildInvestIncomeChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    new Chart(document.getElementById('chartInvestIncome'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '投资收益(扣联营)', data: ORDER.map(sc => DATA[sc].biz.invest_ex_assoc != null ? DATA[sc].biz.invest_ex_assoc : 0), backgroundColor: 'rgba(139,126,200,0.6)', borderColor: '#8b7ec8', borderWidth: 1, borderRadius: 2 },
                { label: '公允价值变动收益', data: ORDER.map(sc => DATA[sc].biz.fair_value != null ? DATA[sc].biz.fair_value : 0), backgroundColor: 'rgba(203,107,94,0.6)', borderColor: '#cb6b5e', borderWidth: 1, borderRadius: 2 },
                { label: '汇兑收益', data: ORDER.map(sc => DATA[sc].biz.fx_income != null ? DATA[sc].biz.fx_income : 0), backgroundColor: 'rgba(95,163,124,0.5)', borderColor: '#5fa37c', borderWidth: 1, borderRadius: 2 },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: '单位：亿元' } } },
        },
    });
}

function buildFinAssetsTotalChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const curr = ORDER.map(sc => DATA[sc].biz.fin_assets_total != null ? DATA[sc].biz.fin_assets_total : 0);
    const prev = ORDER.map(sc => DATA[sc].biz.fin_assets_total_prev != null ? DATA[sc].biz.fin_assets_total_prev : 0);
    new Chart(document.getElementById('chartFinAssetsTotal'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '期末余额', data: curr, backgroundColor: 'rgba(67,126,188,0.7)', borderColor: '#437ebc', borderWidth: 1, borderRadius: 4 },
                { label: '期初余额', data: prev, backgroundColor: 'rgba(203,107,94,0.4)', borderColor: '#cb6b5e', borderWidth: 1, borderRadius: 4 },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: { y: { beginAtZero: true, title: { display: true, text: '单位：亿元' } } },
        },
    });
}

const FIN_ASSET_CONFIGS = [
    { key: 'trading_assets', label: '交易性金融资产' },
    { key: 'debt_invest', label: '债权投资' },
    { key: 'other_debt', label: '其他债权投资' },
    { key: 'other_equity', label: '其他权益工具投资' },
];
const FIN_ASSET_THEMES = [
    { curBg: 'rgba(67,126,188,0.75)', curBorder: '#437ebc', prevBg: 'rgba(67,126,188,0.25)', prevBorder: '#437ebc', yoyColor: '#cb6b5e', yoyBg: 'rgba(203,107,94,0.1)' },
    { curBg: 'rgba(95,163,124,0.7)', curBorder: '#5fa37c', prevBg: 'rgba(95,163,124,0.25)', prevBorder: '#5fa37c', yoyColor: '#8b7ec8', yoyBg: 'rgba(139,126,200,0.1)' },
    { curBg: 'rgba(139,126,200,0.65)', curBorder: '#8b7ec8', prevBg: 'rgba(139,126,200,0.2)', prevBorder: '#8b7ec8', yoyColor: '#d9a844', yoyBg: 'rgba(217,168,68,0.1)' },
    { curBg: 'rgba(217,168,68,0.65)', curBorder: '#d9a844', prevBg: 'rgba(217,168,68,0.2)', prevBorder: '#d9a844', yoyColor: '#437ebc', yoyBg: 'rgba(67,126,188,0.1)' },
];
const finAssetCharts = [];
function createFinAssetChart(idx) {
    const cfg = FIN_ASSET_CONFIGS[idx];
    const th = FIN_ASSET_THEMES[idx];
    const labels = ORDER.map(sc => DATA[sc].short);
    const curData = ORDER.map(sc => DATA[sc].biz[cfg.key] != null ? DATA[sc].biz[cfg.key] : null);
    const prevData = ORDER.map(sc => DATA[sc].biz[cfg.key + '_prev'] != null ? DATA[sc].biz[cfg.key + '_prev'] : null);
    const yoyData = ORDER.map(sc => {
        const cur = DATA[sc].biz[cfg.key];
        const prev = DATA[sc].biz[cfg.key + '_prev'];
        if (cur != null && prev != null && prev !== 0) return ((cur - prev) / prev * 100);
        return null;
    });
    const hasYoy = yoyData.some(v => v != null);
    const canvas = document.getElementById('chartFinAsset' + idx);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (finAssetCharts[idx]) finAssetCharts[idx].destroy();
    const datasets = [
        { label: '期末余额', data: curData, backgroundColor: th.curBg, borderColor: th.curBorder, borderWidth: 1, borderRadius: 4, order: 2 },
        { label: '期初余额', data: prevData, backgroundColor: th.prevBg, borderColor: th.prevBorder, borderWidth: 1, borderRadius: 4, order: 1 },
    ];
    if (hasYoy) {
        datasets.push({ label: '同比变动(%)', data: yoyData, type: 'line', borderColor: th.yoyColor, backgroundColor: th.yoyBg, borderWidth: 3, pointBackgroundColor: th.yoyColor, pointRadius: 4, pointHoverRadius: 6, fill: true, tension: 0.3, yAxisID: 'y1' });
    }
    const opts = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { padding: 6 } },
            datalabels: { display: false },
            title: { display: true, text: cfg.label, font: { size: 13, weight: 'bold' }, color: '#333', padding: { bottom: 8 } },
        },
        scales: { y: { beginAtZero: true, position: 'left', title: { display: true, text: '单位：亿元' } } },
    };
    if (hasYoy) {
        opts.scales.y1 = { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '同比(%)' } };
    }
    finAssetCharts[idx] = new Chart(ctx, { type: 'bar', data: { labels, datasets }, options: opts });
}

function buildFinAssetCharts() {
    for (let i = 0; i < FIN_ASSET_CONFIGS.length; i++) createFinAssetChart(i);
}

function buildDerivPositionChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const derivAssets = ORDER.map(sc => DATA[sc].biz.deriv_assets != null ? DATA[sc].biz.deriv_assets : 0);
    const derivLiab = ORDER.map(sc => DATA[sc].biz.deriv_liab != null ? DATA[sc].biz.deriv_liab : 0);
    const derivNet = labels.map((_, i) => derivAssets[i] - derivLiab[i]);
    new Chart(document.getElementById('chartDerivPosition'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '衍生金融资产', data: derivAssets, backgroundColor: 'rgba(67,126,188,0.6)', borderColor: '#437ebc', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
                { label: '衍生金融负债', data: derivLiab, backgroundColor: 'rgba(203,107,94,0.45)', borderColor: '#cb6b5e', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
                { label: '净头寸', data: derivNet, type: 'line', borderColor: '#4a9e6a', backgroundColor: 'rgba(74,158,106,0.15)', borderWidth: 3, pointRadius: 4, pointHoverRadius: 6, fill: true, tension: 0.3, yAxisID: 'y1' },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: {
                y: { beginAtZero: true, position: 'left', title: { display: true, text: '资产/负债（亿元）' } },
                y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '净头寸（亿元）' } },
            },
        },
    });
}





/* ===== Efficiency & Risk ===== */
function buildEffMarginChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const curData = ORDER.map(sc => DATA[sc].kpi.np_margin);
    const prevData = ORDER.map(sc => DATA[sc].kpi.np_margin_prev);
    const avg = curData.reduce((s, v) => s + (v||0), 0) / curData.filter(v => v != null).length || 0;
    new Chart(document.getElementById('chartEffMargin'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '本期', data: curData, backgroundColor: 'rgba(67,126,188,0.75)', borderRadius: 4 },
                { label: '上期', data: prevData, backgroundColor: 'rgba(67,126,188,0.2)', borderRadius: 4 },
                { label: '行业均值(本期)', data: labels.map(() => avg), type: 'line', borderColor: '#cb6b5e', borderDash: [5,5], borderWidth: 2, pointRadius: 0, fill: false },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { padding: 6 } },
                datalabels: { display: false },
                title: { display: true, text: '扣非归母净利率 = 扣非归母净利润 / 营业总收入 × 100%', font: { size: 11 }, color: '#888', padding: { bottom: 8 } },
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: '%' } } },
        },
    });
}

function buildEffCostChart() {
    const labels = ORDER.map(sc => DATA[sc].short);
    const curData = ORDER.map(sc => DATA[sc].kpi.cost_ratio);
    const prevData = ORDER.map(sc => DATA[sc].kpi.cost_ratio_prev);
    const avg = curData.reduce((s, v) => s + (v||0), 0) / curData.filter(v => v != null).length || 0;
    new Chart(document.getElementById('chartEffCost'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '本期', data: curData, backgroundColor: 'rgba(203,107,94,0.7)', borderRadius: 4 },
                { label: '上期', data: prevData, backgroundColor: 'rgba(203,107,94,0.18)', borderRadius: 4 },
                { label: '行业均值(本期)', data: labels.map(() => avg), type: 'line', borderColor: '#437ebc', borderDash: [5,5], borderWidth: 2, pointRadius: 0, fill: false },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { padding: 6 } },
                datalabels: { display: false },
                title: { display: true, text: '管理费率 = 业务及管理费 / 营业总收入 × 100%', font: { size: 11 }, color: '#888', padding: { bottom: 8 } },
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: '%' } } },
        },
    });
}

function buildEffROEChart() {
    const roeData = ORDER.map(sc => DATA[sc].kpi.roe);
    const roeYoy = ORDER.map(sc => DATA[sc].kpi.roe_yoy);
    new Chart(document.getElementById('chartEffROE'), {
        type: 'bar',
        data: {
            labels: ORDER.map(sc => DATA[sc].short),
            datasets: [
                { label: 'ROE(%)', data: roeData, backgroundColor: 'rgba(74,158,106,0.65)', borderRadius: 4, yAxisID: 'y' },
                { label: '同比变化(百分点)', data: roeYoy, type: 'line', borderColor: '#437ebc', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#437ebc', fill: false, tension: 0.3, yAxisID: 'y1' },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', labels: { padding: 6 } }, datalabels: { display: false } },
            scales: {
                y: { beginAtZero: true, position: 'left', title: { display: true, text: 'ROE(%)' } },
                y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '同比变化(百分点)' } },
            },
        },
    });
}

const RISK_CONFIGS = [
    { key: 'risk_coverage', canvasId: 'chartRiskCoverage', label: '风险覆盖率', unit: '%', minLine: 100, warnLine: 120, color: '#437ebc', prevColor: 'rgba(67,126,188,0.2)', warnColor: '#cb6b5e', minColor: '#4a9e6a' },
    { key: 'capital_leverage', canvasId: 'chartCapitalLeverage', label: '资本杠杆率', unit: '%', minLine: 8, warnLine: 9.6, color: '#8b7ec8', prevColor: 'rgba(139,126,200,0.2)', warnColor: '#cb6b5e', minColor: '#4a9e6a' },
    { key: 'liquidity_coverage', canvasId: 'chartLiquidityCoverage', label: '流动性覆盖率', unit: '%', minLine: 100, warnLine: 120, color: '#4fa8a0', prevColor: 'rgba(79,168,160,0.2)', warnColor: '#cb6b5e', minColor: '#4a9e6a' },
    { key: 'stable_funding', canvasId: 'chartStableFunding', label: '净稳定资金率', unit: '%', minLine: 100, warnLine: 120, color: '#4a9e6a', prevColor: 'rgba(74,158,106,0.2)', warnColor: '#cb6b5e', minColor: '#4a9e6a' },
];
const riskCharts = [];
function buildRiskCoverageChart() { buildRiskChart(0); }
function buildCapitalLeverageChart() { buildRiskChart(1); }
function buildLiquidityCoverageChart() { buildRiskChart(2); }
function buildStableFundingChart() { buildRiskChart(3); }
function buildRiskChart(idx) {
    const cfg = RISK_CONFIGS[idx];
    const labels = ORDER.map(sc => DATA[sc].short);
    const curData = ORDER.map(sc => DATA[sc].risk[cfg.key]);
    const prevData = ORDER.map(sc => DATA[sc].risk[cfg.key + '_prev']);
    const canvas = document.getElementById(cfg.canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (riskCharts[idx]) riskCharts[idx].destroy();
    riskCharts[idx] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: '本期', data: curData, backgroundColor: cfg.color + 'cc', borderColor: cfg.color, borderWidth: 1, borderRadius: 4 },
                { label: '上期', data: prevData, backgroundColor: cfg.prevColor, borderColor: cfg.color, borderWidth: 1, borderRadius: 4 },
                { label: '预警线(' + cfg.warnLine + cfg.unit + ')', data: labels.map(() => cfg.warnLine), type: 'line', borderColor: cfg.warnColor, borderDash: [8,4], borderWidth: 2, pointRadius: 0, fill: false },
                { label: '监管线(' + cfg.minLine + cfg.unit + ')', data: labels.map(() => cfg.minLine), type: 'line', borderColor: cfg.minColor, borderDash: [4,4], borderWidth: 2, pointRadius: 0, fill: false },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', labels: { padding: 6 } },
                datalabels: { display: false },
                title: { display: true, text: cfg.label, font: { size: 13, weight: 'bold' }, color: '#333', padding: { bottom: 8 } },
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: cfg.unit } } },
        },
    });
}

/* ===== Raw data table ===== */
function buildRawDataTable() {
    let html = '<tr><th style="text-align:left;min-width:100px">项目</th>';
    for (const sc of ORDER) html += '<th style="position:relative;z-index:1;background:#f8f9fa">' + DATA[sc].short + '</th>';
    html += '</tr>';
    
    const groups = [
        {
            label: '一、收入结构',
            rows: [
                { key: 'revenue', label: '营业收入（合计）', src: 'kpi' },
                { key: 'brokerage', label: '　手续费及佣金净收入', src: 'biz' },
                { key: 'brokerage_fee', label: '　　其中：经纪业务净收入', src: 'biz' },
                { key: 'ib', label: '　　投资银行业务净收入', src: 'biz' },
                { key: 'am', label: '　　资产管理业务净收入', src: 'biz' },
                { key: 'interest', label: '　利息净收入', src: 'biz' },
                { key: 'investment', label: '　投资净收入', src: 'calc', calcExpr: '(DATA[sc].biz.invest_ex_assoc||0)+(DATA[sc].biz.fair_value||0)+(DATA[sc].biz.fx_income||0)' },
                { key: 'invest_assoc', label: '　合联营收益', src: 'biz' },
                { key: 'other_performance', label: '　其他', src: 'calc', calcExpr: '(DATA[sc].biz.other_revenue||0)+(DATA[sc].biz.asset_disposal||0)+(DATA[sc].biz.other_income||0)' },
            ],
        },
        {
            label: '二、费用及减值',
            rows: [
                { key: 'cost', label: '业务及管理费', src: 'biz' },
                { key: 'credit_loss', label: '信用减值损失', src: 'biz' },
            ],
        },
    ];
    
    for (const g of groups) {
        html += '<tr style="background:#f0f2f5"><td style="text-align:left;font-weight:700;color:#1a1a2e;font-size:13px;padding:8px 12px;background:#f0f2f5">' + g.label + '</td>';
        for (let i = 0; i < ORDER.length; i++) html += '<td style="background:#f0f2f5;position:relative;z-index:1"></td>';
        html += '</tr>';
        for (const r of g.rows) {
            html += '<tr><td style="text-align:left;font-weight:400;color:#555;padding:5px 12px;background:#fff">' + r.label + '</td>';
            for (const sc of ORDER) {
                let v;
                if (r.src === 'biz') v = DATA[sc].biz[r.key];
                else if (r.src === 'kpi') v = DATA[sc].kpi[r.key];
                else if (r.src === 'calc') v = eval(r.calcExpr);
                else v = null;
                html += '<td style="padding:5px 8px;text-align:right;position:relative;z-index:1;background:#fff">' + (v != null ? fmtYiSep(v) : '-') + '</td>';
            }
            html += '</tr>';
        }
    }
    document.getElementById('rawDataTable').innerHTML = html;
}

/* ===== Init ===== */
buildKpiGrid();
buildKpiMatrix();
buildRevenueChart();
buildROEChart();
buildBizMixChart();
buildBizYoYChart();
buildRevenueStructureChart();
buildBizCompareChart();
for (let i = 0; i < BIZ_CONFIGS.length; i++) createBizDetailChart(i);
buildInvestIncomeChart();
buildFinAssetsTotalChart();
buildFinAssetCharts();
buildDerivPositionChart();
buildEffMarginChart();
buildEffCostChart();
buildEffROEChart();
buildRiskCoverageChart();
buildCapitalLeverageChart();
buildLiquidityCoverageChart();
buildStableFundingChart();
buildRawDataTable();

/* Re-trigger chart resize on tab switch */



// ── Tab render wrappers ──
function renderTab0(DATA, companies, codes) {
    buildKpiGrid();
    buildRevenueChart();
    buildROEChart();
    buildBizMixChart();
    buildBizYoYChart();
}
function renderTab1(DATA, companies, codes) {
    buildKpiMatrix();
}
function renderTab2(DATA, companies, codes) {
    buildRevenueStructureChart();
    buildBizCompareChart();
}
function renderTab3(DATA, companies, codes) {
    var container = document.getElementById("bizDetailCharts");
    if (!container) return;
    container.innerHTML = "";
    var fields = [
        {key:"brokerage", label:"手续费及佣金净收入"},
        {key:"interest", label:"利息净收入"},
        {key:"investment", label:"投资业务合计(扣联营)"}
    ];
    var subFields = [
        {key:"brokerage_fee", label:"经纪业务手续费"},
        {key:"ib", label:"投资银行业务手续费"},
        {key:"am", label:"资产管理业务手续费"}
    ];
    var allKeys = fields.concat(subFields);
    allKeys.forEach(function(f) {
        var div = document.createElement("div");
        div.className = "card";
        div.innerHTML = '<div style="font-size:14px;font-weight:600;margin-bottom:12px">' + f.label + '</div><div class="chart-row"><div class="chart-container" style="height:340px"><canvas id="bizDetail_' + f.key + '_bar"></canvas></div><div class="chart-container" style="height:340px"><canvas id="bizDetail_' + f.key + '_yoy"></canvas></div></div>';
        container.appendChild(div);
    });
    setTimeout(function() {
        allKeys.forEach(function(f) {
            createBizDetailChart(f.key, f.label);
        });
    }, 50);
}
function renderTab4(DATA, companies, codes) {
    buildInvestIncomeChart();
    buildFinAssetsTotalChart();
    buildFinAssetCharts();
    buildDerivPositionChart();
}
function renderTab5(DATA, companies, codes) {
    buildEffMarginChart();
    buildEffCostChart();
    buildEffROEChart();
    buildRiskCoverageChart();
    buildCapitalLeverageChart();
    buildLiquidityCoverageChart();
    buildStableFundingChart();
}
function renderTab6(DATA, companies, codes) {
    buildRawDataTable();
}


// Override initial calls to work with the unified system
// Remove the old immediate calls at end of script (they reference DATA directly)
// Instead, our renderPeriod function handles everything

// Auto-render first period
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() { renderPeriod("2026Q1"); switchDashTab(0, ALL_DATA["2026Q1"], Object.keys(ALL_DATA["2026Q1"]), Object.keys(ALL_DATA["2026Q1"]).map(function(c) { return ALL_DATA["2026Q1"][c].short || c; })); }, 100);
});
