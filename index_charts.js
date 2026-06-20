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


const DATA = {"600030":{name:"中信证券",short:"中信证券",kpi:{revenue:231.55,revenue_prev:164.32,revenue_yoy:40.91,np:102.16,np_prev:66.08,np_yoy:54.6,deducted_np:102.03,deducted_np_prev:66.08,deducted_np_yoy:54.4,eps:0.67,eps_yoy:59.52,roe:3.46,roe_prev:2.37,roe_yoy:1.09,total_assets:22446.74,total_assets_yoy:25.45,net_assets:3345.71,net_assets_yoy:10.62,np_margin:44.06,np_margin_prev:40.21,np_margin_chg:3.85,cost_ratio:40.29,cost_ratio_prev:46.48,cost_ratio_chg:-6.19},biz:{brokerage:102.7,brokerage_prev:72.96,brokerage_yoy:40.76,brokerage_fee:49.15,brokerage_fee_prev:33.25,brokerage_fee_yoy:47.82,ib:12.07,ib_prev:9.76,ib_yoy:23.67,am:35.05,am_prev:25.63,am_yoy:36.75,interest:10.53,interest_prev:-2.02,interest_yoy:621.29,invest_income:58.02,invest_ex_assoc:55.52,invest_ex_assoc_prev:144.22,invest_assoc:2.5,invest_assoc_prev:0.79,invest_assoc_yoy:216.46,fair_value:61.27,fx_income:-3.9,investment:112.89,investment_yoy:24.89,cost:93.29,credit_loss:4.17,other_revenue:0.96,other_revenue_prev:0.67,asset_disposal:-0.0,asset_disposal_prev:0.02,other_income:1.97,other_income_prev:1.52,other_fee:6.43,other_fee_prev:4.32,other_performance:2.93,other_performance_prev:2.21,trading_assets:7954.77,trading_assets_prev:7772.21,debt_invest:0.0,debt_invest_prev:0.0,other_debt:576.82,other_debt_prev:539.43,other_equity:1219.17,other_equity_prev:916.33,deriv_assets:518.99,deriv_assets_prev:420.52,deriv_liab:649.61,deriv_liab_prev:489.12,deriv_net:-130.62,deriv_net_prev:-68.60000000000002,margin_lending:2159.24,margin_lending_prev:1497.77,reverse_repo:762.17,reverse_repo_prev:544.97,trading_liab:1871.82,trading_liab_prev:1388.45,fin_assets_total:9750.76,fin_assets_total_prev:9227.97,revenue:231.55},risk:{risk_coverage:216.14,risk_coverage_prev:216.02,capital_leverage:13.47,capital_leverage_prev:14.58,liquidity_coverage:179.2,liquidity_coverage_prev:164.35,stable_funding:137.82,stable_funding_prev:136.93}},"601211":{name:"国泰海通",short:"国泰海通",kpi:{revenue:162.32,revenue_prev:102.15,revenue_yoy:58.9,np:63.88,np_prev:122.42,np_yoy:-47.82,deducted_np:57.11,deducted_np_prev:122.42,deducted_np_yoy:-53.35,eps:0.36,eps_yoy:-68.97,roe:1.95,roe_prev:6.46,roe_yoy:-4.51,total_assets:22597.16,total_assets_yoy:33.48,net_assets:3364.25,net_assets_yoy:4.58,np_margin:35.18,np_margin_prev:119.84,np_margin_chg:-84.66,cost_ratio:43.85,cost_ratio_prev:48.15,cost_ratio_chg:-4.3},biz:{brokerage:75.15,brokerage_prev:46.67,brokerage_yoy:61.02,brokerage_fee:47.27,brokerage_fee_prev:26.52,brokerage_fee_yoy:78.24,ib:7.54,ib_prev:7.08,ib_yoy:6.5,am:17.57,am_prev:11.68,am_yoy:50.43,interest:17.6,interest_prev:6.94,interest_yoy:153.6,invest_income:15.95,invest_ex_assoc:13.53,invest_ex_assoc_prev:69.83,invest_assoc:2.42,invest_assoc_prev:1.05,invest_assoc_yoy:130.48,fair_value:44.85,fx_income:-4.62,investment:53.76,investment_yoy:34.06,cost:71.17,credit_loss:4.34,other_revenue:9.85,other_revenue_prev:5.49,asset_disposal:0.0,asset_disposal_prev:0.01,other_income:3.53,other_income_prev:1.89,other_fee:2.78,other_fee_prev:1.39,other_performance:13.38,other_performance_prev:7.39,trading_assets:6968.73,trading_assets_prev:5497.47,debt_invest:95.49,debt_invest_prev:90.88,other_debt:1512.43,other_debt_prev:1203.71,other_equity:724.63,other_equity_prev:408.85,deriv_assets:179.28,deriv_assets_prev:147.28,deriv_liab:174.54,deriv_liab_prev:124.33,deriv_net:4.740000000000009,deriv_net_prev:22.950000000000003,margin_lending:2544.87,margin_lending_prev:1885.63,reverse_repo:866.15,reverse_repo_prev:699.78,trading_liab:1027.58,trading_liab_prev:833.58,fin_assets_total:9301.279999999999,fin_assets_total_prev:7200.910000000001,revenue:162.32},risk:{risk_coverage:257.41,risk_coverage_prev:309.16,capital_leverage:19.79,capital_leverage_prev:25.43,liquidity_coverage:282.49,liquidity_coverage_prev:383.81,stable_funding:148.18,stable_funding_prev:157.73}},"000776":{name:"广发证券",short:"广发证券",kpi:{revenue:116.82,revenue_prev:71.09,revenue_yoy:64.33,np:47.07,np_prev:27.57,np_yoy:70.73,deducted_np:47.11,deducted_np_prev:27.57,deducted_np_yoy:70.87,eps:0.58,eps_yoy:75.76,roe:3.32,roe_prev:2.06,roe_yoy:1.26,total_assets:11222.27,total_assets_yoy:37.76,net_assets:1714.85,net_assets_yoy:14.32,np_margin:40.33,np_margin_prev:38.78,np_margin_chg:1.55,cost_ratio:45.93,cost_ratio_prev:49.68,cost_ratio_chg:-3.75},biz:{brokerage:60.04,brokerage_prev:40.47,brokerage_yoy:48.36,brokerage_fee:31.4,brokerage_fee_prev:20.45,brokerage_fee_yoy:53.55,ib:1.65,ib_prev:1.54,ib_yoy:7.14,am:24.61,am_prev:16.92,am_yoy:45.45,interest:4.46,interest_prev:5.32,interest_yoy:-16.17,invest_income:16.36,invest_ex_assoc:12.47,invest_ex_assoc_prev:21.36,invest_assoc:3.89,invest_assoc_prev:1.79,invest_assoc_yoy:117.32,fair_value:39.71,fx_income:-4.49,investment:47.69,investment_yoy:107.8,cost:53.66,credit_loss:-0.1,other_revenue:0.47,other_revenue_prev:0.46,asset_disposal:0.0,asset_disposal_prev:-0.03,other_income:0.26,other_income_prev:0.14,other_fee:2.39,other_fee_prev:1.56,other_performance:0.73,other_performance_prev:0.57,trading_assets:4493.33,trading_assets_prev:2972.88,debt_invest:0.01,debt_invest_prev:0.72,other_debt:741.07,other_debt_prev:1132.51,other_equity:387.95,other_equity_prev:244.62,deriv_assets:86.33,deriv_assets_prev:37.5,deriv_liab:158.16,deriv_liab_prev:67.03,deriv_net:-71.83,deriv_net_prev:-29.53,margin_lending:1534.05,margin_lending_prev:1113.19,reverse_repo:188.36,reverse_repo_prev:202.37,trading_liab:654.95,trading_liab_prev:126.41,fin_assets_total:5622.36,fin_assets_total_prev:4350.73,revenue:116.82},risk:{risk_coverage:244.32,risk_coverage_prev:258.89,capital_leverage:11.5,capital_leverage_prev:12.31,liquidity_coverage:202.34,liquidity_coverage_prev:168.97,stable_funding:152.7,stable_funding_prev:159.93}},"601688":{name:"华泰证券",short:"华泰证券",kpi:{revenue:104.22,revenue_prev:73.66,revenue_yoy:41.49,np:48.0,np_prev:36.42,np_yoy:31.8,deducted_np:48.02,deducted_np_prev:36.42,deducted_np_yoy:31.85,eps:0.51,eps_yoy:34.21,roe:2.61,roe_prev:2.1,roe_yoy:0.51,total_assets:12254.06,total_assets_yoy:48.85,net_assets:2114.07,net_assets_yoy:8.27,np_margin:46.08,np_margin_prev:49.44,np_margin_chg:-3.36,cost_ratio:41.41,cost_ratio_prev:42.61,cost_ratio_chg:-1.2},biz:{brokerage:43.66,brokerage_prev:29.67,brokerage_yoy:47.15,brokerage_fee:29.13,brokerage_fee_prev:19.36,brokerage_fee_yoy:50.46,ib:8.61,ib_prev:5.42,ib_yoy:58.86,am:4.8,am_prev:4.24,am_yoy:13.21,interest:10.71,interest_prev:9.65,interest_yoy:10.98,invest_income:49.38,invest_ex_assoc:42.26,invest_ex_assoc_prev:34.94,invest_assoc:7.12,invest_assoc_prev:7.51,invest_assoc_yoy:-5.19,fair_value:2.93,fx_income:-4.62,investment:40.57,investment_yoy:56.64,cost:43.16,credit_loss:0.69,other_revenue:0.64,other_revenue_prev:0.39,asset_disposal:0.0,asset_disposal_prev:0.0,other_income:1.52,other_income_prev:0.55,other_fee:1.12,other_fee_prev:0.65,other_performance:2.16,other_performance_prev:0.94,trading_assets:4437.62,trading_assets_prev:3114.88,debt_invest:450.72,debt_invest_prev:475.09,other_debt:362.77,other_debt_prev:170.45,other_equity:148.08,other_equity_prev:19.65,deriv_assets:145.97,deriv_assets_prev:74.67,deriv_liab:234.01,deriv_liab_prev:112.17,deriv_net:-88.03999999999999,deriv_net_prev:-37.5,margin_lending:1871.77,margin_lending_prev:1335.53,reverse_repo:225.29,reverse_repo_prev:127.74,trading_liab:531.22,trading_liab_prev:356.8,fin_assets_total:5399.1900000000005,fin_assets_total_prev:3780.07,revenue:104.22},risk:{risk_coverage:310.47,risk_coverage_prev:393.56,capital_leverage:12.98,capital_leverage_prev:18.04,liquidity_coverage:409.47,liquidity_coverage_prev:270.88,stable_funding:152.57,stable_funding_prev:164.99}},"601995":{name:"中金公司",short:"中金公司",kpi:{revenue:88.25,revenue_prev:57.21,revenue_yoy:54.26,np:35.77,np_prev:20.42,np_yoy:75.17,deducted_np:35.38,deducted_np_prev:20.08,deducted_np_yoy:76.2,eps:0.7,eps_yoy:84.21,roe:3.35,roe_prev:1.98,roe_yoy:1.37,total_assets:8697.66,total_assets_yoy:29.2,net_assets:1324.68,net_assets_yoy:13.07,np_margin:40.09,np_margin_prev:35.1,np_margin_chg:4.99,cost_ratio:48.39,cost_ratio_prev:57.35,cost_ratio_chg:-8.96},biz:{brokerage:46.37,brokerage_prev:25.74,brokerage_yoy:80.15,brokerage_fee:20.05,brokerage_fee_prev:12.98,brokerage_fee_yoy:54.47,ib:15.45,ib_prev:4.03,ib_yoy:283.37,am:3.97,am_prev:3.08,am_yoy:28.9,interest:1.08,interest_prev:-5.14,interest_yoy:121.01,invest_income:19.31,invest_ex_assoc:19.05,invest_ex_assoc_prev:42.34,invest_assoc:0.27,invest_assoc_prev:0.11,invest_assoc_yoy:145.45,fair_value:22.7,fx_income:-1.86,investment:39.89,investment_yoy:10.56,cost:42.7,credit_loss:0.54,other_revenue:0.45,other_revenue_prev:0.26,asset_disposal:0.01,asset_disposal_prev:0.02,other_income:0.19,other_income_prev:0.15,other_fee:6.89,other_fee_prev:5.65,other_performance:0.65,other_performance_prev:0.43,trading_assets:3136.25,trading_assets_prev:2854.34,debt_invest:0.0,debt_invest_prev:0.0,other_debt:1274.97,other_debt_prev:854.0,other_equity:132.93,other_equity_prev:94.2,deriv_assets:158.97,deriv_assets_prev:103.9,deriv_liab:248.64,deriv_liab_prev:107.76,deriv_net:-89.66999999999999,deriv_net_prev:-3.8599999999999994,margin_lending:668.57,margin_lending_prev:453.11,reverse_repo:384.58,reverse_repo_prev:219.45,trading_liab:372.09,trading_liab_prev:274.62,fin_assets_total:4544.150000000001,fin_assets_total_prev:3802.54,revenue:88.25},risk:{risk_coverage:162.81,risk_coverage_prev:219.1,capital_leverage:11.73,capital_leverage_prev:12.76,liquidity_coverage:401.98,liquidity_coverage_prev:371.61,stable_funding:152.65,stable_funding_prev:149.4}},"601066":{name:"中信建投",short:"中信建投",kpi:{revenue:76.96,revenue_prev:47.43,revenue_yoy:62.26,np:36.67,np_prev:18.43,np_yoy:98.97,deducted_np:36.23,deducted_np_prev:18.43,deducted_np_yoy:96.58,eps:0.44,eps_yoy:120.0,roe:4.02,roe_prev:2.04,roe_yoy:1.98,total_assets:7796.14,total_assets_yoy:29.83,net_assets:1268.23,net_assets_yoy:20.5,np_margin:47.08,np_margin_prev:38.86,np_margin_chg:8.22,cost_ratio:39.55,cost_ratio_prev:51.25,cost_ratio_chg:-11.7},biz:{brokerage:35.95,brokerage_prev:25.96,brokerage_yoy:38.48,brokerage_fee:23.77,brokerage_fee_prev:17.36,brokerage_fee_yoy:36.92,ib:6.12,ib_prev:3.58,ib_yoy:70.95,am:3.64,am_prev:3.33,am_yoy:9.31,interest:3.64,interest_prev:0.47,interest_yoy:674.47,invest_income:20.51,invest_ex_assoc:20.51,invest_ex_assoc_prev:19.78,invest_assoc:-0.0,invest_assoc_prev:0.0,invest_assoc_yoy:null,fair_value:14.11,fx_income:0.97,investment:35.59,investment_yoy:76.36,cost:30.44,credit_loss:-0.52,other_revenue:1.26,other_revenue_prev:0.36,asset_disposal:0.0,asset_disposal_prev:0.01,other_income:0.51,other_income_prev:0.44,other_fee:2.43,other_fee_prev:1.69,other_performance:1.77,other_performance_prev:0.81,trading_assets:2127.05,trading_assets_prev:2107.08,debt_invest:0.0,debt_invest_prev:0.0,other_debt:803.5,other_debt_prev:861.9,other_equity:717.45,other_equity_prev:287.81,deriv_assets:30.4,deriv_assets_prev:31.1,deriv_liab:62.12,deriv_liab_prev:43.42,deriv_net:-31.72,deriv_net_prev:-12.32,margin_lending:915.62,margin_lending_prev:639.12,reverse_repo:91.65,reverse_repo_prev:113.6,trading_liab:199.11,trading_liab_prev:104.07,fin_assets_total:3648.0,fin_assets_total_prev:3256.79,revenue:76.96},risk:{risk_coverage:205.55,risk_coverage_prev:221.25,capital_leverage:14.66,capital_leverage_prev:15.81,liquidity_coverage:308.9,liquidity_coverage_prev:406.64,stable_funding:192.44,stable_funding_prev:209.8}},"601881":{name:"中国银河",short:"中国银河",kpi:{revenue:73.55,revenue_prev:63.59,revenue_yoy:15.66,np:33.2,np_prev:30.16,np_yoy:10.08,deducted_np:33.2,deducted_np_prev:30.16,deducted_np_yoy:10.08,eps:0.28,eps_yoy:12.0,roe:2.53,roe_prev:2.44,roe_yoy:0.09,total_assets:9808.99,total_assets_yoy:30.79,net_assets:1561.15,net_assets_yoy:9.77,np_margin:45.14,np_margin_prev:47.43,np_margin_chg:-2.29,cost_ratio:43.62,cost_ratio_prev:44.3,cost_ratio_chg:-0.68},biz:{brokerage:29.64,brokerage_prev:22.25,brokerage_yoy:33.21,brokerage_fee:27.01,brokerage_fee_prev:19.22,brokerage_fee_yoy:40.53,ib:1.06,ib_prev:1.51,ib_yoy:-29.8,am:1.15,am_prev:1.31,am_yoy:-12.21,interest:12.8,interest_prev:9.08,interest_yoy:40.97,invest_income:13.29,invest_ex_assoc:13.11,invest_ex_assoc_prev:27.32,invest_assoc:0.18,invest_assoc_prev:0.01,invest_assoc_yoy:1700.0,fair_value:16.59,fx_income:0.51,investment:30.21,investment_yoy:-4.13,cost:32.08,credit_loss:0.35,other_revenue:0.42,other_revenue_prev:0.25,asset_disposal:0.0,asset_disposal_prev:0.01,other_income:0.29,other_income_prev:0.48,other_fee:0.43,other_fee_prev:0.21,other_performance:0.71,other_performance_prev:0.74,trading_assets:2497.43,trading_assets_prev:2217.61,debt_invest:6.94,debt_invest_prev:6.89,other_debt:1045.04,other_debt_prev:1070.81,other_equity:584.17,other_equity_prev:538.82,deriv_assets:61.29,deriv_assets_prev:27.92,deriv_liab:66.09,deriv_liab_prev:17.52,deriv_net:-4.800000000000004,deriv_net_prev:10.400000000000002,margin_lending:1509.54,margin_lending_prev:1053.74,reverse_repo:230.61,reverse_repo_prev:285.67,trading_liab:719.23,trading_liab_prev:492.21,fin_assets_total:4133.58,fin_assets_total_prev:3834.13,revenue:73.55},risk:{risk_coverage:260.06,risk_coverage_prev:268.61,capital_leverage:14.78,capital_leverage_prev:15.09,liquidity_coverage:341.52,liquidity_coverage_prev:386.12,stable_funding:157.18,stable_funding_prev:163.29}},"600999":{name:"招商证券",short:"招商证券",kpi:{revenue:69.73,revenue_prev:47.13,revenue_yoy:47.95,np:32.71,np_prev:23.08,np_yoy:41.72,deducted_np:32.69,deducted_np_prev:23.08,deducted_np_yoy:41.64,eps:0.36,eps_yoy:44.0,roe:2.54,roe_prev:1.87,roe_yoy:0.67,total_assets:7883.53,total_assets_yoy:19.21,net_assets:1413.19,net_assets_yoy:7.4,np_margin:46.88,np_margin_prev:48.97,np_margin_chg:-2.09,cost_ratio:43.53,cost_ratio_prev:46.38,cost_ratio_chg:-2.85},biz:{brokerage:31.56,brokerage_prev:25.18,brokerage_yoy:25.34,brokerage_fee:25.9,brokerage_fee_prev:19.66,brokerage_fee_yoy:31.74,ib:1.8,ib_prev:1.87,ib_yoy:-3.74,am:1.94,am_prev:2.22,am_yoy:-12.61,interest:7.21,interest_prev:2.08,interest_yoy:246.63,invest_income:21.05,invest_ex_assoc:17.55,invest_ex_assoc_prev:29.4,invest_assoc:3.5,invest_assoc_prev:3.71,invest_assoc_yoy:-5.66,fair_value:10.49,fx_income:-2.22,investment:25.82,investment_yoy:71.33,cost:30.35,credit_loss:0.78,other_revenue:0.5,other_revenue_prev:0.2,asset_disposal:-0.0,asset_disposal_prev:0.0,other_income:1.13,other_income_prev:0.89,other_fee:1.93,other_fee_prev:1.43,other_performance:1.63,other_performance_prev:1.09,trading_assets:2685.05,trading_assets_prev:2698.08,debt_invest:0.87,debt_invest_prev:1.79,other_debt:648.59,other_debt_prev:576.88,other_equity:406.29,other_equity_prev:350.44,deriv_assets:43.88,deriv_assets_prev:17.02,deriv_liab:79.79,deriv_liab_prev:30.16,deriv_net:-35.910000000000004,deriv_net_prev:-13.14,margin_lending:1336.08,margin_lending_prev:1001.31,reverse_repo:271.32,reverse_repo_prev:243.0,trading_liab:602.62,trading_liab_prev:555.77,fin_assets_total:3740.8,fin_assets_total_prev:3627.19,revenue:69.73},risk:{risk_coverage:249.78,risk_coverage_prev:254.7,capital_leverage:12.42,capital_leverage_prev:16.36,liquidity_coverage:161.47,liquidity_coverage_prev:147.73,stable_funding:174.83,stable_funding_prev:169.17}},"002736":{name:"国信证券",short:"国信证券",kpi:{revenue:49.21,revenue_prev:51.55,revenue_yoy:-4.54,np:21.05,np_prev:23.29,np_yoy:-9.62,deducted_np:21.02,deducted_np_prev:23.29,deducted_np_yoy:-9.75,eps:0.18,eps_yoy:-14.29,roe:1.83,roe_prev:2.26,roe_yoy:-0.43,total_assets:5935.01,total_assets_yoy:17.24,net_assets:1402.92,net_assets_yoy:16.69,np_margin:42.71,np_margin_prev:45.18,np_margin_chg:-2.47,cost_ratio:44.36,cost_ratio_prev:42.5,cost_ratio_chg:1.86},biz:{brokerage:31.36,brokerage_prev:22.13,brokerage_yoy:41.71,brokerage_fee:27.45,brokerage_fee_prev:18.61,brokerage_fee_yoy:47.5,ib:1.56,ib_prev:1.14,ib_yoy:36.84,am:1.11,am_prev:1.58,am_yoy:-29.75,interest:6.81,interest_prev:2.99,interest_yoy:127.76,invest_income:14.84,invest_ex_assoc:13.53,invest_ex_assoc_prev:22.08,invest_assoc:1.31,invest_assoc_prev:1.01,invest_assoc_yoy:29.7,fair_value:-4.29,fx_income:-0.05,investment:9.19,investment_yoy:-63.36,cost:21.83,credit_loss:0.17,other_revenue:0.34,other_revenue_prev:0.15,asset_disposal:0.0,asset_disposal_prev:0.0,other_income:0.2,other_income_prev:0.19,other_fee:1.24,other_fee_prev:0.8,other_performance:0.54,other_performance_prev:0.34,trading_assets:1990.42,trading_assets_prev:1993.99,debt_invest:5.77,debt_invest_prev:5.36,other_debt:492.02,other_debt_prev:569.71,other_equity:381.81,other_equity_prev:331.16,deriv_assets:4.76,deriv_assets_prev:2.82,deriv_liab:5.28,deriv_liab_prev:5.9,deriv_net:-0.5200000000000005,deriv_net_prev:-3.0800000000000005,margin_lending:971.06,margin_lending_prev:709.39,reverse_repo:46.1,reverse_repo_prev:18.45,trading_liab:23.71,trading_liab_prev:16.04,fin_assets_total:2870.02,fin_assets_total_prev:2900.22,revenue:49.21},risk:{risk_coverage:398.35,risk_coverage_prev:344.43,capital_leverage:22.5,capital_leverage_prev:23.12,liquidity_coverage:341.84,liquidity_coverage_prev:314.03,stable_funding:196.88,stable_funding_prev:179.44}}};
const ORDER = ["000776", "600030", "600999", "601066", "601211", "601688", "601881", "601995"];
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
