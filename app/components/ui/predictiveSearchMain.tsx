import {NormalizedPredictiveSearchResultItem} from '~/routes/_app.predictive-search/route';
import {PredictiveProductDetailImage} from './predictiveSearchDetail';
import {Link} from '@remix-run/react';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';

export const PredictiveSearchMain = ({
  product,
  handleClose,
  isCompare = false,
}: {
  product: NormalizedPredictiveSearchResultItem;
  handleClose: () => void;
  isCompare?: boolean;
}) => {
  const productLink = isCompare
    ? `${product.id}`
    : product.handle
    ? `/product/${product.handle}`
    : '#';
  return (
    <figure className="flex flex-wrap items-center space-x-4" key={product.id}>
      <div className="size-14">
        <PredictiveProductDetailImage
          handleClose={handleClose}
          handle={productLink}
          featuredPriceImageUrl={
            product?.featuredImageUrl || DEFAULT_IMAGE.IMAGE
          }
          isCompare={true}
        />
      </div>
      <figcaption className="w-[calc(100%_-_72px)]">
        <Link
          prefetch="intent"
          to={productLink}
          onClick={handleClose}
          className="text-base font-bold text-grey-900"
        >
          {product.title}
        </Link>
        <p className="text-sm text-primary-500">
          SKU: <span>{product.sku}</span>
        </p>
      </figcaption>
    </figure>
  );
};
