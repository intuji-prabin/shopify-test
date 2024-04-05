import {useSubmit} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import {Button} from '~/components/ui/button';
import CreateGroup from '~/routes/_app.place-an-order.list/save-later-dialogbox';
import {Product} from '~/routes/_app.place-an-order.list/place-an-order-list.server';

export function ActionBar({
  productGroupOptions,
  table,
}: {
  table: Table<Product>;
  productGroupOptions: {value: string; label: string}[];
}) {
  const submit = useSubmit();

  const handleAddToCart = () => {
    const formData = new FormData();

    table.getSelectedRowModel().flatRows.map((item) => {
      formData.append(
        `${item.original.productId}_productId`,
        item.original.productId,
      );

      formData.append(
        `${item.original.productId}_variantId`,
        item.original.variantId,
      );

      formData.append(
        `${item.original.productId}_quantity`,
        item.original.quantity.toString(),
      );

      formData.append(`${item.original.productId}_uom`, item.original.uom);

      formData.append('bulkCart', 'true');

      formData.append('_action', 'add_to_cart');

      submit(formData, {method: 'POST'});

      table.resetRowSelection();
    });
  };
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
              table={table}
              productGroupOptions={productGroupOptions}
            />
          </div>
          <Button
            variant={
              table.getSelectedRowModel().rows.length === 0
                ? 'disabled'
                : 'secondary'
            }
            className="min-w-[111px] min-h-10 p-0"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
