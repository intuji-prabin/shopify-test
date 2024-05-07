import {useMemo} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {statusVariants} from '~/components/ui/status';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {EyeOn} from '~/components/icons/eye';
import {formatDateToLocaleDateString} from '~/lib/helpers/dateTime.helper';
import {Separator} from '~/components/ui/separator';

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
        cell: (info) => {
          const ticket = info.row.original;
          return (
            <div className="flex items-center space-x-2">
              <p>{ticket.id}</p>
              <Dialog>
                <DialogTrigger>
                  <EyeOn />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="not-italic text-xl">
                      {ticket.id}
                    </DialogTitle>
                    <Separator className="!my-2" />
                    <div className="grid grid-cols-2 gap-4 justify-start">
                      <div>
                        <h5 className="text-grey-900">Contact Name:</h5>
                        <p className="capitalize">{ticket.contactName}</p>
                      </div>
                      <div>
                        <h5 className="text-grey-900">Department:</h5>
                        <p>{ticket.supportDepartment}</p>
                      </div>
                      <div>
                        <h5 className="text-grey-900">Schedule On:</h5>
                        <p>{formatDateToLocaleDateString(ticket.date)}</p>
                      </div>
                      <div>
                        <h5 className="text-grey-900">Status:</h5>
                        <p className="capitalize">{ticket.status}</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="pt-4 text-grey-900">Reason:</h5>
                      <p>{ticket.description}</p>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
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
            <p className="truncate max-w-56 not-italic text-lg text-grey-900 leading-5.5 font-normal">
              {description}
            </p>
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
        cell: (info) => formatDateToLocaleDateString(info.getValue() as string),
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
