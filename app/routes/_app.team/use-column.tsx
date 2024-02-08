import {Form, Link, useFetcher} from '@remix-run/react';
import {ColumnDef} from '@tanstack/react-table';
import {useMemo, useState} from 'react';
import {EditIcon} from '~/components/icons/edit';
import PersonIcon from '~/components/icons/person-icon';
import {Button} from '~/components/ui/button';
import {Switch} from '~/components/ui/switch';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {Routes} from '~/lib/constants/routes.constent';
import DeactivateDialog from '~/routes/_app.team/cell-action';

export type TeamColumn = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  department: string;
  contactNumber: string;
  status: boolean;
};

export function useColumn({currentUser}: {currentUser: string}) {
  const columns = useMemo<ColumnDef<TeamColumn>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: false,
        cell: (info) => {
          const {imageUrl, name, id} = info.row.original;
          const isCurrentUser = currentUser === id;
          const imageSrc =
            imageUrl.length > 0 ? imageUrl : DEFAULT_IMAGE.DEFAULT;

          return (
            <div>
              <figure className="flex items-center space-x-2 relative">
                <div className="min-h-9 min-w-9 w-9 h-9 rounded-full">
                  <img
                    src={imageSrc}
                    alt="profile-image"
                    className="w-full h-full rounded-full object-cover object-center"
                  />
                  {isCurrentUser && (
                    <div className="absolute top-3.5 left-1">
                      <PersonIcon />
                    </div>
                  )}
                </div>
                <figcaption>{name}</figcaption>
              </figure>
            </div>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
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

          const fetcher = useFetcher();

          const [isChecked, setIsChecked] = useState<boolean>(false);
          return (
            <>
              {status ? (
                <Switch
                  type="button"
                  checked={status}
                  onCheckedChange={() =>
                    setIsChecked((prevState) => !prevState)
                  }
                />
              ) : (
                <fetcher.Form
                  method="POST"
                  onChange={(event) => fetcher.submit(event.currentTarget)}
                >
                  <input type="hidden" name="customerId" value={customerId} />
                  <Switch type="submit" name="_action" value="activate" />
                </fetcher.Form>
              )}
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
