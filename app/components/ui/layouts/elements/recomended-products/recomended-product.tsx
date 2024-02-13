import {DataTable} from '~/components/ui/data-table';
import {useTable} from '~/hooks/useTable';
import {useMyProductColumn} from './use-column';
import {ProductData} from './productData';
export default function RecomendedProduct() {
  const {columns} = useMyProductColumn();
  const {table} = useTable(columns, ProductData);

  function handleRemoveAllItems() {
    // table.toggleAllPageRowsSelected(false);
  }
  return (
    <div className="bg-white absolute p-4 w-full left-0 max-w-[545px] top-16 shadow-md z-40">
      <h4 className="p-2">Recommended Products</h4>
      <div className=" recommended-product max-h-[352px] overflow-y-scroll">
        <DataTable table={table} />
      </div>
    </div>
  );
}
