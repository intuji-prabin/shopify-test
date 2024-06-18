import { Link, useFetcher } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo, useState } from 'react';
import { EditIcon } from '~/components/icons/edit';
import PersonIcon from '~/components/icons/person-icon';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { Routes } from '~/lib/constants/routes.constent';
import { AbilityContext } from '~/lib/helpers/Can';
import DeactivateDialog from '~/routes/_app.team/cell-action';

export type TeamColumn = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  department: {
    title: string;
    value: string;
  };
  contactNumber: string;
  status: 'true' | 'false';
};

export function useColumn({ currentUser, isImpersonatingCheck }: { currentUser: string, isImpersonatingCheck: string }) {
  const ability = useContext(AbilityContext);

  const columns = useMemo<ColumnDef<TeamColumn>[]>(
    () => {
      const baseColumns: ColumnDef<TeamColumn>[] = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableSorting: false,
          cell: (info) => {
            const { imageUrl, name, id } = info.row.original;
            const isCurrentUser = currentUser === id;
            const imageSrc =
              imageUrl?.length > 0 ? imageUrl : DEFAULT_IMAGE.DEFAULT;

            return (
              <div>
                <figure className="relative flex items-center space-x-2">
                  <div className="rounded-full min-h-9 min-w-9 w-9 h-9">
                    <img
                      src={imageSrc}
                      alt="profile-image"
                      className="object-cover object-center w-full h-full rounded-full"
                    />
                    {isCurrentUser && (
                      <div className="absolute top-3.5 left-1">
                        <PersonIcon />
                      </div>
                    )}
                  </div>
                  <figcaption className="capitalize">{name}</figcaption>
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
          cell: (info) => {
            const department = info.row.original.department;
            return (
              <p className="capitalize text-grey-900 text-lg leading-5.5">
                {department.title}
              </p>
            );
          },
        },
        {
          accessorKey: 'contactNumber',
          header: 'Contact Number',
          enableSorting: false,
          cell: (info) => info.getValue(),
        },
      ];

      // Conditionally add the "Status" column if the user has the ability to change status
      if (ability.can('view', 'change_status')) {
        baseColumns.push({
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
                {status === 'true' ? (
                  <Switch
                    type="button"
                    disabled={currentUser === customerId}
                    checked={status === 'true'}
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
        });
      }

      // Conditionally add the "Action" column if the user has the ability to update a team
      if (ability.can('view', 'edit_other_profile')) {
        baseColumns.push({
          accessorKey: 'actions',
          header: 'Action',
          enableSorting: false,
          cell: (info) => {
            const teamId = info.row.original.id.split('/').pop();
            return (
              <Link to={currentUser === teamId ? `${Routes.PROFILE}` : `${Routes.TEAM}/${teamId}`}>
                <Button
                  data-cy="edit"
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={`border-grey-50 hover:bg-inherit ${isImpersonatingCheck === "true" && currentUser === teamId ? 'hidden' : 'block'}`}
                >
                  <EditIcon />
                </Button>
              </Link>
            );
          },
        });
      }

      return baseColumns;
    },
    [currentUser, ability], // Include currentUser and ability in the dependencies array
  );

  return { columns };
}
