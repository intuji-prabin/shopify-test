import {ColumnDef} from '@tanstack/react-table';
import * as React from 'react';
import {Button} from '~/components/ui/button';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';
import {
  ItemsColumn,
  ProductMeasurement,
  ProductTotal,
  QuantityColumn,
  UnitPrice,
} from '../_app.cart-list/order-my-products/use-column';
import {Form, useSubmit} from '@remix-run/react';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {AbilityContext, Can} from '~/lib/helpers/Can';
import {useContext} from 'react';
import {getProductPriceByQty} from '../_app.product_.$productSlug/product-detail';

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
            const currencySymbol = product.currencySymbol;
            const quantity = product?.quantity;
            const finalUOM = product?.uom;
            const priceRange = product?.priceRange;
            const uomRange = product?.unitOfMeasure;
            const defaultUom = product?.defaultUOM;
            const currency = product?.currency;
            const companyPrice = product?.companyPrice;
            const unitPrice = product?.unitPrice;
            const discount = product?.discountMessage;
            const prices = getProductPriceByQty({
              qty: quantity,
              uomList: uomRange,
              selectedUOM: finalUOM,
              defaultUom: defaultUom,
              priceRange,
              companyDefaultPrice: companyPrice,
            });
            const priceBeforeDiscount = getProductPriceByQty({
              qty: quantity,
              uomList: uomRange,
              selectedUOM: finalUOM,
              defaultUom: defaultUom,
              priceRange,
              companyDefaultPrice: unitPrice,
            });
            const finalUnitPrice = priceBeforeDiscount / quantity;
            const finalCompanyUsedPrice = prices / quantity;
            return (
              <UnitPrice
                currency={currency}
                currencySymbol={currencySymbol}
                priceRange={priceRange}
                finalUnitPrice={finalUnitPrice}
                unitPrice={unitPrice}
                companyPrice={finalCompanyUsedPrice}
                discount={discount}
              />
            );
          },
        },
        {
          accessorKey: 'total',
          header: 'Total Price',
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
            const unitPrice = product?.unitPrice;
            return (
              <ProductTotal
                totalPrice={productTotal}
                quantity={quantity}
                UOM={UOM}
                unitOfMeasure={product.unitOfMeasure}
                defaultUOM={product.defaultUOM}
                priceRange={priceRange}
                currencySymbol={currencySymbol}
                isBulkDetailVisible={info?.row?.getIsExpanded()}
                setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
                isRowChecked={info?.row?.getIsSelected()}
                currency={info.row.original.currency || '$'}
                discount={product?.discountMessage}
                discountStatus={discountStatus}
                unitPrice={unitPrice}
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
