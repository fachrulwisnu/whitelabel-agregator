import { useState } from 'react';
import { 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  X, 
  Receipt, 
  RefreshCw, 
  FileText, 
  Check, 
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Transaction } from '../types';

interface PayInLedgerProps {
  transactions: Transaction[];
}

export default function PayInLedger({ transactions }: PayInLedgerProps) {
  // Advanced Filter states
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Date filter helper
  const [dateRangeFilter, setDateRangeFilter] = useState<'ALL' | 'TODAY' | 'YESTERDAY'>('ALL');

  // Selected Transaction for Flyout Drawer details
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper currency formatter
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    // 1. Status Filter
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    
    // 2. Channel Filter
    if (channelFilter !== 'ALL' && t.method !== channelFilter) return false;

    // 3. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchCustomer = t.customerName.toLowerCase().includes(q);
      const matchMerchant = t.merchantName.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchMerchant) return false;
    }

    // 4. Date filter
    if (dateRangeFilter !== 'ALL') {
      const todayString = "2026-07-07";
      const yesterdayString = "2026-07-06";
      const trxDateString = t.date.substring(0, 10);
      if (dateRangeFilter === 'TODAY' && trxDateString !== todayString) return false;
      if (dateRangeFilter === 'YESTERDAY' && trxDateString !== yesterdayString) return false;
    }

    return true;
  });

  return (
    <div id="merchant-payin-ledger-view" className="p-8 space-y-8 overflow-y-auto h-full bg-slate-50 font-sans text-slate-800">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 z-50 animate-slide-in">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold font-mono uppercase tracking-wider">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Merchant Space: PT Maju Sejahtera</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Inbound Pay-In Ledger</h1>
          <p className="text-slate-500 text-sm mt-0.5">Comprehensive audit ledger of incoming customer settlements, merchant discount rate (MDR) deductions, and net account releases.</p>
        </div>

        {/* Header Action */}
        <button
          id="export-ledger-csv-btn"
          onClick={() => triggerToast("Ledger exported! Excel spreadsheet has been scheduled for download.")}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 bg-white text-slate-700 text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Advanced Filters Panel */}
      <div className="bento-card space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span>Search & Advanced Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
            <input
              id="ledger-search-input"
              type="text"
              placeholder="Search Customer name / TRX ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition bg-slate-50/50"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400 font-mono">STATUS:</label>
            <select
              id="ledger-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          {/* Payment Channel Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400 font-mono">CHANNEL:</label>
            <select
              id="ledger-channel-filter"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="flex-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 bg-white"
            >
              <option value="ALL">All Channels</option>
              <option value="Virtual Account">Virtual Account</option>
              <option value="QRIS">QRIS</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          {/* Quick Date Filters */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400 font-mono">DATE:</label>
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {(['ALL', 'TODAY', 'YESTERDAY'] as const).map((d) => (
                <button
                  id={`ledger-date-filter-${d}`}
                  key={d}
                  onClick={() => setDateRangeFilter(d)}
                  className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition cursor-pointer ${
                    dateRangeFilter === d
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Filter Stats badge */}
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Displaying <strong>{filteredTransactions.length}</strong> matching settlements out of {transactions.length} total</span>
          <button
            id="clear-ledger-filters-btn"
            onClick={() => {
              setStatusFilter('ALL');
              setChannelFilter('ALL');
              setDateRangeFilter('ALL');
              setSearchQuery('');
            }}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div id="payin-ledger-table-wrapper" className="bento-card overflow-hidden p-0 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 font-mono">
              <tr>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6 text-right">Gross Amount</th>
                <th className="py-4 px-6 text-right">MDR Rate / Deduction</th>
                <th className="py-4 px-6 text-right">Net Released</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((trx) => (
                <tr 
                  id={`ledger-row-${trx.id}`}
                  key={trx.id} 
                  onClick={() => setSelectedTrx(trx)}
                  className="hover:bg-indigo-50/20 active:bg-indigo-50/40 transition duration-150 cursor-pointer group"
                >
                  
                  {/* Date */}
                  <td className="py-4 px-6 text-slate-500 font-medium">
                    <div className="flex flex-col">
                      <span className="text-slate-800 text-xs font-semibold">
                        {new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {new Date(trx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                    {trx.id}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-6 font-semibold text-slate-700">
                    {trx.customerName}
                  </td>

                  {/* Method */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{trx.method}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{trx.channel}</span>
                    </div>
                  </td>

                  {/* Gross Amount */}
                  <td className="py-4 px-6 text-right font-bold text-slate-900">
                    {formatRupiah(trx.amount)}
                  </td>

                  {/* MDR Deduction */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-slate-900 font-semibold">{formatRupiah(trx.mdrDeduction)}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ({trx.method === 'QRIS' ? '0.7%' : '1.5%'})
                      </span>
                    </div>
                  </td>

                  {/* Net Amount */}
                  <td className="py-4 px-6 text-right font-extrabold text-indigo-700 bg-indigo-50/10">
                    {formatRupiah(trx.netAmount)}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      trx.status === 'SUCCESS' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : trx.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        trx.status === 'SUCCESS' ? 'bg-emerald-500' : trx.status === 'PENDING' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span>{trx.status}</span>
                    </span>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-medium">
                    No matching transactions found with the active search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Slide-Over Detail Drawer */}
      {selectedTrx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-left border-l border-slate-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Settlement Receipt</h3>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">TELEMETRY ID: {selectedTrx.id}</span>
                </div>
              </div>
              <button 
                id="close-trx-details-btn"
                onClick={() => setSelectedTrx(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Massive Amount Badge */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full translate-x-8 -translate-y-8" />
                <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Consolidated Net Settlement</p>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  {selectedTrx.status === 'SUCCESS' ? formatRupiah(selectedTrx.netAmount) : 'Rp 0 (Unreleased)'}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedTrx.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    <span>{selectedTrx.status}</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-mono">Gateway: {selectedTrx.gateway}</span>
                </div>
              </div>

              {/* Inbound Details Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-2">A. Core Metadata</h4>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs text-slate-500">
                  <div>
                    <p className="text-slate-400 font-medium">Customer Benefactor</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{selectedTrx.customerName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Clearing Channel</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{selectedTrx.channel}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Settlement Timestamp</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{new Date(selectedTrx.date).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Client Merchant</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{selectedTrx.merchantName}</p>
                  </div>
                </div>
              </div>

              {/* Settlement Mathematical Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-2">B. Cost Allocation Splitter</h4>
                
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 font-medium text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Inbound Gross Amount (A)</span>
                    <span className="font-bold text-slate-900">{formatRupiah(selectedTrx.amount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>MDR Gateway Deduction ({selectedTrx.method === 'QRIS' ? '0.7%' : '1.5%'}) (B)</span>
                    <span className="text-rose-600 font-semibold">- {formatRupiah(selectedTrx.mdrDeduction)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Apex Platform Take Rate (Promo)</span>
                    <span className="text-emerald-600 font-semibold">Rp 0 (Waived)</span>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="flex justify-between text-sm text-slate-900 font-bold">
                    <span>Net Disbursable Balance (A - B)</span>
                    <span className="text-indigo-600">{formatRupiah(selectedTrx.netAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Settlement Telemetry Metrics */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-2">C. Node Security & Routing</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Clearing Cycle: <strong>Instant (Real-time settlement)</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-500">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Aggregated Route Rule: <strong>Automatic load balancing</strong></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-2">
              <button
                id="resend-webhook-trx-btn"
                onClick={() => triggerToast(`Webhook event for ${selectedTrx.id} dispatched successfully to webhook listener.`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Webhook Event Payload</span>
              </button>
              <button
                id="refund-trigger-btn"
                onClick={() => triggerToast(`Refund authorization code generated for customer ${selectedTrx.customerName}.`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Initiate Customer Refund Flow</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
