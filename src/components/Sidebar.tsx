import { 
  LayoutDashboard, 
  GitBranch, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Terminal, 
  Layers, 
  Sparkles,
  User,
  ShieldCheck,
  Building2,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  persona: 'superadmin' | 'merchant';
  setPersona: (persona: 'superadmin' | 'merchant') => void;
}

export default function Sidebar({ currentView, setCurrentView, persona, setPersona }: SidebarProps) {
  const adminMenuItems = [
    {
      id: 'superadmin_dashboard',
      label: 'Global Overview',
      icon: LayoutDashboard,
      desc: 'Overall GMV & multi-gateway feed'
    },
    {
      id: 'smart_routing',
      label: 'Smart Routing Rules',
      icon: GitBranch,
      desc: 'If/Then gateway controllers'
    }
  ];

  const merchantMenuItems = [
    {
      id: 'merchant_ledger',
      label: 'Merchant: Pay-In Ledger',
      icon: ArrowDownLeft,
      desc: 'Inbound billing & VA/QRIS reconciliation'
    },
    {
      id: 'merchant_disbursement',
      label: 'Merchant: Disbursements',
      icon: ArrowUpRight,
      desc: 'Maker-checker batch payouts'
    }
  ];

  const developerMenuItems = [
    {
      id: 'developer_logs',
      label: 'Developer & Webhook Logs',
      icon: Terminal,
      desc: 'Kafka broker queue & DLQ payloads'
    }
  ];

  const handleMenuClick = (id: string, viewPersona: 'superadmin' | 'merchant') => {
    setCurrentView(id);
    setPersona(viewPersona);
  };

  return (
    <aside id="sidebar-navigation" className="w-80 bg-white text-slate-600 flex flex-col border-r border-slate-200 h-screen shrink-0 font-sans">
      {/* Header / Brand */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              APEX NEXUS
            </span>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">PAYMENT AGGREGATOR</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
          v2.4
        </span>
      </div>

      {/* Role / Persona Banner */}
      <div className="mx-4 mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {persona === 'superadmin' ? (
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
          ) : (
            <Building2 className="w-4.5 h-4.5 text-indigo-600" />
          )}
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Current Context</p>
            <p className="text-xs font-semibold text-slate-800">
              {persona === 'superadmin' ? 'Super Administrator' : 'PT Maju Sejahtera'}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button 
            id="toggle-persona-btn"
            onClick={() => {
              const nextPersona = persona === 'superadmin' ? 'merchant' : 'superadmin';
              setPersona(nextPersona);
              setCurrentView(nextPersona === 'superadmin' ? 'superadmin_dashboard' : 'merchant_ledger');
            }}
            className="px-2 py-1 text-[10px] bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-md border border-slate-200 shadow-sm transition cursor-pointer"
          >
            Switch
          </button>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {/* Super Admin Control Plane */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <span>SUPER ADMIN CONTROL PLANE</span>
          </div>
          <div className="space-y-1">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  id={`sidebar-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleMenuClick(item.id, 'superadmin')}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 border border-slate-200/40' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>{item.label}</p>
                    <p className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* White-Label Merchant Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <span>MERCHANT OPERATIONS</span>
          </div>
          <div className="space-y-1">
            {merchantMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  id={`sidebar-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleMenuClick(item.id, 'merchant')}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 border border-slate-200/40' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>{item.label}</p>
                    <p className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Monitoring & Logs */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <span>ENGINEERING COCKPIT</span>
          </div>
          <div className="space-y-1">
            {developerMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  id={`sidebar-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleMenuClick(item.id, 'superadmin')}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 border border-slate-200/40' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>{item.label}</p>
                    <p className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-600">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-700 font-semibold uppercase">ALL SYSTEM CHANNELS OK</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Uptime: 99.98% • UTC: 2026-07-07
        </p>
      </div>
    </aside>
  );
}
