import {useFetcher, useSubmit} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import {useContext, useEffect, useState} from 'react';
import {z} from 'zod';
import {displayToast} from '~/components/ui/toast';
import {
  CART_QUANTITY_ERROR_GEN,
  CART_QUANTITY_MAX,
} from '~/lib/constants/cartInfo.constant';
import {Product} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {
  GroupItem,
  SelectProductContext,
} from '~/routes/_app.pending-order_.$groupId/select-product-context';

export const UpdateGroupSchema = z.object({
  group: z
    .string()
    .trim()
    .min(1, {message: 'Group Name is required'})
    .max(50, {message: 'Group Name is too long'}),
});

/**
 * @description Merge group item with same UOM
 */
function mergeGroupItemWithSameUOM(groupItemList: GroupItem[]) {
  const mergedItem = groupItemList.reduce((accumulator, item) => {
    const key = `${item.productId}-${item.uom}`;
    if (!accumulator[key]) {
      accumulator[key] = {...item};
    } else {
      accumulator[key].quantity += item.quantity;
    }

    return accumulator;
  }, {} as Record<string, GroupItem>);
  return Object.values(mergedItem);
}

export function useSelectedProduct({table}: {table: Table<Product>}) {
  const submit = useSubmit();

  const fetcher = useFetcher();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const [error, setError] = useState({isError: false, message: ''});

  const {selectedProduct, setSelectedProduct} =
    useContext(SelectProductContext);

  const numberOfSelectedRows = Object.keys(
    table.getState().rowSelection,
  ).length;

  const displayQuantityMaxError = () => {
    const isSelectedRowQuanityValid = table
      .getSelectedRowModel()
      .flatRows.some(
        (item) =>
          item.original.quantity > CART_QUANTITY_MAX ||
          item.original.quantity < item.original.moq ||
          isNaN(item.original.quantity) ||
          item.original.quantity % item.original.moq !== 0,
      );

    if (isSelectedRowQuanityValid) {
      displayToast({
        message: CART_QUANTITY_ERROR_GEN,
        type: 'error',
      });
      return true;
    }
    return false;
  };

  const handleAddToCart = () => {
    const isQuanityMaxError = displayQuantityMaxError();

    if (isQuanityMaxError) {
      return;
    }

    const formData = new FormData();

    // selectedProduct.map((item, index) => {
    //   formData.append(`${item.productId + index}_productId`, item.productId);

    //   formData.append(`${item.productId + index}_variantId`, item.variantId!);

    //   formData.append(
    //     `${item.productId + index}_quantity`,
    //     item.quantity.toString(),
    //   );

    //   formData.append(`${item.productId + index}_uom`, item.uom);

    //   formData.append('bulkCart', 'true');

    //   formData.append('_action', 'add_to_cart');

    //   submit(formData, {method: 'POST'});

    //   table.resetRowSelection();
    // });

    table.getSelectedRowModel().flatRows.map((item, index) => {
      formData.append(
        `${item.original.productId + index}_productId`,
        item.original.productId,
      );

      formData.append(
        `${item.original.productId + index}_variantId`,
        item.original.variantId!,
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
      .flatRows.some(
        (item) =>
          item.original.quantity > CART_QUANTITY_MAX ||
          item.original.quantity < item.original.moq ||
          isNaN(item.original.quantity) ||
          item.original.quantity % item.original.moq !== 0,
      );

    if (isRowQuanityValid) {
      displayToast({
        message: CART_QUANTITY_ERROR_GEN,
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

  const handleSaveForLater = () => {
    if (selectedValue === null || selectedValue.trim().length === 0) {
      setError({isError: true, message: 'Group Name is required'});
      return;
    }
    const isQuanityMaxError = displayQuantityMaxError();

    if (isQuanityMaxError) {
      return;
    }

    const groupItemList: GroupItem[] = [];

    selectedProduct.map((item) => {
      groupItemList.push({
        productId: item.productId,
        quantity: item.quantity,
        uom: item.uom,
      });
    });

    const isCreateGroup = Number.isNaN(Number(selectedValue));

    const mergeGroupList = mergeGroupItemWithSameUOM(groupItemList);

    const submitPayload = {
      groupItemList: mergeGroupList,
      submitType: isCreateGroup ? 'create' : 'update',
      group: selectedValue,
    };

    fetcher.submit(
      //@ts-ignore
      submitPayload,
      {method: 'POST', encType: 'application/json'},
    );
  };

  useEffect(() => {
    const selectedRowKeys = Object.keys(table.getState().rowSelection);

    const selectedRow = table
      .getRowModel()
      .flatRows.filter((item) =>
        selectedRowKeys.includes(String(item.original.placeId)),
      )
      .map((item) => item.original);

    setSelectedProduct((prev) => {
      return [...prev, ...selectedRow]
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.placeId === item.placeId),
        )
        .filter((item) => selectedRowKeys.includes(String(item.placeId)));
    });
  }, [table.getState().rowSelection]);

  return {
    fetcher,
    numberOfSelectedRows,
    selectedValue,
    setSelectedValue,
    error,
    setError,
    handleAddToCart,
    handleDelete,
    handleGroupUpdate,
    handleProductUpdate,
    handleSaveForLater,
  };
}
