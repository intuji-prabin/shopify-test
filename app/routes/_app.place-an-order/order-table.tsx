import {DataTable} from '~/components/ui/data-table';
import {useColumn} from '~/routes/_app.place-an-order/use-column';
import {ProductData} from '~/routes/_app.place-an-order/productData';
import {useTable} from '~/hooks/useTable';
import {TicketsData} from '../_app.support_.tickets/tickets-data';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';

export default function OrderTable() {
  const {columns} = useColumn();
  const {table} = useTable(columns, ProductData);
  return (
    <>
      <div className="container">
        <DataTable table={table} />

        {/* pagination starts here */}
        <div className="bg-neutral-white py-4 px-6 border-t flex items-center justify-between">
          <p className="w-40 text-grey-400 font-medium">
            1-7 of {TicketsData.length} Items
          </p>
          <PaginationWrapper pageSize={5} totalCount={TicketsData.length} />
        </div>
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
