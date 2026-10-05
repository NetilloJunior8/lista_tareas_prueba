import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-green-600/15 text-green-800 border-green-600/30',
        secondary:
          'border-transparent bg-green-100 text-green-950 hover:bg-green-200',
        destructive:
          'border-transparent bg-rose-500/15 text-rose-600 border-rose-500/30',
        outline:
          'text-green-950 border-green-300',
        success:
          'border-transparent bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
        warning:
          'border-transparent bg-amber-500/15 text-amber-300 border-amber-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
