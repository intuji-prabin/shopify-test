import {Link} from '@remix-run/react';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {NormalizedPredictiveSearchResultItem} from '~/routes/_app.predictive-search/route';

export const PredictiveProductDetail = ({
  product,
  handleClose,
}: {
  product: NormalizedPredictiveSearchResultItem;
  handleClose: () => void;
}) => {
  return (
    <>
      <div className="size-16">
        <PredictiveProductDetailImage
          handleClose={handleClose}
          handle={product?.handle}
          featuredPriceImageUrl={
            product?.featuredImageUrl || DEFAULT_IMAGE.IMAGE
          }
        />
      </div>
      <div className="w-[calc(100%_-_76px)]">
        <p className="text-sm text-primary-500">
          SKU: <span>{product.sku}</span>
        </p>
        <p>
          <Link
            prefetch="intent"
            to={product.handle ? `/product/${product.handle}` : '#'}
            onClick={handleClose}
            className="text-base font-medium text-grey-900"
          >
            {product.title}
          </Link>
        </p>
        <p className="text-2xl italic font-bold text-grey-900 whitespace-nowrap">
          {product?.price ? (
            <>
              {product.currency}&nbsp;
              {product.currencySymbol}
              {product.price}
            </>
          ) : (
            '--'
          )}
          <span className="text-sm italic font-bold text-grey-500">
            {' '}
            (Excl. GST)
          </span>
        </p>
        <p className="text-sm text-grey-300">
          Minimum Order Quantity: {product.moq || 1}
        </p>
      </div>
    </>
  );
};

export const PredictiveProductDetailImage = ({
  handleClose,
  handle,
  featuredPriceImageUrl,
  isCompare = false,
}: {
  handleClose: () => void;
  handle: string;
  featuredPriceImageUrl: string;
  isCompare?: boolean;
}) => {
  const productLink = isCompare
    ? `${handle}`
    : handle
    ? `/product/${handle}`
    : '#';
  return (
    <Link prefetch="intent" to={productLink} onClick={handleClose}>
      <img
        src={featuredPriceImageUrl}
        alt="product"
        className="object-contain object-center size-full"
      />
    </Link>
  );
};
