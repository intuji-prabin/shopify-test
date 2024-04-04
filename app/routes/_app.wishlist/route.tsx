import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSubmit,
} from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { useTable } from '~/hooks/useTable';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import { getMessageSession, messageCommitSession, setErrorMessage, setSuccessMessage } from '~/lib/utils/toast-session.server';
import { BulkTable } from '../_app.cart-list/order-my-products/bulk-table';
import { addProductToCart } from '../_app.product_.$productSlug/product.server';
import { addedBulkCart } from './bulk.cart.server';
import { useMyWishListColumn } from './wishlist';
import { getWishlist, removeBulkFromWishlist } from './wishlist.server';
import useSort from '~/hooks/useSort';
import { displayToast } from '~/components/ui/toast';
import { Routes } from '~/lib/constants/routes.constent';

export interface WishListResponse {
  productId: string;
  productHandle: string;
  variantId: string;
  title: string;
  sku: string;
  stockCode: string;
  moq: number | null;
  quantity: number | null;
  uom: string;
  uomName: string;
  unitOfMeasure: UnitOfMeasure[];
  defaultPrice: number;
  companyPrice: number;
  currency: string;
  priceRange: PriceRange[];
  featuredImage?: string;
}
export interface PriceRange {
  minQty: number;
  maxQty: number | null;
  price: number;
}
export interface UnitOfMeasure {
  unit: string;
  code: string;
  conversionFactor: number;
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const items = await getWishlist(request);
  return json({ items });
};

export const action = async ({ request, context }: LoaderFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  const formData = await request.formData();
  try {
    switch (request.method) {
      case 'POST':
        try {
          const cartInfo = Object.fromEntries(formData);
          const accessTocken = (await getAccessToken(context)) as string;
          if (cartInfo?.bulkCart && cartInfo?.bulkCart == "true") {
            const bulkCart = await addedBulkCart(cartInfo, context, accessTocken, request)
          } else {
            const addToCart = await addProductToCart(
              cartInfo,
              accessTocken,
              context,
              request,
            );
          }
          // return true
          setSuccessMessage(messageSession, 'Item added to cart successfully');
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        } catch (error) {
          if (error instanceof Error) {
            console.log('this is err', error?.message);
            setErrorMessage(messageSession, error?.message);
            return json(
              {},
              {
                headers: [
                  ['Set-Cookie', await context.session.commit({})],
                  ['Set-Cookie', await messageCommitSession(messageSession)],
                ],
              },
            );
          }
          setErrorMessage(
            messageSession,
            'Item not added to cart. Please try again later.',
          );
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
      case 'DELETE':
        const productInfo = Object.fromEntries(formData);
        try {
          const productInfo = Object.fromEntries(formData);
          await removeBulkFromWishlist(productInfo, context, request);
          setSuccessMessage(messageSession, 'Item removed from wishlist successfully');
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        } catch (error) {
          if (error instanceof Error) {
            console.log('this is err', error?.message);
            setErrorMessage(messageSession, error?.message);
            return json(
              {},
              {
                headers: [
                  ['Set-Cookie', await context.session.commit({})],
                  ['Set-Cookie', await messageCommitSession(messageSession)],
                ],
              },
            );
          }
          console.log('this is err');
          setErrorMessage(
            messageSession,
            'Item not removed from the wishlist. Please try again later.',
          );
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(' errerdf ', error?.message);
    }
    console.log(' errerdf ');
  }

}

export default function route() {
  const { columns } = useMyWishListColumn();
  const { items } = useLoaderData<typeof loader>();
  const finalWishList = useSort({ items });
  const { table } = useTable(columns, finalWishList);
  const submit = useSubmit();
  let canSubmit = true;

  return (
    <div className="container">
      {finalWishList.length > 0 ?
        <div className='pt-6'>
          <div className='flex justify-between'>
            <h3>Wishlist</h3>
            {table.getSelectedRowModel().rows.length > 0 &&
              <div className='flex items-center gap-2'>
                <p className='text-lg italic font-bold'>{table.getSelectedRowModel().rows.length} item selected</p>
                <Button
                  variant='primary'
                  onClick={() => {
                    const formData = new FormData();
                    table
                      .getSelectedRowModel()
                      .flatRows.map((item) => {
                        formData.append(
                          `${item.original.productId}_productId`,
                          item.original.productId,
                        )
                        formData.append(
                          `${item.original.productId}_variantId`,
                          item.original.variantId,
                        )
                        formData.append(
                          `${item.original.productId}_quantity`,
                          item.original.quantity,
                        )
                        formData.append(
                          `${item.original.productId}_moq`,
                          item.original.moq,
                        )
                        formData.append(
                          `${item.original.productId}_uom`,
                          item.original.uom,
                        )
                        formData.append(
                          `bulkCart`,
                          "true",
                        )
                        const quantityVal = formData.get(`${item.original.productId}_quantity`);
                        const moqVal = formData.get(`${item.original.productId}_moq`);
                        if (quantityVal && moqVal && quantityVal < moqVal) {
                          canSubmit = false;
                          displayToast({ message: "Please select quantity to be greater than MOQ", type: "error" });
                        }
                      },
                      );
                    { canSubmit ? submit(formData, { method: 'POST' }) : null }
                    table.resetRowSelection();
                  }}
                >
                  Add all to cart
                </Button>
                <Button
                  variant='danger_dark'
                  onClick={() => {
                    const formData = new FormData();
                    table
                      .getSelectedRowModel()
                      .flatRows.map((item, index) => {
                        console.log('"rererwer "', item)
                        formData.append(
                          `wishList-${index}`,
                          item.original.productId,
                        )
                      },
                      );
                    submit(formData, { method: 'DELETE' });
                    table.resetRowSelection();
                  }}
                >
                  Remove
                </Button>
              </div>
            }
          </div>
          <section className='data__table'>
            <DataTable
              table={table}
              renderSubComponent={renderSubComponent}
            />
          </section>
        </div>
        :
        <div className='py-80'>
          <div className='flex justify-center'>
            <div className='text-center'>
              <h3 className='mb-2'>Your wishlist is empty</h3>
              <p className='mb-10 text-lg'>Create your first wishlist</p>
              <Link className='inline-block px-6 py-2 text-sm font-bold leading-6 italic uppercase text-neutral-white bg-primary-500 hover:bg-primary-600 disabled:bg-grey-50' to={Routes.CATEGORIES}>Add items</Link>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="container pt-6">
        <div className="min-h-[400px] flex justify-center items-center ">
          <div className="flex flex-col items-center gap-2">
            <h3>Error has occured</h3>
            <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

const renderSubComponent = ({ row }: any) => {
  return (
    <BulkTable
      product={row.original.priceRange}
      quantity={'Quantity'}
      price={'Price'}
    />
  );
};
