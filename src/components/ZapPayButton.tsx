import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/stores/auth';
import { useEntitlementsStore } from '@/stores/entitlements';
import { NostrZapProvider } from '@/lib/payments/nostrZap';
import { cn } from '@/lib/utils';

interface ZapPayButtonProps {
  skuId: string;
  amountSats: number;
  displayName: string;
  onSuccess?: () => void;
  className?: string;
}

const zapProvider = new NostrZapProvider();

export function ZapPayButton({
  skuId,
  amountSats,
  displayName,
  onSuccess,
  className,
}: ZapPayButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { pubkey } = useAuthStore();
  const { grant } = useEntitlementsStore();

  const handleZap = async () => {
    if (!pubkey) {
      toast({
        title: 'Login Required',
        description: 'Please sign in with Nostr to unlock lessons.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await zapProvider.zap({
        amountSats,
        skuId,
        memo: `Unlock ${displayName}`,
        userPubkey: pubkey,
      });

      if (result.ok) {
        // Grant entitlement
        grant(skuId, 'nostr-zap', result.nostrEventId);

        toast({
          title: '⚡ Payment Successful!',
          description: `${displayName} has been unlocked.`,
        });

        onSuccess?.();
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleZap}
      disabled={isProcessing}
      className={cn(
        'gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold shadow-lg',
        className
      )}
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="h-4 w-4 fill-current" />
          Unlock for {amountSats.toLocaleString()} sats
        </>
      )}
    </Button>
  );
}
