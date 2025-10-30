export interface ZapRequest {
  amountSats: number;
  skuId: string;
  memo?: string;
  userPubkey: string;
}

export interface PaymentResult {
  ok: boolean;
  nostrEventId?: string;
  error?: string;
}

export interface PaymentsProvider {
  zap(req: ZapRequest): Promise<PaymentResult>;
  invoice(req: ZapRequest): Promise<{ invoice: string }>;
}
