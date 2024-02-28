import {useMemo} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {statusVariants} from '~/components/ui/status';

export type TicketColumn = {
  id: string;
  contactName: string;
  description: string;
  supportDepartment: string;
  createdOn: string;
  status: 'pending' | 'in_progress' | 'closed';
};

export function useColumn() {
  const columns = useMemo<ColumnDef<TicketColumn>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Ticket ID.',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'contactName',
        header: 'Contact Name',
        enableSorting: false,
        cell: (info) => {
          const contactName = info.getValue() as string;
          return <div className="capitalize">{contactName}</div>;
        },
      },
      {
        accessorKey: 'description',
        header: 'Reason',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'supportDepartment',
        header: 'Department',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'createdOn',
        header: 'Created On',
        enableSorting: false,
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 'in_progress':
              return (
                <div className={statusVariants({variant: 'awaiting'})}>
                  In Progress
                </div>
              );
            case 'pending':
              return (
                <div className={statusVariants({variant: 'pending'})}>
                  pending
                </div>
              );
            case 'closed':
              return (
                <div className={statusVariants({variant: 'closed'})}>
                  closed
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
