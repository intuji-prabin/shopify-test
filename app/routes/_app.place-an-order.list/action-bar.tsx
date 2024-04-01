import {Link} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import CreateGroup from './save-later-dialogbox';
import {Product} from './place-an-order-list.server';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';

export function ActionBar({
  productGroupOptions,
  table,
}: {
  table: Table<Product>;
  productGroupOptions: {value: string; label: string}[];
}) {
  return (
    <div className="flex  justify-between md:items-center my-[30px] flex-col gap-4 md:flex-row md:gap-0 items-baseline ">
      <h3>Order List</h3>
      <div className="flex gap-2 items-center w-full justify-between md:justify-[unset] md:w-[unset]">
        <p className="text-lg font-bold leading-[22px] text-grey-900 italic max-w-[281px] md:max-w-[unset]">
          {table.getSelectedRowModel().rows.length === 0
            ? 'Please select items to create a group or add to cart. '
            : `${table.getSelectedRowModel().rows.length} items `}
        </p>

        <div className="flex gap-2">
          <div className="remove-dialogue">
            <CreateGroup
              productGroupOptions={productGroupOptions}
              isDisabled={table.getSelectedRowModel().rows.length === 0}
            />
          </div>
          <Button
            variant={
              table.getSelectedRowModel().rows.length === 0
                ? 'disabled'
                : 'secondary'
            }
            className="min-w-[111px] min-h-10 p-0"
          >
            <Link to={Routes.CART_LIST} className="w-full">
              Add to cart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
