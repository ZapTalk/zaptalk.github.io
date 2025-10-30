import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DirectionalArrowProps {
  direction: 'back' | 'forward';
  className?: string;
}

/**
 * A directional arrow component that automatically flips based on RTL/LTR language direction.
 * - In LTR (English): back = left arrow, forward = right arrow
 * - In RTL (Arabic/Persian): back = right arrow, forward = left arrow
 */
export function DirectionalArrow({ direction, className }: DirectionalArrowProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // In RTL, "back" means right arrow, "forward" means left arrow
  // In LTR, "back" means left arrow, "forward" means right arrow
  const showLeftArrow = (direction === 'back' && !isRTL) || (direction === 'forward' && isRTL);

  return showLeftArrow ? (
    <ArrowLeft className={className} />
  ) : (
    <ArrowRight className={className} />
  );
}
