import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  X, 
  ShieldCheck, 
  Sliders, 
  ArrowRight, 
  Play, 
  RefreshCw,
  Eye
} from 'lucide-react';
import { RoutingRule, RoutingAuditTrail } from '../types';

interface SmartRoutingProps {
  rules: RoutingRule[];
  setRules: Dispatch<SetStateAction<RoutingRule[]>>;
  auditTrails: RoutingAuditTrail[];
  setAuditTrails: Dispatch<SetStateAction<RoutingAuditTrail[]>>;
}

export default function SmartRouting({ 
  rules, 
  setRules, 
  auditTrails, 
  setAuditTrails 
}: SmartRoutingProps) {
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [merchant, setMerchant] = useState('PT Maju Sejahtera');
  const [routeTo, setRouteTo] = useState<'DOKU' | 'Durianpay' | 'Inacash'>('Durianpay');
  const [priority, setPriority] = useState(1);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Helper to trigger transient toasts
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Toggle active rule
  const handleToggleActive = (id: string) => {
    setRules(prev => prev.map(rule => {
      if (rule.id === id) {
        const nextState = !rule.isActive;
        triggerToast(`Rule ${rule.id} has been ${nextState ? 'activated' : 'paused'} successfully!`);
        return { ...rule, isActive: nextState };
      }
      return rule;
    }));
  };

  // Delete rule
  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
    triggerToast(`Rule ${id} has been removed from the routing stack.`);
  };

  // Add rule
  const handleCreateRule = (e: FormEvent) => {
    e.preventDefault();
    const newRuleId = `RULE-0${rules.length + 1}`;
    const newRule: RoutingRule = {
      id: newRuleId,
      paymentMethod,
      merchant,
      routeTo,
      isActive: true,
      priority: Number(priority)
    };

    setRules(prev => [newRule, ...prev]);
    setIsModalOpen(false);
    triggerToast(`Rule ${newRuleId} registered successfully! Now analyzing active streams.`);

    // Simulate appending a routing audit trail event
    const newAudit: RoutingAuditTrail = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      transactionId: `TX-20260707-${Math.floor(1110 + Math.random() * 900)}`,
      merchant: merchant === 'All Merchants' ? 'PT Maju Sejahtera' : merchant,
      paymentMethod,
      originalAmount: Math.floor(150000 + Math.random() * 50000000),
      routedTo: routeTo,
      ruleTriggered: `IF Payment Method = ${paymentMethod}${merchant !== 'All Merchants' ? ` AND Merchant = ${merchant}` : ''}, THEN Route To = ${routeTo}`,
    };

    setAuditTrails(prev => [newAudit, ...prev]);
  };

  // Format currency helper
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div id="smart-routing-view" className="p-8 space-y-8 overflow-y-auto h-full bg-slate-50 font-sans text-slate-800">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 z-50 animate-slide-in">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold">{successToast}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold font-mono uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>Intelligent Traffic Controller</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Smart Routing Configurations</h1>
          <p className="text-slate-500 text-sm mt-0.5">Define conditional traffic splitters based on merchant profiles, payment channels, and gateway service levels.</p>
        </div>

        <div>
          <button
            id="create-new-rule-btn"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Routing Rule</span>
          </button>
        </div>
      </div>

      {/* Visual If/Then Rule Builder Canvas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Active Routing Logic Pipeline</h3>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {rules.filter(r => r.isActive).length} / {rules.length} Rules Active
          </span>
        </div>

        {/* List of rules */}
        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule, idx) => (
            <div 
              id={`rule-card-${rule.id}`}
              key={rule.id}
              className={`bento-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-200 relative ${
                rule.isActive 
                  ? 'border-indigo-100 hover:border-indigo-200' 
                  : 'border-slate-200 bg-slate-50/50 opacity-70'
              }`}
            >
              {/* Left Side: Logic Block */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                {/* Priority Pin */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex flex-col items-center justify-center border border-slate-200 text-slate-500 font-mono text-xs font-bold shadow-sm">
                    <span className="text-[9px] text-slate-400 font-normal">PRIO</span>
                    <span>{rule.priority}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 font-mono">{rule.id}</span>
                  </div>
                </div>

                {/* If Statement block */}
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {/* IF */}
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold font-mono text-xs uppercase border border-slate-200/60">
                    IF
                  </span>
                  
                  {/* Property */}
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                    Payment Method = {rule.paymentMethod}
                  </span>

                  {/* AND */}
                  {rule.merchant !== 'All Merchants' && (
                    <>
                      <span className="px-2 py-0.5 text-slate-400 font-bold font-mono text-[10px] uppercase">
                        AND
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                        Merchant = {rule.merchant}
                      </span>
                    </>
                  )}

                  {/* THEN */}
                  <ArrowRight className="w-4 h-4 text-slate-400 mx-1 shrink-0" />
                  
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold font-mono text-xs uppercase border border-emerald-100 shrink-0">
                    THEN ROUTE TO
                  </span>

                  {/* Destination Gateway Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold uppercase shrink-0 ${
                    rule.routeTo === 'DOKU'
                      ? 'bg-rose-50 text-rose-700 border border-rose-100'
                      : rule.routeTo === 'Durianpay'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      rule.routeTo === 'DOKU' ? 'bg-rose-500' : rule.routeTo === 'Durianpay' ? 'bg-indigo-500' : 'bg-amber-500'
                    }`} />
                    <span>{rule.routeTo}</span>
                  </span>
                </div>
              </div>

              {/* Right Side: Quick Controls */}
              <div className="flex items-center gap-4 shrink-0 justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                {/* Active Toggle Button */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${rule.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {rule.isActive ? 'Active Pipeline' : 'Paused Stack'}
                  </span>
                  <button
                    id={`toggle-rule-status-${rule.id}`}
                    onClick={() => handleToggleActive(rule.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="w-px h-5 bg-slate-100 hidden sm:block" />

                {/* Delete button */}
                <button
                  id={`delete-rule-${rule.id}`}
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Delete Routing Rule"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routing Audit Trail Logs */}
      <div id="routing-audit-trail-section" className="bento-card overflow-hidden p-0 bg-white">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Routing Decision Audit Trail</h3>
            <p className="text-xs text-slate-500 mt-1">Verifiable telemetry trail detailing which transaction triggered which routing evaluation</p>
          </div>
          <button
            id="refresh-audit-trail-btn"
            onClick={() => {
              // Add a simulated live audit trigger
              const mockAudit: RoutingAuditTrail = {
                id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
                timestamp: new Date().toISOString(),
                transactionId: `TX-20260707-${Math.floor(1050 + Math.random() * 90)}`,
                merchant: "PT Maju Sejahtera",
                paymentMethod: "QRIS",
                originalAmount: Math.floor(10000 + Math.random() * 1500000),
                routedTo: "Durianpay",
                ruleTriggered: "IF Payment Method = QRIS AND Merchant = PT Maju Sejahtera, THEN Route To = Durianpay",
              };
              setAuditTrails(prev => [mockAudit, ...prev]);
              triggerToast("Fresh routing audit snapshot synchronized.");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Audits</span>
          </button>
        </div>

        {/* Audit Trail Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 font-mono">
              <tr>
                <th className="py-3 px-6">Audit ID</th>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Inbound TRX Reference</th>
                <th className="py-3 px-6">Merchant Profile</th>
                <th className="py-3 px-6">Amount / Channel</th>
                <th className="py-3 px-6">Routing Action</th>
                <th className="py-3 px-6">Triggered Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {auditTrails.map((trail) => (
                <tr id={`audit-row-${trail.id}`} key={trail.id} className="hover:bg-slate-50/80 transition duration-150">
                  <td className="py-3.5 px-6 font-mono text-xs font-semibold text-slate-900">
                    {trail.id}
                  </td>
                  <td className="py-3.5 px-6 text-slate-400 font-mono text-xs">
                    {new Date(trail.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-xs text-indigo-600 font-bold">
                    {trail.transactionId}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 font-medium">
                    {trail.merchant}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-xs">{formatRupiah(trail.originalAmount)}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{trail.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                      trail.routedTo === 'DOKU'
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : trail.routedTo === 'Durianpay'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      <span>Routed to {trail.routedTo}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-slate-500 font-medium max-w-[280px] truncate" title={trail.ruleTriggered}>
                    {trail.ruleTriggered}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal / Side-Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left border-l border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Define Gateway Logic</h3>
              </div>
              <button 
                id="close-modal-btn"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateRule} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">1. IF PAYMENT METHOD IS:</label>
                <select
                  id="rule-form-payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                >
                  <option value="QRIS">QRIS</option>
                  <option value="Virtual Account">Virtual Account</option>
                  <option value="E-Wallet">E-Wallet</option>
                </select>
              </div>

              {/* Merchant Scope Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">2. AND MERCHANT CLIENT IS:</label>
                <select
                  id="rule-form-merchant"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                >
                  <option value="All Merchants">All Merchants (Global Default)</option>
                  <option value="PT Maju Sejahtera">PT Maju Sejahtera</option>
                  <option value="CV Indo Kreasi">CV Indo Kreasi</option>
                  <option value="Kopi Nusantara Abadi">Kopi Nusantara Abadi</option>
                  <option value="Global Tech Solutions">Global Tech Solutions</option>
                </select>
              </div>

              {/* Destination Gateway Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">3. THEN ROUTE ALL TRAFFIC TO:</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['DOKU', 'Durianpay', 'Inacash'] as const).map((gateway) => (
                    <button
                      id={`modal-select-gateway-${gateway}`}
                      key={gateway}
                      type="button"
                      onClick={() => setRouteTo(gateway)}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        routeTo === gateway
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        gateway === 'DOKU' ? 'bg-rose-500' : gateway === 'Durianpay' ? 'bg-indigo-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-xs uppercase font-mono tracking-wider">{gateway}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rule Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">4. EVALUATION PRIORITY SCORE:</label>
                <input
                  id="rule-form-priority"
                  type="number"
                  min="1"
                  max="10"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
                <p className="text-[11px] text-slate-400">Lower scores indicate earlier execution in the evaluation waterfall block.</p>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100 text-[11px] text-amber-800 leading-relaxed">
                <strong>Attention:</strong> Creating this rule will immediately redirect matching production web hooks and payments. Ensure routing endpoints on the corresponding gateway are fully provisioned.
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  id="cancel-create-rule-btn"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-create-rule-btn"
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-600/10 transition cursor-pointer"
                >
                  Save Active Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
