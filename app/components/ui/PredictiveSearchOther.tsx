import {Form, useSubmit} from '@remix-run/react';
import React from 'react';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {Can} from '~/lib/helpers/Can';
import {Button} from './button';
import {InputQuantityError} from './inputQuantity';
import {PredictiveProductDetail} from './predictiveSearchDetail';
import {PredictiveSearchQtyBtn} from './predictiveSearchQtyBtn';

export const PredictiveSearchOther = ({
  product,
  handleClose,
  quantity,
  setQuantity,
  UOM,
  handleUOM,
  actionType,
}: {
  product: any;
  handleClose: any;
  quantity: number;
  setQuantity: any;
  UOM: string;
  handleUOM: any;
  actionType: string;
}) => {
  const submit = useSubmit();
  const isCart = actionType === 'cart';
  return (
    <div
      key={product.id}
      className="flex flex-col items-center justify-between gap-4 pb-4 border-b last:border-0 xl:flex-row"
    >
      <div className="flex flex-wrap items-center w-full gap-3 xl:w-2/5">
        <PredictiveProductDetail product={product} handleClose={handleClose} />
      </div>
      {product?.price ? (
        <div className="grid gap-x-4 w-full gap-y-2 grid-cols-1 md:grid-cols-3 xl:w-[calc(60%_-_1rem)] items-end">
          <div>
            <p className="md:mb-2 font-medium">Quantity</p>
            <div className="flex cart__list--quantity">
              <PredictiveSearchQtyBtn
                moq={product.moq}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            </div>
          </div>
          <div>
            <p className="md:mb-2 font-medium">Unit of Measure</p>
            <select
              name="filter_by"
              className="w-full min-w-[120px] place-order !border-grey-500 filter-select !py-[9px]"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleUOM(e.target.value)
              }
              defaultValue={UOM}
            >
              {product.unitOfMeasure?.length > 0 ? (
                product.unitOfMeasure?.map(
                  (uom: {unit: string; code: string}, index: number) => (
                    <option
                      className="px-4"
                      value={uom.code}
                      key={index + 'uom'}
                    >
                      {uom.unit}
                    </option>
                  ),
                )
              ) : (
                <option value={UOM}>{product.defaultUomValue}</option>
              )}
            </select>
          </div>
          {isCart ? (
            <Can I="view" a="add_to_cart">
              <Form
                method="POST"
                action="/predictive-search"
                onSubmit={(event) => {
                  submit(event.currentTarget);
                  handleClose();
                }}
                className="w-full"
              >
                <input type="hidden" name="productId" value={product?.id} />
                <input
                  type="hidden"
                  name="productVariantId"
                  value={product?.variantId}
                />
                <input type="hidden" name="quantity" value={quantity} />
                <input type="hidden" name="selectUOM" value={UOM} />
                <InputQuantityError
                  quantity={quantity}
                  moq={product.moq}
                  className="text-sm pb-1.5 !pt-0"
                />
                <Button
                  className={`w-full ${
                    quantity < product.moq ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity) ||
                    quantity % product.moq !== 0
                      ? 'cursor-not-allowed text-grey-400 !bg-grey-200'
                      : 'cursor-pointer'
                  }`}
                  disabled={
                    quantity < product.moq ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity) ||
                    quantity % product.moq !== 0
                  }
                  type={
                    quantity < product.moq ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity) ||
                    quantity % product.moq !== 0
                      ? 'button'
                      : 'submit'
                  }
                  variant="primary"
                >
                  Add to cart
                </Button>
              </Form>
            </Can>
          ) : (
            <Form
              method="POST"
              onSubmit={(event) => {
                submit(event.currentTarget);
                handleClose();
              }}
              className="w-full"
            >
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="quantity" value={quantity} />
              <input type="hidden" name="uom" value={UOM} />
              <InputQuantityError
                quantity={quantity}
                moq={product.moq}
                className="text-sm pb-1.5 !pt-0"
              />
              <Button
                className={`w-full ${
                  quantity < product.moq ||
                  quantity > CART_QUANTITY_MAX ||
                  isNaN(quantity) ||
                  quantity % product.moq !== 0
                    ? 'cursor-not-allowed text-grey-400 !bg-grey-200'
                    : 'cursor-pointer'
                }`}
                disabled={
                  quantity < product.moq ||
                  quantity > CART_QUANTITY_MAX ||
                  isNaN(quantity) ||
                  quantity % product.moq !== 0
                }
                type={
                  quantity < product.moq ||
                  quantity > CART_QUANTITY_MAX ||
                  isNaN(quantity) ||
                  quantity % product.moq !== 0
                    ? 'button'
                    : 'submit'
                }
                variant="primary"
                name="_action"
                value="add_product"
              >
                Add to List
              </Button>
            </Form>
          )}
        </div>
      ) : null}
    </div>
  );
};
