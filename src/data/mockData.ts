import { Transaction, RoutingRule, RoutingAuditTrail, Disbursement, WebhookLog, GatewayVolumePoint } from '../types';

// Let's generate a list of 18 realistic pay-in transactions for view 3
export const initialTransactions: Transaction[] = [
  {
    id: "TX-20260707-1092",
    merchantName: "PT Maju Sejahtera",
    customerName: "Budi Santoso",
    amount: 15000000, // Rp 15.000.000
    method: "Virtual Account",
    channel: "BCA VA",
    gateway: "DOKU",
    status: "SUCCESS",
    date: "2026-07-07T08:14:22Z",
    mdrDeduction: 225000, // 1.5% MDR
    netAmount: 14775000,
  },
  {
    id: "TX-20260707-1093",
    merchantName: "PT Maju Sejahtera",
    customerName: "Siti Rahmawati",
    amount: 450000, // Rp 450.000
    method: "QRIS",
    channel: "Gopay",
    gateway: "Durianpay",
    status: "SUCCESS",
    date: "2026-07-07T08:12:05Z",
    mdrDeduction: 3150, // 0.7% MDR
    netAmount: 446850,
  },
  {
    id: "TX-20260707-1094",
    merchantName: "CV Indo Kreasi",
    customerName: "Aditya Pratama",
    amount: 12000000,
    method: "Virtual Account",
    channel: "Mandiri VA",
    gateway: "DOKU",
    status: "SUCCESS",
    date: "2026-07-07T07:45:10Z",
    mdrDeduction: 180000,
    netAmount: 11820000,
  },
  {
    id: "TX-20260707-1095",
    merchantName: "PT Maju Sejahtera",
    customerName: "Dewi Lestari",
    amount: 8500000,
    method: "E-Wallet",
    channel: "OVO",
    gateway: "Inacash",
    status: "SUCCESS",
    date: "2026-07-07T07:11:18Z",
    mdrDeduction: 127500, // 1.5%
    netAmount: 8372500,
  },
  {
    id: "TX-20260707-1096",
    merchantName: "Kopi Nusantara Abadi",
    customerName: "Eko Prasetyo",
    amount: 75000,
    method: "QRIS",
    channel: "ShopeePay",
    gateway: "Durianpay",
    status: "SUCCESS",
    date: "2026-07-07T06:54:33Z",
    mdrDeduction: 525,
    netAmount: 74475,
  },
  {
    id: "TX-20260707-1097",
    merchantName: "PT Maju Sejahtera",
    customerName: "Hendra Wijaya",
    amount: 25000000,
    method: "Virtual Account",
    channel: "BNI VA",
    gateway: "Inacash",
    status: "PENDING",
    date: "2026-07-07T06:30:00Z",
    mdrDeduction: 375000,
    netAmount: 24625000,
  },
  {
    id: "TX-20260707-1098",
    merchantName: "Global Tech Solutions",
    customerName: "Rian Hidayat",
    amount: 54000000,
    method: "Virtual Account",
    channel: "BRI VA",
    gateway: "DOKU",
    status: "SUCCESS",
    date: "2026-07-07T05:12:44Z",
    mdrDeduction: 810000,
    netAmount: 53190000,
  },
  {
    id: "TX-20260707-1099",
    merchantName: "PT Maju Sejahtera",
    customerName: "Amalia Siregar",
    amount: 320000,
    method: "QRIS",
    channel: "Dana",
    gateway: "Durianpay",
    status: "SUCCESS",
    date: "2026-07-07T04:22:15Z",
    mdrDeduction: 2240,
    netAmount: 317760,
  },
  {
    id: "TX-20260707-1100",
    merchantName: "CV Indo Kreasi",
    customerName: "Farhan Maulana",
    amount: 1450000,
    method: "E-Wallet",
    channel: "Gopay",
    gateway: "DOKU",
    status: "FAILED",
    date: "2026-07-07T03:40:02Z",
    mdrDeduction: 0,
    netAmount: 1450000,
  },
  {
    id: "TX-20260707-1101",
    merchantName: "PT Maju Sejahtera",
    customerName: "Lanny Wijaya",
    amount: 9800000,
    method: "Virtual Account",
    channel: "BCA VA",
    gateway: "DOKU",
    status: "SUCCESS",
    date: "2026-07-07T02:15:30Z",
    mdrDeduction: 147000,
    netAmount: 9653000,
  },
  {
    id: "TX-20260707-1102",
    merchantName: "Lombok Souvenir Shop",
    customerName: "Ketut Artha",
    amount: 150000,
    method: "QRIS",
    channel: "LinkAja",
    gateway: "Durianpay",
    status: "SUCCESS",
    date: "2026-07-06T23:10:00Z",
    mdrDeduction: 1050,
    netAmount: 148950,
  },
  {
    id: "TX-20260707-1103",
    merchantName: "PT Maju Sejahtera",
    customerName: "Ratna Sari",
    amount: 3500000,
    method: "E-Wallet",
    channel: "OVO",
    gateway: "Inacash",
    status: "SUCCESS",
    date: "2026-07-06T22:05:14Z",
    mdrDeduction: 52500,
    netAmount: 3447500,
  },
  {
    id: "TX-20260707-1104",
    merchantName: "PT Maju Sejahtera",
    customerName: "Yosef Sitorus",
    amount: 60000000,
    method: "Virtual Account",
    channel: "Mandiri VA",
    gateway: "Inacash",
    status: "FAILED",
    date: "2026-07-06T18:40:00Z",
    mdrDeduction: 0,
    netAmount: 60000000,
  },
  {
    id: "TX-20260707-1105",
    merchantName: "Kopi Nusantara Abadi",
    customerName: "Ina Kartika",
    amount: 55000,
    method: "QRIS",
    channel: "Gopay",
    gateway: "Durianpay",
    status: "SUCCESS",
    date: "2026-07-06T15:24:10Z",
    mdrDeduction: 385,
    netAmount: 54615,
  },
  {
    id: "TX-20260707-1106",
    merchantName: "PT Maju Sejahtera",
    customerName: "Andi Wijaya",
    amount: 11200000,
    method: "Virtual Account",
    channel: "BCA VA",
    gateway: "DOKU",
    status: "SUCCESS",
    date: "2026-07-06T14:12:00Z",
    mdrDeduction: 168000,
    netAmount: 11032000,
  },
  {
    id: "TX-20260707-1107",
    merchantName: "CV Indo Kreasi",
    customerName: "Wati Setiawati",
    amount: 1850000,
    method: "Virtual Account",
    channel: "BRI VA",
    gateway: "DOKU",
    status: "SUCCESS",
    date: "2026-07-06T11:05:00Z",
    mdrDeduction: 27750,
    netAmount: 1822250,
  },
  {
    id: "TX-20260707-1108",
    merchantName: "Global Tech Solutions",
    customerName: "Denny Siregar",
    amount: 125000000,
    method: "Virtual Account",
    channel: "BCA VA",
    gateway: "Inacash",
    status: "SUCCESS",
    date: "2026-07-06T09:15:22Z",
    mdrDeduction: 1875000,
    netAmount: 123125000,
  },
  {
    id: "TX-20260707-1109",
    merchantName: "PT Maju Sejahtera",
    customerName: "Tomi Hartono",
    amount: 150000,
    method: "QRIS",
    channel: "Dana",
    gateway: "Durianpay",
    status: "SUCCESS",
    date: "2026-07-06T08:02:11Z",
    mdrDeduction: 1050,
    netAmount: 148950,
  }
];

