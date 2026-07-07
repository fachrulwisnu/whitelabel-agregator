import { useState } from 'react';
import Sidebar from './components/Sidebar';
import GlobalOverview from './components/GlobalOverview';
import SmartRouting from './components/SmartRouting';
import PayInLedger from './components/PayInLedger';
import Disbursements from './components/Disbursements';
import DeveloperLogs from './components/DeveloperLogs';

import { Transaction, RoutingRule, RoutingAuditTrail, Disbursement, WebhookLog } from './types';
import { 
  initialTransactions, 
  initialRoutingRules, 
  initialAuditTrails, 
  initialDisbursements, 
  initialWebhookLogs 
} from './data/mockData';

export default function App() {
  // Navigation states
  const [currentView, setCurrentView] = useState('superadmin_dashboard');
  const [persona, setPersona] = useState<'superadmin' | 'merchant'>('superadmin');

  // Shared application database states
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [rules, setRules] = useState<RoutingRule[]>(initialRoutingRules);
  const [auditTrails, setAuditTrails] = useState<RoutingAuditTrail[]>(initialAuditTrails);
  const [disbursements, setDisbursements] = useState<Disbursement[]>(initialDisbursements);
  const [logs, setLogs] = useState<WebhookLog[]>(initialWebhookLogs);

  // Financial Metrics States
  const [balance, setBalance] = useState<number>(850500000); // Rp 850.500.000 available
  const [gmvTotal, setGmvTotal] = useState<number>(150000000000); // Rp 150B starting GMV
  const [netRevenue, setNetRevenue] = useState<number>(2500000000); // Rp 2.5B platform commission

  // Live Payment Simulation Trigger (Drives full-pipeline B2B telemetry)
  const handleTriggerSimulation = () => {
    // 1. Array of realistic Indonesian names
    const customers = [
      "Rizky Ramadhan", "Mega Utami", "Wahyu Pratama", "Zackaria", 
      "Putri Lestari", "Guntur Wibowo", "Maya Sofia", "Iman Santoso",
      "Tri Handoko", "Susi Susanti", "Ahmad Fauzi", "Evi Safitri"
    ];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];

    // 2. Select a merchant client
    const merchants = [
      "PT Maju Sejahtera", "CV Indo Kreasi", "Kopi Nusantara Abadi", "Global Tech Solutions"
    ];
    const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];

    // 3. Define payment methods and corresponding channels
    const methods = [
      { method: "Virtual Account", channel: "BCA VA" },
      { method: "Virtual Account", channel: "Mandiri VA" },
      { method: "QRIS", channel: "Gopay" },
      { method: "QRIS", channel: "ShopeePay" },
      { method: "E-Wallet", channel: "OVO" },
      { method: "E-Wallet", channel: "Dana" }
    ] as const;
    const chosenMethod = methods[Math.floor(Math.random() * methods.length)];

    // 4. Smart Routing Evaluator (Runs simulation against active rules set in View 2!)
    let routedGateway: 'DOKU' | 'Durianpay' | 'Inacash' = "DOKU";
    let ruleTriggeredText = "Fallback Route - Load Balance Routing";

    // Filter rules that match and sort by priority score
    const matchingRule = rules
      .filter(r => r.isActive)
      .sort((a, b) => a.priority - b.priority)
      .find(r => {
        const matchMethod = r.paymentMethod === chosenMethod.method;
        const matchMerchant = r.merchant === 'All Merchants' || r.merchant === randomMerchant;
        return matchMethod && matchMerchant;
      });

    if (matchingRule) {
      routedGateway = matchingRule.routeTo;
      ruleTriggeredText = `IF Payment Method = ${matchingRule.paymentMethod}${matchingRule.merchant !== 'All Merchants' ? ` AND Merchant = ${matchingRule.merchant}` : ''}, THEN Route To = ${matchingRule.routeTo}`;
    } else {
      // Default gateway fallback if no matching logic is found
      const defaultGateways: ('DOKU' | 'Durianpay' | 'Inacash')[] = ["DOKU", "Durianpay", "Inacash"];
      routedGateway = defaultGateways[Math.floor(Math.random() * defaultGateways.length)];
    }

    // 5. Calculate random amount and fee allocations
    const randomAmount = Math.floor(15000 + Math.random() * 45000000); // Rp 15.000 to Rp 45.000.000
    const mdrRate = chosenMethod.method === 'QRIS' ? 0.007 : 0.015; // QRIS is 0.7%, VAs/Wallets are 1.5%
    const mdrDeduction = Math.floor(randomAmount * mdrRate);
    const netAmount = randomAmount - mdrDeduction;

    const trxId = `SIM-TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const status: 'SUCCESS' | 'FAILED' | 'PENDING' = Math.random() > 0.12 ? 'SUCCESS' : 'FAILED';

    const newTrx: Transaction = {
      id: trxId,
      merchantName: randomMerchant,
      customerName: randomCustomer,
      amount: randomAmount,
      method: chosenMethod.method,
      channel: chosenMethod.channel,
      gateway: routedGateway,
      status,
      date: new Date().toISOString(),
      mdrDeduction,
      netAmount
    };

    // Append to transactions array
    setTransactions(prev => [newTrx, ...prev]);

    // If successful, update overall aggregated revenue and GMV
    if (status === 'SUCCESS') {
      setGmvTotal(prev => prev + randomAmount);
      // Increment Net Revenue (Take rate commission of 1.6% of gross value)
      setNetRevenue(prev => prev + Math.floor(randomAmount * 0.016));
      
      // If payment is for PT Maju Sejahtera, increase the merchant balance!
      if (randomMerchant === "PT Maju Sejahtera") {
        setBalance(prev => prev + netAmount);
      }
    }

    // 6. Generate Routing Audit entry reflecting rule evaluation
    const newAuditId = `AUD-SIM-${Math.floor(10000 + Math.random() * 89999)}`;
    const newAuditTrail: RoutingAuditTrail = {
      id: newAuditId,
      timestamp: new Date().toISOString(),
      transactionId: trxId,
      merchant: randomMerchant,
      paymentMethod: chosenMethod.method,
      originalAmount: randomAmount,
      routedTo: routedGateway,
      ruleTriggered: ruleTriggeredText
    };
    setAuditTrails(prev => [newAuditTrail, ...prev]);

    // 7. If the payment is FAILED, register a Dead Letter Queue (DLQ) Webhook Error Log
    if (status === 'FAILED' || Math.random() > 0.6) {
      const isFailed = status === 'FAILED';
      const logId = `WH-SIM-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newWebhookLog: WebhookLog = {
        id: logId,
        merchantId: randomMerchant === "PT Maju Sejahtera" ? "MCH-MAJU-01" : "MCH-EXT-99",
        merchantName: randomMerchant,
        event: isFailed ? "payment.inbound.failed" : "payment.inbound.success",
        timestamp: new Date().toISOString(),
        statusCode: isFailed ? 500 : 504,
        retryCount: 1,
        status: "FAILED",
        payload: {
          merchant_id: randomMerchant === "PT Maju Sejahtera" ? "MCH-MAJU-01" : "MCH-EXT-99",
          signature: `sha256=${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`,
          event: isFailed ? "payment.inbound.failed" : "payment.inbound.success",
          timestamp: Math.floor(Date.now() / 1000),
          data: {
            transaction_id: trxId,
            amount: randomAmount,
            currency: "IDR",
            payment_method: chosenMethod.method,
            payment_channel: chosenMethod.channel,
            gateway_used: routedGateway,
            status: isFailed ? "failed" : "success",
            error_details: isFailed ? {
              code: "INSUFFICIENT_BALANCE",
              message: "User account balance is insufficient for this charge."
            } : {
              code: "GATEWAY_TIMEOUT",
              message: "Timeout receiving response from client's server endpoint."
            }
          }
        }
      };

      setLogs(prev => [newWebhookLog, ...prev]);
    }
  };

  // Switch statement for view selection
  const renderCurrentView = () => {
    switch (currentView) {
      case 'superadmin_dashboard':
        return (
          <GlobalOverview 
            transactions={transactions} 
            onTriggerSimulation={handleTriggerSimulation}
            gmvTotal={gmvTotal}
            netRevenue={netRevenue}
          />
        );
      case 'smart_routing':
        return (
          <SmartRouting 
            rules={rules} 
            setRules={setRules} 
            auditTrails={auditTrails}
            setAuditTrails={setAuditTrails}
          />
        );
      case 'merchant_ledger':
        return (
          <PayInLedger 
            transactions={transactions.filter(t => t.merchantName === "PT Maju Sejahtera")} 
          />
        );
      case 'merchant_disbursement':
        return (
          <Disbursements 
            disbursements={disbursements} 
            setDisbursements={setDisbursements}
            balance={balance}
            setBalance={setBalance}
          />
        );
      case 'developer_logs':
        return (
          <DeveloperLogs 
            logs={logs}
            setLogs={setLogs}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            View not found. Select a dashboard from the sidebar.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Left Sidebar navigation and Role Selector */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        persona={persona}
        setPersona={setPersona}
      />

      {/* Main Content Pane */}
      <main className="flex-1 h-screen overflow-hidden bg-slate-50 relative">
        {renderCurrentView()}
      </main>

    </div>
  );
}
