import {InStock} from '~/components/icons/orderStatus';

type ProductCardDetail = {
  productImageUrl: string;
  sku: string;
  productName: string;
  inStock: boolean;
};
export default function WishListProductItem({
  productImageUrl,
  productName,
  sku,
  inStock,
}: ProductCardDetail) {
  //   console.log('HERE', productImageUrl, productName, sku, inStock);
  return (
    <>
      <div className="flex gap-2 !justify-between">
        <figure className="max-w-10 bg-grey-25">
          <img src={productImageUrl} className="" alt="product-image" />
        </figure>
        <div className="max-w-[261px]">
          <div>
            <h5 className="text-lg italic font-bold leading-6 text-grey-900 line-clamp-2 text-ellipsis whitespace-normal h-12">
              {productName}
            </h5>
            <div className="flex gap-5 !justify-start">
              <p className="text-base font-medium text-primary-500">
                SKU:{sku}
              </p>
              <div className="flex gap-2 bg-semantic-success-100 items-center p-2">
                <InStock />
                <p className="uppercase text-[14px] font-medium text-semantic-success-500">
                  {inStock}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