// Initial Routing Rules for View 2
export const initialRoutingRules: RoutingRule[] = [
  {
    id: "RULE-01",
    paymentMethod: "QRIS",
    merchant: "PT Maju Sejahtera",
    routeTo: "Durianpay",
    isActive: true,
    priority: 1,
  },
  {
    id: "RULE-02",
    paymentMethod: "Virtual Account",
    merchant: "All Merchants",
    routeTo: "DOKU",
    isActive: true,
    priority: 2,
  },
  {
    id: "RULE-03",
    paymentMethod: "E-Wallet",
    merchant: "Global Tech Solutions",
    routeTo: "Inacash",
    isActive: true,
    priority: 3,
  },
  {
    id: "RULE-04",
    paymentMethod: "QRIS",
    merchant: "Kopi Nusantara Abadi",
    routeTo: "Durianpay",
    isActive: false,
    priority: 4,
  }
];

// Initial Routing Audit Trails for View 2
export const initialAuditTrails: RoutingAuditTrail[] = [
  {
    id: "AUD-89201",
    timestamp: "2026-07-07T08:12:05Z",
    transactionId: "TX-20260707-1093",
    merchant: "PT Maju Sejahtera",
    paymentMethod: "QRIS",
    originalAmount: 450000,
    routedTo: "Durianpay",
    ruleTriggered: "IF Payment Method = QRIS AND Merchant = PT Maju Sejahtera, THEN Route To = Durianpay",
  },
  {
    id: "AUD-89202",
    timestamp: "2026-07-07T08:14:22Z",
    transactionId: "TX-20260707-1092",
    merchant: "PT Maju Sejahtera",
    paymentMethod: "Virtual Account",
    originalAmount: 15000000,
    routedTo: "DOKU",
    ruleTriggered: "IF Payment Method = Virtual Account, THEN Route To = DOKU",
  },
  {
    id: "AUD-89203",
    timestamp: "2026-07-07T07:45:10Z",
    transactionId: "TX-20260707-1094",
    merchant: "CV Indo Kreasi",
    paymentMethod: "Virtual Account",
    originalAmount: 12000000,
    routedTo: "DOKU",
    ruleTriggered: "IF Payment Method = Virtual Account, THEN Route To = DOKU",
  },
  {
    id: "AUD-89204",
    timestamp: "2026-07-07T07:11:18Z",
    transactionId: "TX-20260707-1095",
    merchant: "PT Maju Sejahtera",
    paymentMethod: "E-Wallet",
    originalAmount: 8500000,
    routedTo: "Inacash",
    ruleTriggered: "Fallback Route - Load Balance Routing",
  },
  {
    id: "AUD-89205",
    timestamp: "2026-07-07T06:54:33Z",
    transactionId: "TX-20260707-1096",
    merchant: "Kopi Nusantara Abadi",
    paymentMethod: "QRIS",
    originalAmount: 75000,
    routedTo: "Durianpay",
    ruleTriggered: "IF Payment Method = QRIS AND Merchant = Kopi Nusantara Abadi, THEN Route To = Durianpay (Inactive rule bypassed, routed via default)",
  }
];

