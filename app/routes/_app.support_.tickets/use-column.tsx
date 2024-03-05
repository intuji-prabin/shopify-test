import {useMemo} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {statusVariants} from '~/components/ui/status';
import {TooltipProvider} from '~/components/ui/tooltip';
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from '~/components/ui/hybrid-tooltip';

export type TicketColumn = {
  id: string;
  contactName: string;
  description: string;
  supportDepartment: string;
  date: string;
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
        cell: (info) => {
          const description = info.getValue() as string;
          return (
            <TooltipProvider delayDuration={100}>
              <HybridTooltip>
                <HybridTooltipTrigger className="truncate max-w-56 not-italic text-lg text-grey-900 leading-5.5 font-normal">
                  {description}
                </HybridTooltipTrigger>
                <HybridTooltipContent align="start">
                  <p className="max-w-56 w-auto p-2">{description}</p>
                </HybridTooltipContent>
              </HybridTooltip>
            </TooltipProvider>
          );
        },
      },
      {
        accessorKey: 'supportDepartment',
        header: 'Department',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'date',
        header: 'Schedule On',
        enableSorting: false,
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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
