export interface Transaction {
  id: string;
  merchantName: string;
  customerName: string;
  amount: number;
  method: 'Virtual Account' | 'QRIS' | 'E-Wallet';
  channel: string; // e.g., 'BCA VA', 'Gopay', 'OVO'
  gateway: 'DOKU' | 'Durianpay' | 'Inacash';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  date: string;
  mdrDeduction: number;
  netAmount: number;
}

export interface RoutingRule {
  id: string;
  paymentMethod: string;
  merchant: string;
  routeTo: 'DOKU' | 'Durianpay' | 'Inacash';
  isActive: boolean;
  priority: number;
}

export interface RoutingAuditTrail {
  id: string;
  timestamp: string;
  transactionId: string;
  merchant: string;
  paymentMethod: string;
  originalAmount: number;
  routedTo: 'DOKU' | 'Durianpay' | 'Inacash';
  ruleTriggered: string;
}

export interface Disbursement {
  id: string;
  beneficiary: string;
  bank: string;
  accountNumber: string;
  amount: number;
  maker: string;
  status: 'AWAITING APPROVAL' | 'PROCESSED' | 'REJECTED';
  createdAt: string;
  processedAt?: string;
}

export interface WebhookLog {
  id: string;
  merchantId: string;
  merchantName: string;
  event: string;
  timestamp: string;
  statusCode: number;
  retryCount: number;
  status: 'DELIVERED' | 'FAILED' | 'RETRIES_EXHAUSTED';
  payload: Record<string, any>;
}

export interface GatewayVolumePoint {
  time: string;
  DOKU: number;
  Durianpay: number;
  Inacash: number;
}
