import type { PaymentsProvider, ZapRequest, PaymentResult } from './types';

const APP_PUBKEY = import.meta.env.VITE_APP_PUBKEY || '';

export class NostrZapProvider implements PaymentsProvider {
  async zap(req: ZapRequest): Promise<PaymentResult> {
    try {
      // Check if window.nostr is available (NIP-07)
      if (!window.nostr) {
        throw new Error('Nostr extension not found. Please install a Nostr wallet extension.');
      }

      // Create zap request event
      const zapRequest = {
        kind: 9734,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['relays', ...(import.meta.env.VITE_RELAYS?.split(',') || [])],
          ['amount', req.amountSats.toString()],
          ['p', APP_PUBKEY],
          ['t', 'zaptalk'],
          ['sku', req.skuId],
          ['user', req.userPubkey],
        ],
        content: req.memo || '',
      };

      // For demo purposes, we'll simulate a successful zap
      // In production, this would actually process through the wallet
      console.log('Zap request:', zapRequest);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Return success with mock event ID
      return {
        ok: true,
        nostrEventId: `mock-zap-${Date.now()}`,
      };
    } catch (error) {
      console.error('Zap error:', error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async invoice(req: ZapRequest): Promise<{ invoice: string }> {
    // Fallback to invoice generation
    // In production, this would call LNURL or Lightning service
    const mockInvoice = `lnbc${req.amountSats}n1...mock`;
    return { invoice: mockInvoice };
  }
}

declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: unknown): Promise<unknown>;
    };
  }
}
