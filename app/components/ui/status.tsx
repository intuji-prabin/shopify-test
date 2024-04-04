import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '~/lib/utils/utils';

const statusVariants = cva(
  'inline-flex items-center justify-center p-2 min-w-[96px] text-sm font-medium capitalize leading-4 w-full border border-solid border-current',
  {
    variants: {
      variant: {
        awaiting: 'text-status-awaiting',
        invoice: 'text-status-invoice',
        partially_pick: 'text-status-partially_pick',
        shipped: 'text-status-shipped',
        partially_shipped: 'text-status-partially_shipped',
        partially_invoice: 'text-status-partially_invoice',
        fully_pick: 'text-status-fully_pick',
        pending: 'text-status-pending',
        closed: 'text-status-closed',
        received: 'text-status-recieved',
      },
    },
    defaultVariants: {
      variant: 'awaiting',
    },
  },
);

export interface SatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {}

function Status({className, variant, ...props}: SatusProps) {
  return (
    <div className={cn(statusVariants({variant}), className)} {...props} />
  );
}

export {Status, statusVariants};
