import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, Props>(({ className, strong, ...props }, ref) => (
  <div ref={ref} className={cn(strong ? 'glass-strong' : 'glass', 'rounded-3xl', className)} {...props} />
));
GlassCard.displayName = 'GlassCard';
