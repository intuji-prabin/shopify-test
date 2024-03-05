import {useTable} from '~/hooks/useTable';
import {DataTable} from '~/components/ui/data-table';
import {useMyProductColumn} from './use-column';
import {ProductData} from './productData';
import CreateGroup from './remove-later-dialogbox';
export default function MyProducts( { products } : any) {
  const {columns} = useMyProductColumn();
  const {table} = useTable(columns, ProductData);
  function handleRemoveAllItems() {
    // table.toggleAllPageRowsSelected(false);
  }
  return (
    <>
      <div className=" flex flex-col bg-white w-full my-product-wrapper">
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

        <div className=" border-grey-50 border-t cart-order">
          <DataTable table={table} />
        </div>
      </div>
    </>
  );
}
