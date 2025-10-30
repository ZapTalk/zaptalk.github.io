import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LockBadgeProps {
  isFree: boolean;
  isUnlocked: boolean;
  priceSats?: number;
  className?: string;
}

export function LockBadge({ isFree, isUnlocked, priceSats, className }: LockBadgeProps) {
  if (isFree) {
    return (
      <Badge variant="secondary" className={cn('gap-1', className)}>
        <CheckCircle2 className="h-3 w-3" />
        Free
      </Badge>
    );
  }

  if (isUnlocked) {
    return (
      <Badge variant="default" className={cn('gap-1 bg-green-600', className)}>
        <CheckCircle2 className="h-3 w-3" />
        Unlocked
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn('gap-1', className)}>
      <Lock className="h-3 w-3" />
      {priceSats ? `${priceSats.toLocaleString()} sats` : 'Locked'}
    </Badge>
  );
}