// Initial Disbursement records for View 4 (Maker-Checker)
export const initialDisbursements: Disbursement[] = [
  // Section B Awaiting Approval (3 rows)
  {
    id: "DISB-202607-091",
    beneficiary: "PT Pangan Mandiri",
    bank: "Bank Central Asia (BCA)",
    accountNumber: "8820918230",
    amount: 125000000, // Rp 125.000.000
    maker: "Andika Pratama (Finance Staff)",
    status: "AWAITING APPROVAL",
    createdAt: "2026-07-06T16:30:00Z"
  },
  {
    id: "DISB-202607-092",
    beneficiary: "CV Logistik Jaya",
    bank: "Bank Mandiri",
    accountNumber: "1240009182730",
    amount: 47800000, // Rp 47.800.000
    maker: "Andika Pratama (Finance Staff)",
    status: "AWAITING APPROVAL",
    createdAt: "2026-07-07T02:10:00Z"
  },
  {
    id: "DISB-202607-093",
    beneficiary: "Budi Setiadi (Vendor Hub)",
    bank: "Bank Rakyat Indonesia (BRI)",
    accountNumber: "0206010091827",
    amount: 8900000, // Rp 8.900.000
    maker: "Ratih Sukma (Operations Staff)",
    status: "AWAITING APPROVAL",
    createdAt: "2026-07-07T07:20:00Z"
  },
  // Section B Processed (5 rows)
  {
    id: "DISB-202607-086",
    beneficiary: "PT Indo Supplier",
    bank: "Bank Central Asia (BCA)",
    accountNumber: "2201928374",
    amount: 320000000,
    maker: "Andika Pratama (Finance Staff)",
    status: "PROCESSED",
    createdAt: "2026-07-05T09:15:00Z",
    processedAt: "2026-07-05T11:40:00Z"
  },
  {
    id: "DISB-202607-087",
    beneficiary: "CV Prima Packing",
    bank: "Bank Negara Indonesia (BNI)",
    accountNumber: "0192837465",
    amount: 15300000,
    maker: "Ratih Sukma (Operations Staff)",
    status: "PROCESSED",
    createdAt: "2026-07-05T14:22:00Z",
    processedAt: "2026-07-05T15:10:00Z"
  },
  {
    id: "DISB-202607-088",
    beneficiary: "PT Reksa Logistik",
    bank: "Bank Mandiri",
    accountNumber: "1230007654321",
    amount: 98400000,
    maker: "Andika Pratama (Finance Staff)",
    status: "PROCESSED",
    createdAt: "2026-07-06T10:05:00Z",
    processedAt: "2026-07-06T10:55:00Z"
  },
  {
    id: "DISB-202607-089",
    beneficiary: "Kantor Pajak Pratama",
    bank: "Bank Indonesia",
    accountNumber: "0011223344",
    amount: 45000000,
    maker: "System Automator (Tax)",
    status: "PROCESSED",
    createdAt: "2026-07-06T11:00:00Z",
    processedAt: "2026-07-06T11:01:00Z"
  },
  {
    id: "DISB-202607-090",
    beneficiary: "Siti Amelia (Overtime Pay)",
    bank: "Bank Central Asia (BCA)",
    accountNumber: "8820129384",
    amount: 3200000,
    maker: "Ratih Sukma (Operations Staff)",
    status: "PROCESSED",
    createdAt: "2026-07-06T15:00:00Z",
    processedAt: "2026-07-06T16:15:00Z"
  }
];

