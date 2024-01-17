import {useMemo} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {statusVariants} from '~/components/ui/status';

export type TicketColumn = {
  ticketId: string;
  contactName: string;
  reason: string;
  department: string;
  createdOn: string;
  status:
    | 'processing'
    | 'invoice'
    | 'partially-invoiced'
    | 'order-picked'
    | 'fully-picked'
    | 'in-transit'
    | 'delivered';
};

export function useColumn() {
  const columns = useMemo<ColumnDef<TicketColumn>[]>(
    () => [
      {
        accessorKey: 'ticketId',
        header: 'Ticket ID.',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'contactName',
        header: 'Contact Name',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'createdOn',
        header: 'Created On',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 'processing':
              return (
                <div className={statusVariants({variant: 'awaiting'})}>
                  Processing
                </div>
              );
            case 'delivered':
              return (
                <div className={statusVariants({variant: 'shipped'})}>
                  delivered
                </div>
              );
            case 'fully-picked':
              return (
                <div className={statusVariants({variant: 'fully_pick'})}>
                  fully pick
                </div>
              );
            case 'partially-invoiced':
              return (
                <div className={statusVariants({variant: 'partially_invoice'})}>
                  partially invoiced
                </div>
              );
            case 'in-transit':
              return (
                <div className={statusVariants({variant: 'partially_shipped'})}>
                  in transit
                </div>
              );
            case 'invoice':
              return (
                <div className={statusVariants({variant: 'invoice'})}>
                  invoice
                </div>
              );
            case 'order-picked':
              return (
                <div className={statusVariants({variant: 'partially_pick'})}>
                  order picked
                </div>
              );
            default:
              break;
          }
        },
      },
    ],
    [],
  );
  return {columns};
}
