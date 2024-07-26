import {Link} from '@remix-run/react';
import {NormalizedPredictiveSearchResultItem} from '~/routes/_app.predictive-search/route';
import {isPriceValid} from './predictive-search';

export const PredictiveProductDetail = ({
  product,
  handleClose,
}: {
  product: NormalizedPredictiveSearchResultItem;
  handleClose: () => void;
}) => {
  const isValidPrice = isPriceValid(Number(product?.price));
  return (
    <>
      <div className="size-16">
        <PredictiveProductDetailImage
          handleClose={handleClose}
          handle={product?.handle}
          featuredPriceImageUrl={product?.featuredPriceImageUrl}
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
          {isValidPrice ? (
            <>
              {product.currency}&nbsp;
              {product.currencySymbol}
              {product.price}
            </>
          ) : (
            'N/A'
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
}: {
  handleClose: () => void;
  handle: string;
  featuredPriceImageUrl: string;
}) => {
  return (
    <Link
      prefetch="intent"
      to={handle ? `/product/${handle}` : '#'}
      onClick={handleClose}
    >
      <img
        src={featuredPriceImageUrl}
        alt="product"
        className="object-contain object-center size-full"
      />
    </Link>
  );
};
