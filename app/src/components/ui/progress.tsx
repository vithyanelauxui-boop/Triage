import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn('h-full flex-1 rounded-full bg-primary transition-all', indicatorClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value ?? 0))}%` }}
      />
    </ProgressPrimitive.Root>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;