// Initial Webhook and Dead Letter Queue Logs for View 5
export const initialWebhookLogs: WebhookLog[] = [
  {
    id: "WH-ERR-9821",
    merchantId: "MCH-MAJU-01",
    merchantName: "PT Maju Sejahtera",
    event: "payment.inbound.success",
    timestamp: "2026-07-07T08:12:06Z",
    statusCode: 504,
    retryCount: 5,
    status: "RETRIES_EXHAUSTED",
    payload: {
      merchant_id: "MCH-MAJU-01",
      signature: "sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      event: "payment.inbound.success",
      timestamp: 1783411926,
      data: {
        transaction_id: "TX-20260707-1093",
        amount: 450000,
        currency: "IDR",
        payment_method: "QRIS",
        payment_channel: "Gopay",
        gateway_used: "Durianpay",
        customer: {
          name: "Siti Rahmawati",
          email: "siti.rahma@gmail.com"
        },
        status: "success",
        settled_at: "2026-07-07T08:12:05Z"
      }
    }
  },
  {
    id: "WH-ERR-9822",
    merchantId: "MCH-KREASI-02",
    merchantName: "CV Indo Kreasi",
    event: "payment.inbound.failed",
    timestamp: "2026-07-07T03:40:03Z",
    statusCode: 500,
    retryCount: 3,
    status: "FAILED",
    payload: {
      merchant_id: "MCH-KREASI-02",
      signature: "sha256=f8876c02932bbcf338ef2f1e2f3a61f5bc08b9c1d198f12a38ab8fcb1cf93766",
      event: "payment.inbound.failed",
      timestamp: 1783395603,
      data: {
        transaction_id: "TX-20260707-1100",
        amount: 1450000,
        currency: "IDR",
        payment_method: "E-Wallet",
        payment_channel: "Gopay",
        gateway_used: "DOKU",
        error_details: {
          code: "INSUFFICIENT_BALANCE",
          message: "User account balance is insufficient for this charge."
        },
        status: "failed",
        failed_at: "2026-07-07T03:40:02Z"
      }
    }
  },
  {
    id: "WH-ERR-9823",
    merchantId: "MCH-GLOB-09",
    merchantName: "Global Tech Solutions",
    event: "payment.disbursement.processed",
    timestamp: "2026-07-07T01:15:00Z",
    statusCode: 404,
    retryCount: 1,
    status: "FAILED",
    payload: {
      merchant_id: "MCH-GLOB-09",
      signature: "sha256=a122f309990b764cb432091f09e0a6d1b2298c19a823e2fb3bc477f1190bc121",
      event: "payment.disbursement.processed",
      timestamp: 1783386900,
      data: {
        disbursement_id: "DISB-202607-088",
        amount: 98400000,
        currency: "IDR",
        beneficiary: {
          name: "PT Reksa Logistik",
          bank: "Bank Mandiri",
          account: "1230007654321"
        },
        status: "processed",
        processed_at: "2026-07-06T10:55:00Z"
      }
    }
  },
  {
    id: "WH-OK-9824",
    merchantId: "MCH-MAJU-01",
    merchantName: "PT Maju Sejahtera",
    event: "payment.inbound.success",
    timestamp: "2026-07-07T08:14:23Z",
    statusCode: 200,
    retryCount: 0,
    status: "DELIVERED",
    payload: {
      merchant_id: "MCH-MAJU-01",
      signature: "sha256=bc839209f8df283cb7ef2a1e8e426a80fa9bc28de9aef82312d8aef823192083",
      event: "payment.inbound.success",
      timestamp: 1783412063,
      data: {
        transaction_id: "TX-20260707-1092",
        amount: 15000000,
        currency: "IDR",
        payment_method: "Virtual Account",
        payment_channel: "BCA VA",
        gateway_used: "DOKU",
        customer: {
          name: "Budi Santoso",
          email: "budi.santoso@gmail.com"
        },
        status: "success",
        settled_at: "2026-07-07T08:14:22Z"
      }
    }
  },
  {
    id: "WH-ERR-9825",
    merchantId: "MCH-KOPI-05",
    merchantName: "Kopi Nusantara Abadi",
    event: "payment.inbound.success",
    timestamp: "2026-07-06T15:24:12Z",
    statusCode: 502,
    retryCount: 4,
    status: "FAILED",
    payload: {
      merchant_id: "MCH-KOPI-05",
      signature: "sha256=c01d9f823bc01bde023e098cb901fef67e231023aef012fcd9001bfa82d0291a",
      event: "payment.inbound.success",
      timestamp: 1783351452,
      data: {
        transaction_id: "TX-20260707-1105",
        amount: 55000,
        currency: "IDR",
        payment_method: "QRIS",
        payment_channel: "Gopay",
        gateway_used: "Durianpay",
        customer: {
          name: "Ina Kartika"
        },
        status: "success",
        settled_at: "2026-07-06T15:24:10Z"
      }
    }
  }
];

