import { Form, Link, useSubmit } from '@remix-run/react';
import { ProductLoveRed, ProductLoveWhite } from '~/components/icons/orderStatus';
import { Button } from '~/components/ui/button';
import { Price } from './price';
import {
  ProductList,
  Variants,
} from '~/routes/_app.category_.$mainCategorySlug_.($categorySlug)_.($subCategorySlug)/route';
import { Can } from '~/lib/helpers/Can';
import { PRODUCT_MAX_PRICE } from '~/lib/constants/cartInfo.constant';

export function ProductCard({
  id,
  title,
  handle,
  stockCode,
  uom,
  variants,
  featuredImageUrl,
  volumePrice,
  companyPrice,
  currency,
  defaultPrice,
  liked,
  imageBackgroundColor,
  currencySymbol
}: ProductList) {
  return (
    <div className="bg-white single-product-card">
      <div className="relative h-full">
        <ProductCardImage
          volumePrice={volumePrice}
          liked={liked}
          featuredImageUrl={featuredImageUrl}
          imageBackgroundColor={imageBackgroundColor ?? ''}
          id={id}
          visibility={companyPrice && companyPrice < PRODUCT_MAX_PRICE ? true : false}
          handle={handle}
        />
        <ProductCardInfo
          sku={variants?.sku}
          productName={title}
          companyPrice={companyPrice}
          defaultPrice={defaultPrice}
          currency={currency}
          handle={handle}
          id={id}
          uom={uom}
          productVariantId={variants?.id}
          moq={variants?.moq}
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
}

export function ProductCardInfo({
  sku,
  productName,
  defaultPrice,
  companyPrice,
  handle,
  id,
  uom,
  productVariantId,
  moq,
  currency,
  currencySymbol
}: Pick<
  ProductList,
  'defaultPrice' | 'companyPrice' | 'handle' | 'id' | 'uom' | 'currency' | 'currencySymbol'
> &
  Pick<Variants, 'moq' | 'sku'> & { productName: string } & {
    productVariantId: string;
  }) {
  console.log("currencySymbol", currencySymbol)
  return (
    <div className="p-4">
      <div className="sm:pb-14">
        <div>
          <p className="text-base font-medium text-primary-500 sku">
            SKU:&nbsp;{(sku && sku) || 'N/A'}
          </p>
          <Can I="view" a="view_product_detail" passThrough>
            {(allowed) => (
              <h5 className="h-12 text-lg italic font-bold leading-6 whitespace-normal text-grey-900 line-clamp-2 text-ellipsis">
                {allowed ? (
                  <Link to={`/product/${handle}`} title={productName}>
                    {productName}
                  </Link>
                ) : (
                  <span>{productName}</span>
                )}
              </h5>
            )}
          </Can>

          <p className="text-sm text-grey-300">Minimum Order Quantity: {moq}</p>
        </div>
        <Can I="view" a="view_product_price">
          <div className="pt-2">
            <Price currency={currency} price={companyPrice} originalPrice={companyPrice} currencySymbol={currencySymbol} />
            <div className="pt-3 mb-3 border-b border-solid border-grey-50"></div>
            <Price currency={currency} price={companyPrice && companyPrice < PRODUCT_MAX_PRICE ? defaultPrice : 0} originalPrice={companyPrice && companyPrice < PRODUCT_MAX_PRICE ? defaultPrice : 0} variant="rrp" currencySymbol={currencySymbol} />
          </div>
        </Can>
        <div className="sm:absolute bottom-4 inset-x-4">
          <ProductCardButtons
            handle={handle}
            id={id}
            uom={uom}
            moq={moq}
            productVariantId={productVariantId}
            visibility={companyPrice && companyPrice < PRODUCT_MAX_PRICE ? true : false}
          />
        </div>
      </div>
    </div>
  );
}

function ProductCardImage({
  featuredImageUrl,
  volumePrice,
  liked,
  imageBackgroundColor,
  id,
  visibility,
  handle
}: Pick<
  ProductList,
  'featuredImageUrl' | 'volumePrice' | 'liked' | 'imageBackgroundColor' | 'id' | 'handle'
> & { visibility: boolean }) {
  return (
    <div
      className={`relative px-11 py-[39px] flex justify-center border-grey-25 border-b-2 border-x-0 border-top-0 ${imageBackgroundColor ? `bg-[${imageBackgroundColor}]` : ''
        }`}
    >
      {volumePrice && (
        <div className="bg-secondary-500 px-2 py-1 text-grey-900 uppercase absolute top-0 left-0 text-base italic font-normal leading-[19px]">
          QTY Buy Available
        </div>
      )}
      <Can I="view" a="add_to_wishlist">
        {visibility &&
          <Form method={liked ? 'DELETE' : 'POST'} className="flex">
            <input type="hidden" name="productId" value={id} />
            <button
              className="absolute top-2 right-2"
              value={liked ? 'removeFromWishList' : 'addToWishList'}
              name="action"
            >
              {liked ? <ProductLoveRed /> : <ProductLoveWhite />}
            </button>
          </Form>
        }
      </Can>
      <figure className="mt-3">
        <Link to={handle ? `/product/${handle}` : "#"}>
          <img
            src={featuredImageUrl}
            className="object-contain h-48 max-h-48"
            alt={featuredImageUrl}
          />
        </Link>
      </figure>
    </div>
  );
}

function ProductCardButtons({
  handle,
  id,
  uom,
  productVariantId,
  moq,
  visibility
}: Pick<ProductList, 'handle' | 'id' | 'uom'> &
  Pick<Variants, 'moq'> & { productVariantId: string, visibility: boolean }) {
  const submit = useSubmit();
  const productVariantOnlyId = productVariantId?.split('/')?.pop();

  return (
    <div className={`grid justify-center grid-cols-1 gap-2 mt-4 ${visibility && "sm:grid-cols-2"} product-button`}>
      <Can I="view" a="view_product_detail">
        <Link
          to={handle ? `/product/${handle}` : "#"}
          className="flex items-center justify-center w-full gap-2 p-2 px-3 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border-solid cursor-pointer text-neutral-white bg-primary-500 hover:bg-primary-600"
        >
          product details
        </Link>
      </Can>
      {visibility &&
        <Can I="view" a="add_to_cart">
          <Form
            method="POST"
            onSubmit={(event) => {
              submit(event.currentTarget);
            }}
            className="w-full"
          >
            <input type="hidden" name="productId" value={id} />
            <input
              type="hidden"
              name="productVariantId"
              value={productVariantOnlyId}
            />
            <input type="hidden" name="quantity" value={moq} />
            <input type="hidden" name="selectUOM" value={uom} />

            <Button
              variant="ghost"
              size="default"
              type="submit"
              value="addToCart"
              name="action"
              className="w-full"
            >
              Add to cart
            </Button>
          </Form>
        </Can>
      }
    </div>
  );
}
