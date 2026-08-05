import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-xs border px-1.5 py-px text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-muted-foreground border-border-strong',
        critical: 'bg-critical-bg text-critical border-critical-border',
        warning: 'bg-warning-bg text-warning border-warning-border',
        success: 'bg-success-bg text-success border-success-border',
        info: 'bg-info-bg text-info border-info-border',
        emerald: 'bg-primary/15 text-primary-deep border-primary/30',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}
