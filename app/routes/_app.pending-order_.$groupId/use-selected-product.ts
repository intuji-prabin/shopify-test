import {z} from 'zod';
import {useContext, useEffect} from 'react';
import {Table} from '@tanstack/react-table';
import {useFetcher, useSubmit} from '@remix-run/react';
import {displayToast} from '~/components/ui/toast';
import {
  GroupItem,
  SelectProductContext,
} from '~/routes/_app.pending-order_.$groupId/select-product-context';
import {
  Group,
  Product,
} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {
  CART_QUANTITY_ERROR,
  CART_QUANTITY_MAX,
} from '~/lib/constants/cartInfo.constant';

export const UpdateGroupSchema = z.object({
  group: z
    .string()
    .trim()
    .min(1, {message: 'Group Name is required'})
    .max(50, {message: 'Group Name is too long'}),
});

export function useSelectedProduct({
  table,
  group,
}: {
  table: Table<Product>;
  group: Group;
}) {
  const submit = useSubmit();

  const fetcher = useFetcher();

  const {selectedProduct, setSelectedProduct} =
    useContext(SelectProductContext);

  const numberOfSelectedRows = Object.keys(
    table.getState().rowSelection,
  ).length;

  const handleAddToCart = () => {
    const isSelectedRowQuanityValid = selectedProduct.some(
      (item) => item.quantity > CART_QUANTITY_MAX,
    );

    if (isSelectedRowQuanityValid) {
      displayToast({
        message: CART_QUANTITY_ERROR,
        type: 'error',
      });
      return;
    }

    const formData = new FormData();

    selectedProduct.map((item, index) => {
      formData.append(`${item.productId + index}_productId`, item.productId);

      formData.append(`${item.productId + index}_variantId`, item.variantId!);

      formData.append(
        `${item.productId + index}_quantity`,
        item.quantity.toString(),
      );

      formData.append(`${item.productId + index}_uom`, item.uom);

      formData.append('bulkCart', 'true');

      formData.append('_action', 'add_to_cart');

      submit(formData, {method: 'POST'});

      table.resetRowSelection();
    });

    setSelectedProduct([]);
  };

  const handleGroupUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);

    const groupName = formData.get('groupName') as string;

    const result = UpdateGroupSchema.safeParse({
      group: groupName,
    });

    if (!result.success) {
      event.preventDefault();
      displayToast({
        message: result.error.errors[0].message,
        type: 'error',
      });
      return;
    }

    submit(event.currentTarget);
  };

  const handleProductUpdate = () => {
    const isRowQuanityValid = table
      .getRowModel()
      .flatRows.some((item) => item.original.quantity > CART_QUANTITY_MAX);

    if (isRowQuanityValid) {
      displayToast({
        message: CART_QUANTITY_ERROR,
        type: 'error',
      });
      return;
    }

    const groupItemList: GroupItem[] = [];

    table.getRowModel().flatRows.map((item) => {
      groupItemList.push({
        productId: item.original.productId,
        quantity: item.original.quantity,
        uom: item.original.uom,
        placeId: item.original.placeId,
      });
    });

    fetcher.submit(
      //@ts-ignore
      groupItemList,
      {method: 'POST', encType: 'application/json'},
    );
  };

  const handleDelete = () => {
    const formData = new FormData();

    selectedProduct.map((product) =>
      formData.append('placeId', String(product.placeId)),
    );

    formData.append('_action', 'delete_product');

    submit(formData, {
      method: 'POST',
    });

    table.resetRowSelection();
    setSelectedProduct([]);
  };

  useEffect(() => {
    const selectedRowKeys = Object.keys(table.getState().rowSelection);

    const selectedRow = group.products.filter((row) =>
      selectedRowKeys.includes(row['productId']),
    );

    setSelectedProduct((prev) => {
      return [...prev, ...selectedRow]
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.productId === item.productId),
        )
        .filter((item) => selectedRowKeys.includes(item.productId));
    });
  }, [table.getState().rowSelection]);

  return {
    fetcher,
    numberOfSelectedRows,
    handleAddToCart,
    handleDelete,
    handleGroupUpdate,
    handleProductUpdate,
  };
}
