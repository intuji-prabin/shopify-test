import { useSubmit } from '@remix-run/react';
import { Table } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import CreateGroup from '~/routes/_app.place-an-order.list/save-later-dialogbox';
import { Product } from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import { BackButton } from '~/components/ui/back-button';

export function ActionBar({
  productGroupOptions,
  table,
}: {
  table: Table<Product>;
  productGroupOptions: { value: string; label: string }[];
}) {
  const submit = useSubmit();

  const handleAddToCart = () => {
    const formData = new FormData();

    table.getSelectedRowModel().flatRows.map((item, index) => {
      formData.append(
        `${item.original.productId + index}_productId`,
        item.original.productId,
      );

      formData.append(
        `${item.original.productId + index}_variantId`,
        item.original.variantId,
      );

      formData.append(
        `${item.original.productId + index}_quantity`,
        item.original.quantity.toString(),
      );

      formData.append(
        `${item.original.productId + index}_uom`,
        item.original.uom,
      );

      formData.append('bulkCart', 'true');

      formData.append('_action', 'add_to_cart');

      submit(formData, { method: 'POST' });

      table.resetRowSelection();
    });
  };
  return (
    <div className="flex  justify-between lg:items-center my-[30px] flex-col gap-4 lg:flex-row lg:gap-0 items-baseline ">
      <BackButton title='Order List' />
      <div className="flex gap-2 items-center w-full justify-between lg:justify-[unset] lg:w-[unset]">
        <p className="text-lg font-bold leading-[22px] text-grey-900 italic max-w-[281px] lg:max-w-[unset]">
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