// Hour of day volume chart data for View 1
export const initialVolumeData: GatewayVolumePoint[] = [
  { time: "00:00", DOKU: 120000000, Durianpay: 45000000, Inacash: 60000000 },
  { time: "02:00", DOKU: 90000000, Durianpay: 30000000, Inacash: 40000000 },
  { time: "04:00", DOKU: 110000000, Durianpay: 55000000, Inacash: 70000000 },
  { time: "06:00", DOKU: 230000000, Durianpay: 140000000, Inacash: 120000000 },
  { time: "08:00", DOKU: 450000000, Durianpay: 320000000, Inacash: 280000000 },
  { time: "10:00", DOKU: 620000000, Durianpay: 480000000, Inacash: 410000000 },
  { time: "12:00", DOKU: 580000000, Durianpay: 420000000, Inacash: 390000000 },
  { time: "14:00", DOKU: 710000000, Durianpay: 510000000, Inacash: 490000000 },
  { time: "16:00", DOKU: 840000000, Durianpay: 630000000, Inacash: 540000000 },
  { time: "18:00", DOKU: 790000000, Durianpay: 580000000, Inacash: 510000000 },
  { time: "20:00", DOKU: 950000000, Durianpay: 710000000, Inacash: 680000000 },
  { time: "22:00", DOKU: 680000000, Durianpay: 490000000, Inacash: 430000000 }
];
