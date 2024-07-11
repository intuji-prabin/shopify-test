import { useState } from 'react';
import { Form } from '@remix-run/react';
import { Table } from '@tanstack/react-table';
import { Done } from '~/components/icons/done';
import { Button } from '~/components/ui/button';
import { BackButton } from '~/components/ui/back-button';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { DeleteGroupModal } from '~/routes/_app.pending-order_.$groupId/delete-group-modal';
import { DeleteProductModal } from '~/routes/_app.pending-order_.$groupId/delete-product-modal';
import { useSelectedProduct } from '~/routes/_app.pending-order_.$groupId/use-selected-product';
import {
  Group,
  Product,
} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {
  Cancel,
  CircleInformationMajor,
  EditItems,
} from '~/components/icons/orderStatus';
import { Can } from '~/lib/helpers/Can';

export function ActionBar({
  table,
  isProductUpdate,
  setIsProductUpdate,
  group,
}: {
  table: Table<Product>;
  isProductUpdate: boolean;
  setIsProductUpdate: any;
  group: Group;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    fetcher,
    numberOfSelectedRows,
    handleAddToCart,
    handleDelete,
    handleGroupUpdate,
    handleProductUpdate,
  } = useSelectedProduct({
    table,
  });

  return (
    <div className="flex justify-between md:items-center my-[30px] flex-col gap-4 md:flex-row md:gap-0 items-baseline ">
      <div className="flex flex-col items-baseline gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center">
          <BackButton title="" />
          <div
            className={`${isEditing
              ? 'bg-primary-25 border border-primary-500 hover:bg-primary-25 '
              : 'border-none'
              }`}
          >
            {isEditing ? (
              <Form
                method="POST"
                className="flex items-center p-2"
                onSubmit={(event) => {
                  handleGroupUpdate(event);
                  setIsEditing(false);
                }}
              >
                <input
                  type="text"
                  name="groupName"
                  defaultValue={group.groupName}
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
                <h3 className="capitalize whitespace-nowrap">
                  {group.groupName}
                </h3>
                <button onClick={() => setIsEditing(true)}>
                  <EditItems />
                </button>
                <DeleteGroupModal groupName={group.groupName} />
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
        <p className="text-lg text-nowrap font-bold leading-[22px] text-grey-900 italic max-w-[281px] md:max-w-[unset]">
          {numberOfSelectedRows === 0
            ? ' '
            : `${numberOfSelectedRows} ${numberOfSelectedRows > 1 ? 'Items' : 'Item'} selected `}
        </p>

        <div className={`flex gap-2 ${numberOfSelectedRows ? 'w-full' : ''}`}>
          {isProductUpdate && (
            <Button
              disabled={fetcher.state === 'submitting'}
              variant={!isProductUpdate ? 'disabled' : 'primary'}
              onClick={() => {
                setIsProductUpdate(false);
                handleProductUpdate();
              }}
            >
              update
            </Button>
          )}
          <Can I="view" a="add_group_to_cart">
            <Button
              variant={numberOfSelectedRows === 0 ? 'disabled' : 'primary'}
              className="min-w-[111px] min-h-10 p-0"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          </Can>
          <DeleteProductModal
            handleDelete={handleDelete}
            numberOfSelectedRows={numberOfSelectedRows}
          />
        </div>
      </div>
    </div>
  );
}
