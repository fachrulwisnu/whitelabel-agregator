import { useState, Dispatch, SetStateAction } from 'react';
import { 
  Terminal, 
  RefreshCw, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Database, 
  Play, 
  Check, 
  Code, 
  X, 
  Layers, 
  ArrowRight,
  Server,
  Network
} from 'lucide-react';
import { WebhookLog } from '../types';

interface DeveloperLogsProps {
  logs: WebhookLog[];
  setLogs: Dispatch<SetStateAction<WebhookLog[]>>;
}

export default function DeveloperLogs({ logs, setLogs }: DeveloperLogsProps) {
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // System Stats
  const kafkaQueueSize = logs.filter(l => l.status === 'FAILED' || l.status === 'RETRIES_EXHAUSTED').length;
  const deliveryRate = 99.92;

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Re-dispatch / Retry Webhook logic
  const handleRetryWebhook = (id: string) => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setLogs(prev => prev.map(log => {
        if (log.id === id) {
          triggerToast(`Webhook ${id} successfully re-routed and acknowledged! Status changed to DELIVERED (HTTP 200).`);
          return {
            ...log,
            status: 'DELIVERED',
            statusCode: 200,
            retryCount: log.retryCount + 1,
            payload: {
              ...log.payload,
              status: "success",
              resend_telemetry: {
                re_routed_at: new Date().toISOString(),
                response_status: "HTTP 200 OK"
              }
            }
          };
        }
        return log;
      }));
      // Close the detail view or refresh the selected view if open
      setSelectedLog(null);
    }, 1100);
  };

  return (
    <div id="developer-logs-view" className="p-8 space-y-8 overflow-y-auto h-full bg-slate-950 font-sans text-slate-100">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 bg-white text-slate-900 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-200 z-50 animate-slide-in">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold">{successToast}</p>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold font-mono uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>Kafka & RabbitMQ Broker telemetry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">System Logs & Broker Queue</h1>
          <p className="text-slate-400 text-sm mt-0.5">Real-time health indicator, message queue size, and dead letter queue (DLQ) webhook dispatch payloads.</p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
          <Server className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-slate-300">Kafka-Cluster: Healthy</span>
        </div>
      </div>

      {/* DevOps KPI stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Kafka queue size card */}
        <div id="logs-kpi-kafka-queue" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Kafka Queue Size</span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
              <span>{kafkaQueueSize}</span>
              <span className="text-xs text-amber-500 font-semibold font-mono">pending</span>
            </h3>
            <p className="text-[10px] text-slate-400">Backpressure threshold OK</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Webhook delivery rate */}
        <div id="logs-kpi-delivery-rate" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Webhook Delivery Rate</span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{deliveryRate}%</h3>
            <p className="text-[10px] text-slate-400">SLA margin target: 99.9%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Network Latency */}
        <div id="logs-kpi-latency" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Gateway Latency</span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">142ms</h3>
            <p className="text-[10px] text-slate-400">Response standard &lt; 250ms</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* Total Events Dispatched */}
        <div id="logs-kpi-events" className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">Broker Channels</span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">18 Active</h3>
            <p className="text-[10px] text-slate-400">Cross-region clustering live</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Network className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Grid: DLQ logs on left, JSON raw payload on right */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Left: Dead Letter Queue table (3 Cols) */}
        <div id="dlq-table-wrapper" className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden xl:col-span-3">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span>Dead Letter Queue (DLQ) & Webhook Retries</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Logs showing deliveries that exceeded immediate response thresholds</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-3 px-6">Log ID</th>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">Merchant Target</th>
                  <th className="py-3 px-6">Event Type</th>
                  <th className="py-3 px-6">HTTP Code</th>
                  <th className="py-3 px-6">Retry Index</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {logs.map((log) => {
                  const isSelected = selectedLog?.id === log.id;
                  return (
                    <tr 
                      id={`log-row-${log.id}`}
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`cursor-pointer transition duration-150 ${
                        isSelected 
                          ? 'bg-indigo-600/15 text-white font-semibold' 
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* ID */}
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-300">
                        {log.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>

                      {/* Merchant */}
                      <td className="py-4 px-6 text-slate-200">
                        {log.merchantName}
                      </td>

                      {/* Event */}
                      <td className="py-4 px-6 text-xs font-mono font-semibold text-slate-400">
                        {log.event}
                      </td>

                      {/* Status Code */}
                      <td className="py-4 px-6">
                        <span className={`font-mono text-xs px-2 py-0.5 rounded-md font-bold ${
                          log.statusCode === 200
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : log.statusCode >= 500
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          HTTP {log.statusCode}
                        </span>
                      </td>

                      {/* Retry index */}
                      <td className="py-4 px-6 text-xs text-center font-mono">
                        {log.retryCount} / 5
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          log.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : log.status === 'RETRIES_EXHAUSTED'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {log.status}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Code Viewer of Selected Log JSON (2 Cols) */}
        <div id="json-raw-viewer-panel" className="xl:col-span-2">
          {selectedLog ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
              {/* Card Header */}
              <div className="p-4 px-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Raw Webhook JSON Body</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Log reference ID: {selectedLog.id}</p>
                  </div>
                </div>
                
                {/* Close Panel Button */}
                <button 
                  id="close-raw-payload-btn"
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* JSON code blocks */}
              <div className="flex-1 overflow-auto p-6 bg-slate-950/90 font-mono text-xs text-emerald-400 border-b border-slate-800 max-h-[460px]">
                <pre id="json-raw-block">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>

              {/* Retry action bottom trigger */}
              <div className="p-4 bg-slate-900 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Re-evaluate Log</p>
                  <p className="text-xs text-slate-500">Route payload over original broker channel</p>
                </div>

                <button
                  id={`retry-log-btn-${selectedLog.id}`}
                  onClick={() => handleRetryWebhook(selectedLog.id)}
                  disabled={isRetrying || selectedLog.status === 'DELIVERED'}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition duration-200 cursor-pointer ${
                    selectedLog.status === 'DELIVERED'
                      ? 'bg-emerald-500/10 text-emerald-400 cursor-not-allowed border border-emerald-500/20'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10'
                  }`}
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Re-routing...</span>
                    </>
                  ) : selectedLog.status === 'DELIVERED' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Retry Message Delivery</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-700/50">
                <Code className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Payload Inspector Empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                  Select any Dead Letter log row on the left panel to inspect raw webhook JSON bodies, digital signatures, and re-transmit messages.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
