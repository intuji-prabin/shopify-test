import {useState} from 'react';
import {Form, Link, useFetcher, useSubmit} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import {Done} from '~/components/icons/done';
import {Button} from '~/components/ui/button';
import {BackButton} from '~/components/ui/back-button';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {DeleteGroupModal} from '~/routes/_app.pending-order_.$groupId/delete-group-modal';
import {Product} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {DeleteProductModal} from '~/routes/_app.pending-order_.$groupId/delete-product-modal';
import {
  Cancel,
  CircleInformationMajor,
  EditItems,
} from '~/components/icons/orderStatus';

export interface GroupItem {
  placeId: number;
  productId: string;
  quantity: number;
  uom: number;
}

export function ActionBar({
  table,
  isProductUpdate,
  groupName,
}: {
  groupName: string;
  table: Table<Product>;
  isProductUpdate: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const submit = useSubmit();

  const fetcher = useFetcher();

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

      submit(formData, {method: 'POST'});

      table.resetRowSelection();
    });
  };

  const handleUpdate = () => {
    const groupItemList: GroupItem[] = [];

    table.getRowModel().flatRows.map((item) => {
      groupItemList.push({
        productId: item.original.productId,
        quantity: item.original.quantity,
        uom: Number(item.original.uom),
        placeId: item.original.placeId,
      });
    });

    fetcher.submit(
      //@ts-ignore
      groupItemList,
      {method: 'POST', encType: 'application/json'},
    );
  };

  return (
    <div className="flex justify-between md:items-center my-[30px] flex-col gap-4 md:flex-row md:gap-0 items-baseline ">
      <div className="flex items-baseline gap-4  flex-col sm:flex-row sm:items-center">
        <div className="flex items-center">
          <BackButton title="" />
          <div
            className={`${
              isEditing
                ? 'bg-primary-25 border border-primary-500 hover:bg-primary-25 '
                : 'border-none'
            }`}
          >
            {isEditing ? (
              <Form
                method="POST"
                className="flex items-center p-2"
                onSubmit={() => {
                  setIsEditing(false);
                }}
              >
                <input
                  type="text"
                  name="groupName"
                  defaultValue={groupName}
                  className="border-none hover:bg-primary-25 bg-primary-25 text-grey-900 font-bold leading-[36px] text-[30px] italic max-w-[204px] focus:bg-primary-25 !p-0"
                />
                <button type="submit" name="_action" value="update_group">
                  <Done />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border-l border-grey-200"
                >
                  <Cancel />
                </button>
              </Form>
            ) : (
              <div className="flex items-center gap-4">
                <h3 className="whitespace-nowrap">{groupName}</h3>
                <button onClick={() => setIsEditing(true)}>
                  <EditItems />
                </button>
                <DeleteGroupModal groupName={groupName} />
              </div>
            )}
          </div>
        </div>

        <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3 '>
          <CircleInformationMajor />
          <AlertDescription className="text-base !translate-y-0 !pl-6">
            Only 300 items can be added in a group
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex gap-2 items-center w-full justify-between md:justify-[unset] md:w-[unset]">
        <p className="text-lg font-bold leading-[22px] text-grey-900 italic max-w-[281px] md:max-w-[unset]">
          {table.getSelectedRowModel().rows.length === 0
            ? ' '
            : `${table.getSelectedRowModel().rows.length} items selected `}
        </p>

        <div
          className={`flex gap-2 ${
            table.getSelectedRowModel().rows.length === 0 ? 'w-full' : ''
          }`}
        >
          <Button
            disabled={fetcher.state === 'submitting'}
            variant={!isProductUpdate ? 'disabled' : 'primary'}
            onClick={handleUpdate}
          >
            update
          </Button>
          <Button
            variant={
              table.getSelectedRowModel().rows.length === 0
                ? 'disabled'
                : 'primary'
            }
            className="min-w-[111px] min-h-10 p-0"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
          <DeleteProductModal table={table} />
        </div>
      </div>
    </div>
  );
}
