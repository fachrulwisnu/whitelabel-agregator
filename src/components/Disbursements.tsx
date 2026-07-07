import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { 
  ArrowUpRight, 
  UploadCloud, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  HelpCircle, 
  Send, 
  Check, 
  RefreshCw,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { Disbursement } from '../types';

interface DisbursementsProps {
  disbursements: Disbursement[];
  setDisbursements: Dispatch<SetStateAction<Disbursement[]>>;
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
}

export default function Disbursements({ 
  disbursements, 
  setDisbursements, 
  balance, 
  setBalance 
}: DisbursementsProps) {
  // Single Payout Form States
  const [beneficiary, setBeneficiary] = useState('');
  const [bank, setBank] = useState('Bank Central Asia (BCA)');
  const [accountNumber, setAccountNumber] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [makerName, setMakerName] = useState('Super Admin (Proxy Maker)');

  // Simulation states
  const [isCsvUploading, setIsCsvUploading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
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

  // Filter lists
  const awaitingApproval = disbursements.filter(d => d.status === 'AWAITING APPROVAL');
  const processedOrRejected = disbursements.filter(d => d.status === 'PROCESSED' || d.status === 'REJECTED');

  // Approve action
  const handleApprove = (id: string, amount: number) => {
    if (balance < amount) {
      triggerToast(`Friction: Insufficient available funds to disburse ${formatRupiah(amount)}!`);
      return;
    }

    setBalance(prev => prev - amount);
    setDisbursements(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status: 'PROCESSED', 
          processedAt: new Date().toISOString() 
        };
      }
      return item;
    }));
    triggerToast(`Disbursement ${id} approved & dispatched over RTGS network!`);
  };

  // Reject action
  const handleReject = (id: string) => {
    setDisbursements(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status: 'REJECTED', 
          processedAt: new Date().toISOString() 
        };
      }
      return item;
    }));
    triggerToast(`Disbursement ${id} rejected by checker. Balance preserved.`);
  };

  // Single disbursement submit
  const handleSinglePayoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amountVal = Number(amountInput);
    if (!beneficiary || !accountNumber || !amountVal || amountVal <= 0) {
      triggerToast("Friction: Please fill in all fields with valid values.");
      return;
    }

    const newPayoutId = `DISB-202607-0${disbursements.length + 1}`;
    const newRecord: Disbursement = {
      id: newPayoutId,
      beneficiary,
      bank,
      accountNumber,
      amount: amountVal,
      maker: `${makerName} (Staff Maker)`,
      status: 'AWAITING APPROVAL',
      createdAt: new Date().toISOString()
    };

    setDisbursements(prev => [newRecord, ...prev]);
    
    // Reset form
    setBeneficiary('');
    setAccountNumber('');
    setAmountInput('');
    
    triggerToast(`Payout ${newPayoutId} queued! Maker-Checker status: Pending Admin authorization.`);
  };

  // CSV file uploader simulation
  const handleCsvSimulation = () => {
    setIsCsvUploading(true);
    setTimeout(() => {
      setIsCsvUploading(false);
      
      const newBatchItems: Disbursement[] = [
        {
          id: `DISB-BATCH-A1`,
          beneficiary: "PT Semesta Logistik",
          bank: "Bank Mandiri",
          accountNumber: "1320091823102",
          amount: 55000000,
          maker: "Automated CSV Parser",
          status: 'AWAITING APPROVAL',
          createdAt: new Date().toISOString()
        },
        {
          id: `DISB-BATCH-A2`,
          beneficiary: "CV Agung Kertas",
          bank: "Bank Central Asia (BCA)",
          accountNumber: "220192837301",
          amount: 14500000,
          maker: "Automated CSV Parser",
          status: 'AWAITING APPROVAL',
          createdAt: new Date().toISOString()
        },
        {
          id: `DISB-BATCH-A3`,
          beneficiary: "Karyawan Gaji Ke-13 (Group)",
          bank: "Bank Negara Indonesia (BNI)",
          accountNumber: "9901827301",
          amount: 184500000,
          maker: "Automated CSV Parser",
          status: 'AWAITING APPROVAL',
          createdAt: new Date().toISOString()
        }
      ];

      setDisbursements(prev => [...newBatchItems, ...prev]);
      triggerToast("CSV Parsed! 3 new supplier payout records added to Awaiting Approval queue.");
    }, 1200);
  };

  return (
    <div id="merchant-disbursements-view" className="p-8 space-y-8 overflow-y-auto h-full bg-slate-50 font-sans text-slate-800">
      
      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 z-50 animate-slide-in">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold">{successToast}</p>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold font-mono uppercase tracking-wider">
            <ArrowUpRight className="w-4 h-4" />
            <span>Merchant Space: PT Maju Sejahtera</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Disbursements Desk</h1>
          <p className="text-slate-500 text-sm mt-0.5">Dual-authorization Maker-Checker clearing house for corporate vendor settlements, cash withdrawals, and payroll releases.</p>
        </div>

        {/* Dynamic Balance Card */}
        <div id="disbursable-balance-card" className="bg-slate-900 text-white p-4 px-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden flex items-center gap-4 shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full translate-x-8 -translate-y-8" />
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">NET DISBURSABLE BALANCE</p>
            <h3 className="text-xl font-black text-white tracking-tight mt-0.5">{formatRupiah(balance)}</h3>
          </div>
        </div>
      </div>

      {/* Grid: Section A Action Dashboard vs Section B Approval Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Section A: Single payout form + CSV Batch upload (1 Col) */}
        <div className="space-y-6 xl:col-span-1">
          
          {/* Action A.1: Single payout entry */}
          <div id="single-payout-panel" className="bento-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Single Transfer Entry</h3>
            </div>

            <form onSubmit={handleSinglePayoutSubmit} className="space-y-4 text-xs font-medium text-slate-600">
              
              {/* Beneficiary */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Beneficiary Name</label>
                <input
                  id="payout-form-beneficiary"
                  type="text"
                  placeholder="e.g. PT Sinar Agung Logistik"
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none bg-slate-50/50"
                  required
                />
              </div>

              {/* Bank Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Receiving Bank</label>
                <select
                  id="payout-form-bank"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 bg-white"
                >
                  <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
                  <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                  <option value="Bank Permata">Bank Permata</option>
                  <option value="Danamon">Bank Danamon</option>
                </select>
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Bank Account Number</label>
                <input
                  id="payout-form-account"
                  type="text"
                  placeholder="e.g. 8820918230"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none bg-slate-50/50"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Amount (IDR)</label>
                <input
                  id="payout-form-amount"
                  type="number"
                  placeholder="e.g. 15000000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-indigo-500 outline-none bg-slate-50/50"
                  required
                />
              </div>

              {/* Maker Name hidden default */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Initiating Officer (Maker)</label>
                <input
                  id="payout-form-maker"
                  type="text"
                  value={makerName}
                  onChange={(e) => setMakerName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none bg-slate-100 text-slate-500"
                  readOnly
                />
              </div>

              {/* Submit Button */}
              <button
                id="submit-payout-btn"
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/10 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Checker Queue</span>
              </button>
            </form>
          </div>

          {/* Action A.2: Batch Upload Simulation */}
          <div id="batch-upload-panel" className="bento-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Upload Bulk CSV Ledger</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Initiate dozens of simultaneous supplier transfers via bulk excel. Once parsed, rows appear instantly in the dual-authorization queue below.
            </p>

            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-6 text-center space-y-3 cursor-pointer transition bg-slate-50/50" onClick={handleCsvSimulation}>
              {isCsvUploading ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-600">Evaluating Rows & Verifying Hash...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Drop your vendor ledger CSV here</span>
                  <span className="text-[10px] text-slate-400">or click to choose file from storage</span>
                  <span className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[10px] font-semibold text-slate-600 rounded-lg border border-slate-200 shadow-sm mt-3 inline-block">
                    Simulate Upload File
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Section B: Dual-auth Queue Tables (2 Cols) */}
        <div className="space-y-6 xl:col-span-2">
          
          {/* Part B.1: Awaiting approval checker card */}
          <div id="awaiting-authorization-desk" className="bento-card overflow-hidden p-0 bg-white">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  {awaitingApproval.length}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-500" />
                    <span>Awaiting Admin Authorization (Checker Queue)</span>
                  </h3>
                  <p className="text-xs text-slate-500">Dual-control system: review transfers proposed by Maker personnel before dispatching funds</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 font-mono">
                  <tr>
                    <th className="py-3 px-6">Payout Reference</th>
                    <th className="py-3 px-6">Beneficiary & Account</th>
                    <th className="py-3 px-6 text-right">Transfer Sum</th>
                    <th className="py-3 px-6">Proposed Maker</th>
                    <th className="py-3 px-6 text-center">Checker Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {awaitingApproval.map((item) => (
                    <tr id={`awaiting-row-${item.id}`} key={item.id} className="hover:bg-slate-50/80 transition duration-150">
                      
                      {/* ID */}
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900">
                        {item.id}
                      </td>

                      {/* Beneficiary */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{item.beneficiary}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{item.bank} • {item.accountNumber}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right font-black text-slate-900">
                        {formatRupiah(item.amount)}
                      </td>

                      {/* Maker staff */}
                      <td className="py-4 px-6 text-slate-500 font-medium text-xs">
                        {item.maker}
                      </td>

                      {/* Interactive dual-action */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            id={`approve-payout-${item.id}`}
                            onClick={() => handleApprove(item.id, item.amount)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            id={`reject-payout-${item.id}`}
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1 bg-white hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {awaitingApproval.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        Approval queue empty. Fill the Form or Upload CSV above to generate disbursement actions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part B.2: Processed history ledger */}
          <div id="processed-disbursement-history" className="bento-card overflow-hidden p-0 bg-white">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Processed Ledger History (Completed)</h3>
              <p className="text-xs text-slate-500">Fully settled and verified transactions on public banking networks (BI-FAST / RTGS)</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 font-mono">
                  <tr>
                    <th className="py-3 px-6">Payout Reference</th>
                    <th className="py-3 px-6">Beneficiary</th>
                    <th className="py-3 px-6 text-right">Settled Sum</th>
                    <th className="py-3 px-6">Maker Person</th>
                    <th className="py-3 px-6">Settlement status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedOrRejected.map((item) => (
                    <tr id={`completed-row-${item.id}`} key={item.id} className="hover:bg-slate-50/80 transition duration-150">
                      
                      {/* ID */}
                      <td className="py-3.5 px-6 font-mono text-xs font-semibold text-slate-500">
                        {item.id}
                      </td>

                      {/* Beneficiary */}
                      <td className="py-3.5 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{item.beneficiary}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{item.bank} • {item.accountNumber}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                        {formatRupiah(item.amount)}
                      </td>

                      {/* Maker */}
                      <td className="py-3.5 px-6 text-slate-500 text-xs">
                        {item.maker}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.status === 'PROCESSED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'PROCESSED' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          <span>{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
