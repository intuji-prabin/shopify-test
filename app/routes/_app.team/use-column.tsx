import {Form, Link} from '@remix-run/react';
import {ColumnDef} from '@tanstack/react-table';
import {useMemo, useState} from 'react';
import {EditIcon} from '~/components/icons/edit';
import {Button} from '~/components/ui/button';
import {Switch} from '~/components/ui/switch';
import {Routes} from '~/lib/constants/routes.constent';
import DeactivateDialog from '~/routes/_app.team/cell-action';

export type TeamColumn = {
  id: string;
  name: string;
  email: string;
  department: string;
  contactNumber: string;
  status: boolean;
};

export function useColumn() {
  const columns = useMemo<ColumnDef<TeamColumn>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'department',
        header: 'Deparment',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'contactNumber',
        header: 'Contact Number',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.status;
          const customerId = info.row.original.id;
          const [isChecked, setIsChecked] = useState<boolean>(false);
          return (
            <>
              <Form method="post">
                <Switch
                  type="submit"
                  value="activate-customer"
                  checked={status}
                  onCheckedChange={() =>
                    setIsChecked((prevState) => !prevState)
                  }
                />
              </Form>
              <DeactivateDialog
                isOpen={isChecked}
                setIsOpen={setIsChecked}
                customerId={customerId}
              />
            </>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Action',
        enableSorting: false,
        cell: (info) => {
          const teamId = info.row.original.id.split('/').pop();
          return (
            <Link to={`${Routes.TEAM}/${teamId}`}>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="border-grey-50 hover:bg-inherit"
              >
                <EditIcon />
              </Button>
            </Link>
          );
        },
      },
    ],
    [],
  );
  return {columns};
}
