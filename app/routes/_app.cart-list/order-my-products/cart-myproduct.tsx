import { DataTable } from '~/components/ui/data-table';
import { useTable } from '~/hooks/useTable';
import CreateGroup from './remove-later-dialogbox';
import { useMyProductColumn } from './use-column';
import { useSubmit } from '@remix-run/react';

export default function MyProducts({ products }: any) {
  const { columns } = useMyProductColumn();
  const { table } = useTable(columns, products);
  console.log("products", products);
  const submit = useSubmit();
  function handleRemoveAllItems() {
    // table.toggleAllPageRowsSelected(false);
  }

  return (
    <div className="flex flex-col w-full bg-white my-product-wrapper">
      <div className="  flex  justify-between md:items-center my-[30px] flex-col gap-4 md:flex-row md:gap-0 items-baseline uppercase mx-6 ">
        <h3>My products</h3>
        <div className="flex gap-2 items-center w-full justify-between md:justify-[unset] md:w-[unset]">
          <div className="flex gap-2">
            <div className="product-remove">
              <CreateGroup
                buttonVariant={
                  table.getSelectedRowModel().rows.length === 0
                    ? 'disabled'
                    : 'danger_dark'
                }
                handleRemoveAllItems={handleRemoveAllItems}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-grey-50 cart-order">
        <DataTable table={table} />
        <button
          className="p-2 mb-2 border rounded"
          onClick={() => {
            const formData = new FormData();
            table.getSelectedRowModel().flatRows.map((item, index) => formData.append(`${index}id`, item.original.productId));
            submit(formData, { method: "PUT" });
          }}
        >
          Update Cart
        </button>
      </div>
    </div >
  );
}
