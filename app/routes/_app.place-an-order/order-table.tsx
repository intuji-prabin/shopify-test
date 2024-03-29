import {DataTable} from '~/components/ui/data-table';
import {ProductData} from '~/routes/_app.place-an-order/productData';
import {useTable} from '~/hooks/useTable';
import {TicketsData} from '../_app.notification/tickets-data';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import CreateGroup from './save-later-dialogbox';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';
import {Link} from '@remix-run/react';
import {useMyProductColumn} from './use-column';

export default function OrderTable({
  productGroupOptions,
}: {
  productGroupOptions: {value: string; label: string}[];
}) {
  const {columns} = useMyProductColumn();
  const {table} = useTable(columns, ProductData);

  return (
    <>
      <div className=" container flex  justify-between md:items-center my-[30px] flex-col gap-4 md:flex-row md:gap-0 items-baseline ">
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

      <div className="container cart-order">
        <DataTable table={table} />

        <PaginationWrapper pageSize={5} totalCount={TicketsData.length} />
      </div>
      <button
        className="border rounded p-2 mb-2"
        onClick={() =>
          console.info(
            'table.getSelectedRowModel().flatRows',
            table.getSelectedRowModel().flatRows.map((item) => item.original),
          )
        }
      >
        Log table.getSelectedRowModel().flatRows
      </button>
    </>
  );
}
