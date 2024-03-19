export interface GetTokenRequestBody {
  imp_key: string;
  imp_secret: string;
}

export interface GetTokenResponse {
  code: number;
  message: string;
  response: {
    access_token: string;
    expired_at: Date;
    now: number;
  };
}

export interface AgainRequestBody {
  customer_uid: string;
  merchant_uid: string;
  amount: number;
  name: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_tel?: string;
  custom_data?: {
    buyer_company?: string;
  };
}

interface CancelHistory {
  pg_tid: string;
  amount: number;
  cancelled_at: number;
  reason: string;
  cancellation_id: string;
  receipt_url: string;
}

export interface AgainResponse {
  code: number;
  message: string;
  response: {
    imp_uid: string;
    merchant_uid: string;
    pay_method: string;
    channel: string;
    pg_provider: string;
    emb_pg_provider: string;
    pg_tid: string;
    pg_id: string;
    escrow: boolean;
    apply_num: string;
    bank_code: string;
    bank_name: string;
    card_code: string;
    card_name: string;
    card_issuer_code: string;
    card_issuer_name: string;
    card_publisher_code: string;
    card_publisher_name: string;
    card_quota: number;
    card_number: string;
    card_type: number;
    vbank_code: string;
    vbank_name: string;
    vbank_num: string;
    vbank_holder: string;
    vbank_date: number;
    vbank_issued_at: number;
    name: string;
    amount: number;
    cancel_amount: number;
    currency: string;
    buyer_name: string;
    buyer_email: string;
    buyer_tel: string;
    buyer_addr: string;
    buyer_postcode: string;
    custom_data: string;
    user_agent: string;
    status: string;
    started_at: number;
    paid_at: number;
    failed_at: number;
    cancelled_at: number;
    fail_reason: string;
    cancel_reason: string;
    receipt_url: string;
    cancel_history: CancelHistory[];
    cancel_receipt_urls: string[];
    cash_receipt_issued: boolean;
    customer_uid: string;
    customer_uid_usage: string;
  };
}

interface CancelHistory {
  pg_tid: string;
  amount: number;
  cancelled_at: number;
  reason: string;
  cancellation_id: string;
  receipt_url: string;
}

export interface GetPaymentInfoResponse {
  code: number;
  message: string;
  response: {
    imp_uid: string;
    merchant_uid: string;
    pay_method: string;
    channel: string;
    pg_provider: string;
    emb_pg_provider: string;
    pg_tid: string;
    pg_id: string;
    escrow: boolean;
    apply_num: string;
    bank_code: string;
    bank_name: string;
    card_code: string;
    card_name: string;
    card_issuer_code: string;
    card_issuer_name: string;
    card_publisher_code: string;
    card_publisher_name: string;
    card_quota: number;
    card_number: string;
    card_type: number;
    vbank_code: string;
    vbank_name: string;
    vbank_num: string;
    vbank_holder: string;
    vbank_date: number;
    vbank_issued_at: number;
    name: string;
    amount: number;
    cancel_amount: number;
    currency: string;
    buyer_name: string;
    buyer_email: string;
    buyer_tel: string;
    buyer_addr: string;
    buyer_postcode: string;
    custom_data: string | Record<any, any>;
    user_agent: string;
    status: string;
    started_at: number;
    paid_at: number;
    failed_at: number;
    cancelled_at: number;
    fail_reason: string;
    cancel_reason: string;
    receipt_url: string;
    cancel_history: CancelHistory[];
    cancel_receipt_urls: string[];
    cash_receipt_issued: boolean;
    customer_uid: string;
    customer_uid_usage: string;
  };
}

export interface ScheduleRequestBody {
  customer_uid: string;
  schedules: {
    merchant_uid: string;
    schedule_at: number;
    amount: number;
    currency: string; // KRW, USD 중 1개
    notice_url?: string;
    name?: string;
    buyer_name?: string;
    buyer_email?: string;
    buyer_tel?: string;
    buyer_addr?: string;
    buyer_postcode?: string;
    custom_data: string | Record<any, any>;
  }[];
}

export interface ScheduleResponse {
  code: number;
  message: string;
  response: {
    customer_uid: string;
    merchant_uid: string;
    imp_uid: string | null;
    customer_id: string;
    schedule_at: number;
    executed_at: number;
    revoked_at: number;
    amount: number;
    currency: string;
    name: string;
    buyer_name: string;
    buyer_email: string;
    buyer_tel: string;
    buyer_addr: string;
    buyer_postcode: string;
    custom_data: string | Record<any, any>;
    schedule_status: 'scheduled' | 'executed' | 'revoked';
    payment_status: 'paid' | 'failed' | 'cancelled';
    fail_reason: string;
  };
}

export interface UnScheduleRequestBody {
  customer_uid: string;
  merchant_uid?: string;
}

export interface UnScheduleResponse extends ScheduleResponse {}

export interface SchedulePaymentInfo {
  amount: number;
  currency: string;
  scheduleDate: Date;
  buyerName?: string;
  buyerTel?: string;
  buyerEmail?: string;
  buyerCompany?: string;
}

export interface ExecutePaymentInfo {
  amount: number;
  currency: string;
  scheduleDate?: Date;
  buyerName?: string;
  buyerTel?: string;
  buyerEmail?: string;
  buyerCompany?: string;
}
