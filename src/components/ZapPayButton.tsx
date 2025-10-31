import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const { pubkey } = useAuthStore();
  const { grant } = useEntitlementsStore();

  const handleZap = async () => {
    if (!pubkey) {
      toast({
        title: t('payment_toast.login_required_title'),
        description: t('payment_toast.login_required_desc'),
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
          title: t('payment_toast.payment_successful_title'),
          description: t('payment_toast.payment_successful_desc', { displayName }),
        });

        onSuccess?.();
      } else {
        throw new Error(result.error || t('payment_toast.payment_failed_desc'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: t('payment_toast.payment_failed_title'),
        description: error instanceof Error ? error.message : t('payment_toast.payment_failed_desc'),
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
          {t('payment.processing')}
        </>
      ) : (
        <>
          <Zap className="h-4 w-4 fill-current" />
          {t('payment_toast.pay_with_sats', { sats: amountSats.toLocaleString() })}
        </>
      )}
    </Button>
  );
}
