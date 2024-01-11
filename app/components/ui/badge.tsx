import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '~/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-[5px] text-sm font-medium uppercase leading-4',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        secondary:
          'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        destructive:
          'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80',
        outline: 'text-slate-950 dark:text-slate-50',
        inStock: 'bg-semantic-success-100 text-semantic-success-500',
        lowStock: 'bg-semantic-danger-100 text-semantic-danger-500',
        outOfStock: 'bg-semantic-warning-100 text-semantic-warning-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({className, variant, ...props}: BadgeProps) {
  return <div className={cn(badgeVariants({variant}), className)} {...props} />;
}

export {Badge, badgeVariants};
