import {ColumnDef} from '@tanstack/react-table';
import * as React from 'react';
import {Button} from '~/components/ui/button';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';
import {
  ItemsColumn,
  ProductMeasurement,
  ProductTotal,
  QuantityColumn,
} from '../_app.cart-list/order-my-products/use-column';
import {Form, useSubmit} from '@remix-run/react';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {AbilityContext, Can} from '~/lib/helpers/Can';
import {useContext} from 'react';

export function useMyWishListColumn() {
  const submit = useSubmit();
  const ability = useContext(AbilityContext);

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => {
      const baseColumns: ColumnDef<any>[] = [
        {
          id: 'select',
          header: ({table}) => (
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          ),
          cell: ({row}) => (
            <div className="px-1">
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          ),
        },
        {
          accessorKey: 'items',
          header: 'Items',
          enableSorting: false,
          cell: (info) => {
            const product = info.row.original;
            const warehouse = info.row.original.warehouse;
            return (
              <ItemsColumn
                title={product?.title}
                sku={product?.sku}
                featuredImage={product?.featuredImage}
                moq={product?.moq || 1}
                handle={product?.productHandle}
                inventory={product.inventory}
                warehouse={warehouse}
              />
            );
          },
        },
        {
          accessorKey: 'unitPrice',
          header: 'Unit Price',
          enableSorting: false,
          cell: (info) => {
            const product = info.row.original;
            const currencySymbol = info.row.original.currencySymbol;
            return (
              <p className="text-grey-900 text-lg leading-5.5 italic">
                {product?.currency}&nbsp;
                {currencySymbol}
                {product.companyPrice}
              </p>
            );
          },
        },
        {
          accessorKey: 'total',
          header: 'Price',
          enableSorting: false,
          cell: (info) => {
            const productTotal = info?.row?.original?.companyPrice;
            const priceRange = info?.row?.original?.priceRange;
            const quantity = info.row.original.quantity;
            const product = info?.row?.original;
            const UOM = info?.row?.original?.uom;
            const currencySymbol = info.row.original.currencySymbol;
            const discountStatus =
              info.row.original.type3DiscountPriceAppliedStatus;
            return (
              <ProductTotal
                totalPrice={productTotal}
                quantity={quantity}
                UOM={UOM}
                unitOfMeasure={product?.unitOfMeasure}
                defaultUOM={product?.uom}
                priceRange={priceRange}
                isBulkDetailVisible={info?.row?.getIsExpanded()}
                setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
                isRowChecked={info?.row?.getIsSelected()}
                currency={product?.currency || '$'}
                currencySymbol={currencySymbol}
                discountStatus={discountStatus}
              />
            );
          },
        },
        {
          accessorKey: 'quantity',
          header: 'Quantity',
          enableSorting: false,
          cell: (info) => {
            const product = info?.row?.original;
            return (
              <QuantityColumn
                quantity={product?.quantity}
                info={info}
                productId={product?.productId}
                variantId={product?.variantId}
                moq={product?.moq || 1}
              />
            );
          },
        },
        {
          accessorKey: 'uom',
          header: 'UOM',
          enableSorting: false,
          cell: (info) => {
            const product = info?.row?.original;
            return (
              <ProductMeasurement
                uom={product?.uom}
                unitOfMeasure={product?.unitOfMeasure}
                info={info}
                selectedUOMName={product?.uomName}
              />
            );
          },
        },
      ];

      // Conditionally add the "Total" column if the user has the ability
      if (ability.can('view', 'add_wishlist_to_cart')) {
        baseColumns.push({
          accessorKey: 'action',
          header: 'Action',
          enableSorting: false,
          cell: (info) => {
            const product = info?.row?.original;
            return (
              <Can I="view" a="add_wishlist_to_cart" passThrough>
                {(allowed) => (
                  <Form
                    method="POST"
                    onSubmit={(event) => {
                      submit(event.currentTarget);
                    }}
                    className="w-full"
                  >
                    <input
                      type="hidden"
                      name="productId"
                      value={product.productId}
                    />
                    <input
                      type="hidden"
                      name="productVariantId"
                      value={product.variantId}
                    />
                    <input
                      type="number"
                      className="hidden"
                      name="quantity"
                      value={product.quantity || product.moq || 1}
                    />
                    <input type="hidden" name="selectUOM" value={product.uom} />

                    <Button
                      className={`uppercase flex-grow max-h-[unset] text-xs lg:max-h-[28px] min-w-[86px] text-nowrap
                         ${
                           !allowed ||
                           product?.quantity > CART_QUANTITY_MAX ||
                           isNaN(product?.quantity)
                             ? 'cursor-not-allowed'
                             : null
                         }`}
                      variant="primary"
                      disabled={
                        !allowed ||
                        product?.quantity > CART_QUANTITY_MAX ||
                        isNaN(product?.quantity)
                      }
                    >
                      Add to cart
                    </Button>
                  </Form>
                )}
              </Can>
            );
          },
        });
      }

      return baseColumns;
    },
    [ability], // Include ability in the dependencies array
  );

  return {columns};
}
