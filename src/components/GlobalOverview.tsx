import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Activity, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  Globe, 
  Database,
  ArrowRight
} from 'lucide-react';
import { Transaction, GatewayVolumePoint } from '../types';
import { initialVolumeData } from '../data/mockData';

interface GlobalOverviewProps {
  transactions: Transaction[];
  onTriggerSimulation: () => void;
  gmvTotal: number;
  netRevenue: number;
}

export default function GlobalOverview({ 
  transactions, 
  onTriggerSimulation, 
  gmvTotal, 
  netRevenue 
}: GlobalOverviewProps) {
  const [selectedGatewayFilter, setSelectedGatewayFilter] = useState<'ALL' | 'DOKU' | 'Durianpay' | 'Inacash'>('ALL');
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);
  
  // Legend visibility toggles for the chart
  const [visibleGateways, setVisibleGateways] = useState({
    DOKU: true,
    Durianpay: true,
    Inacash: true
  });

  // Helper to format currency
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter transaction feed based on Gateway filter
  const filteredFeed = selectedGatewayFilter === 'ALL' 
    ? transactions.slice(0, 7)
    : transactions.filter(t => t.gateway === selectedGatewayFilter).slice(0, 7);

  // SVG dimensions for custom responsive chart
  const chartWidth = 900;
  const chartHeight = 220;
  const paddingX = 60;
  const paddingY = 30;

  // Compute maximum values to scale the SVG chart
  const maxVolume = Math.max(...initialVolumeData.map(d => {
    let sum = 0;
    if (visibleGateways.DOKU) sum += d.DOKU;
    if (visibleGateways.Durianpay) sum += d.Durianpay;
    if (visibleGateways.Inacash) sum += d.Inacash;
    return sum || 1000000000; // prevent division by zero
  }));

  // Create points for SVG path
  const getPoints = (gateway: 'DOKU' | 'Durianpay' | 'Inacash') => {
    if (!visibleGateways[gateway]) return '';
    return initialVolumeData.map((d, index) => {
      const x = paddingX + (index * (chartWidth - paddingX * 2)) / (initialVolumeData.length - 1);
      // Calculate stack or standard
      const value = d[gateway];
      const y = chartHeight - paddingY - (value * (chartHeight - paddingY * 2)) / maxVolume;
      return `${x},${y}`;
    }).join(' ');
  };

  const dokuPoints = getPoints('DOKU');
  const durianPoints = getPoints('Durianpay');
  const inacashPoints = getPoints('Inacash');

  return (
    <div id="global-overview-view" className="p-8 space-y-8 overflow-y-auto h-full bg-slate-50 font-sans text-slate-800">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold font-mono uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Super-Admin Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Global Gateway Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time GMV aggregation, smart-routing distribution, and cross-channel clearing analytics.</p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            id="simulation-trigger-btn"
            onClick={onTriggerSimulation}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98] transition cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Simulate Live Payment</span>
          </button>
        </div>
      </div>

      {/* Top Level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* GMV Card */}
        <div id="kpi-card-gmv" className="bento-card relative overflow-hidden group hover:border-slate-300 transition-all duration-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-110 transition duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider font-mono">Global Aggregated GMV</span>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{formatRupiah(gmvTotal)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% MoM</span>
                </span>
                <span className="text-[11px] text-slate-400">Target Rp 160B</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner relative z-10">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="border-t border-slate-100 mt-5 pt-3 flex justify-between text-xs text-slate-400">
            <span>Aggregated Gateway Fees (MDR)</span>
            <span className="font-semibold text-slate-600">Avg. Rate 1.15%</span>
          </div>
        </div>

        {/* System Net Revenue Card */}
        <div id="kpi-card-revenue" className="bento-card relative overflow-hidden group hover:border-slate-300 transition-all duration-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50/50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-110 transition duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider font-mono">Platform Net Revenue</span>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{formatRupiah(netRevenue)}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+22.1% MoM</span>
                </span>
                <span className="text-[11px] text-slate-400">Take Rate ~ 1.66%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-inner relative z-10">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="border-t border-slate-100 mt-5 pt-3 flex justify-between text-xs text-slate-400">
            <span>Calculated over gross transactions</span>
            <span className="font-semibold text-slate-600">Net margin Rp 2.5B</span>
          </div>
        </div>

        {/* Active Merchants Card */}
        <div id="kpi-card-merchants" className="bento-card relative overflow-hidden group hover:border-slate-300 transition-all duration-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50/50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-110 transition duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider font-mono">Active Client Merchants</span>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">124</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+12 new this month</span>
                </span>
                <span className="text-[11px] text-slate-400">99.9% Retention</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-inner relative z-10">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="border-t border-slate-100 mt-5 pt-3 flex justify-between text-xs text-slate-400">
            <span>Primary White-Label Partner</span>
            <span className="font-semibold text-slate-600">PT Maju Sejahtera</span>
          </div>
        </div>
      </div>

      {/* Gateway Volume Area Chart */}
      <div id="gateway-volume-chart-section" className="bento-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Transaction Volume Across All Gateways</h3>
            <p className="text-xs text-slate-500">Hourly aggregates tracking load balancing and distribution efficiency</p>
          </div>
          
          {/* Chart Legends with Toggle Visibility capability */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="legend-toggle-doku"
              onClick={() => setVisibleGateways(prev => ({ ...prev, DOKU: !prev.DOKU }))}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                visibleGateways.DOKU 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>DOKU</span>
            </button>
            <button
              id="legend-toggle-durianpay"
              onClick={() => setVisibleGateways(prev => ({ ...prev, Durianpay: !prev.Durianpay }))}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                visibleGateways.Durianpay 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Durianpay</span>
            </button>
            <button
              id="legend-toggle-inacash"
              onClick={() => setVisibleGateways(prev => ({ ...prev, Inacash: !prev.Inacash }))}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                visibleGateways.Inacash 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Inacash</span>
            </button>
          </div>
        </div>

        {/* Custom SVG Area Chart */}
        <div className="w-full overflow-x-auto">
          <div className="relative min-w-[800px]" style={{ height: `${chartHeight}px` }}>
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = paddingY + (i * (chartHeight - paddingY * 2)) / 4;
                const valueLabel = formatRupiah(maxVolume - (i * maxVolume) / 4);
                return (
                  <g key={i}>
                    <line 
                      x1={paddingX} 
                      y1={y} 
                      x2={chartWidth - paddingX} 
                      y2={y} 
                      stroke="#f1f5f9" 
                      strokeWidth={1.5} 
                    />
                    <text 
                      x={paddingX - 10} 
                      y={y + 4} 
                      fill="#94a3b8" 
                      fontSize="9" 
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {valueLabel}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Time Labels */}
              {initialVolumeData.map((d, index) => {
                const x = paddingX + (index * (chartWidth - paddingX * 2)) / (initialVolumeData.length - 1);
                return (
                  <g key={index}>
                    <line 
                      x1={x} 
                      y1={paddingY} 
                      x2={x} 
                      y2={chartHeight - paddingY} 
                      stroke="#f8fafc" 
                      strokeWidth={1} 
                    />
                    <text 
                      x={x} 
                      y={chartHeight - paddingY + 16} 
                      fill="#94a3b8" 
                      fontSize="9" 
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {d.time}
                    </text>
                  </g>
                );
              })}

              {/* Chart Paths */}
              {/* DOKU Fill Area */}
              {visibleGateways.DOKU && dokuPoints && (
                <>
                  <path 
                    d={`M ${paddingX},${chartHeight - paddingY} L ${dokuPoints} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`}
                    fill="url(#doku-gradient)"
                    opacity="0.15"
                  />
                  <polyline 
                    fill="none" 
                    stroke="#f43f5e" 
                    strokeWidth="3" 
                    points={dokuPoints} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Durianpay Fill Area */}
              {visibleGateways.Durianpay && durianPoints && (
                <>
                  <path 
                    d={`M ${paddingX},${chartHeight - paddingY} L ${durianPoints} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`}
                    fill="url(#durian-gradient)"
                    opacity="0.15"
                  />
                  <polyline 
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="3" 
                    points={durianPoints} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Inacash Fill Area */}
              {visibleGateways.Inacash && inacashPoints && (
                <>
                  <path 
                    d={`M ${paddingX},${chartHeight - paddingY} L ${inacashPoints} L ${chartWidth - paddingX},${chartHeight - paddingY} Z`}
                    fill="url(#inacash-gradient)"
                    opacity="0.15"
                  />
                  <polyline 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="3" 
                    points={inacashPoints} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Interactive Hover Indicators */}
              {initialVolumeData.map((d, index) => {
                const x = paddingX + (index * (chartWidth - paddingX * 2)) / (initialVolumeData.length - 1);
                return (
                  <rect
                    key={index}
                    x={x - (chartWidth - paddingX * 2) / (initialVolumeData.length * 2)}
                    y={paddingY}
                    width={(chartWidth - paddingX * 2) / (initialVolumeData.length - 1)}
                    height={chartHeight - paddingY * 2}
                    fill="transparent"
                    className="cursor-pointer hover:fill-slate-500/5 transition duration-100"
                    onMouseEnter={() => setHoveredDataIndex(index)}
                    onMouseLeave={() => setHoveredDataIndex(null)}
                  />
                );
              })}

              {/* Gradients definition */}
              <defs>
                <linearGradient id="doku-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="durian-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="inacash-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Custom floating interactive HTML tooltip */}
            {hoveredDataIndex !== null && (
              <div 
                className="absolute bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs z-20 pointer-events-none border border-slate-700 font-sans"
                style={{
                  left: `${paddingX + (hoveredDataIndex * (chartWidth - paddingX * 2)) / (initialVolumeData.length - 1) - 80}px`,
                  top: `10px`,
                  width: '210px'
                }}
              >
                <p className="font-bold text-slate-300 font-mono border-b border-slate-800 pb-1.5 mb-1.5 flex justify-between">
                  <span>Aggregate Time:</span>
                  <span className="text-white">{initialVolumeData[hoveredDataIndex].time}</span>
                </p>
                <div className="space-y-1">
                  {visibleGateways.DOKU && (
                    <div className="flex justify-between">
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> DOKU:
                      </span>
                      <span className="font-mono">{formatRupiah(initialVolumeData[hoveredDataIndex].DOKU)}</span>
                    </div>
                  )}
                  {visibleGateways.Durianpay && (
                    <div className="flex justify-between">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Durian:
                      </span>
                      <span className="font-mono">{formatRupiah(initialVolumeData[hoveredDataIndex].Durianpay)}</span>
                    </div>
                  )}
                  {visibleGateways.Inacash && (
                    <div className="flex justify-between">
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Inacash:
                      </span>
                      <span className="font-mono">{formatRupiah(initialVolumeData[hoveredDataIndex].Inacash)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Inbound Feed section */}
      <div id="live-inbound-feed-section" className="bento-card overflow-hidden p-0 bg-white">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="text-lg font-bold text-slate-900">Live Consolidated Inbound Feed</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Cross-merchant aggregated queue displaying exact clearing and processing channel</p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-2">Filter Feed:</span>
            {['ALL', 'DOKU', 'Durianpay', 'Inacash'].map((gateway) => (
              <button
                id={`filter-feed-gateway-${gateway}`}
                key={gateway}
                onClick={() => setSelectedGatewayFilter(gateway as any)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  selectedGatewayFilter === gateway
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-500 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {gateway}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 font-mono">
              <tr>
                <th className="py-3 px-6">Transaction ID</th>
                <th className="py-3 px-6">Merchant Client</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Method / Channel</th>
                <th className="py-3 px-6">Gross Amount</th>
                <th className="py-3 px-6">Gateway Outlet</th>
                <th className="py-3 px-6">Settlement Status</th>
                <th className="py-3 px-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFeed.map((trx, idx) => {
                const isNew = idx === 0 && trx.id.includes("SIM-");
                return (
                  <tr 
                    id={`feed-row-${trx.id}`}
                    key={trx.id} 
                    className={`hover:bg-slate-50/80 transition duration-150 ${isNew ? 'bg-indigo-50/30 animate-pulse' : ''}`}
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-normal">#</span>
                        <span>{trx.id}</span>
                        {isNew && (
                          <span className="px-1.5 py-0.2 bg-indigo-500 text-white text-[8px] font-bold uppercase rounded">New</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Merchant */}
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {trx.merchantName}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {trx.customerName}
                    </td>

                    {/* Method */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-800">{trx.method}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{trx.channel}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatRupiah(trx.amount)}
                    </td>

                    {/* Gateway */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                        trx.gateway === 'DOKU' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                          : trx.gateway === 'Durianpay'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          trx.gateway === 'DOKU' 
                            ? 'bg-rose-500' 
                            : trx.gateway === 'Durianpay'
                            ? 'bg-indigo-500'
                            : 'bg-amber-500'
                        }`} />
                        <span>{trx.gateway}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        trx.status === 'SUCCESS' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : trx.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        <span>{trx.status}</span>
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                      {new Date(trx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
              
              {filteredFeed.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No records found for gateway {selectedGatewayFilter}. Try triggering a simulated transaction!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
