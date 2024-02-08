import {badgeVariants} from '~/components/ui/badge';

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
}: ProductCardDetail) {
  return (
    <>
      <figure className="flex space-x-2">
        <div className="bg-grey-25 p-3 w-20 h-20">
          <img src={productImageUrl} alt="item-image" />
        </div>
        <figcaption className="flex flex-col justify-between max-w-[261px]">
          <h5 className="">{productName}</h5>
          <div className="flex space-x-5 items-center max-w-[180px] flex-wrap">
            <p>
              <span className="text-grey-900 font-semibold ">SKU: </span>
              {sku}
            </p>
            <div className={badgeVariants({variant: 'inStock'})}>
              <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>IN
              STOCK
            </div>
            <p className="!p-0 !m-0 font-normal leading-4 text-[14px] text-grey-800 capitalize !mt-2">
              minimum order(500 pieces)
            </p>
          </div>
        </figcaption>
      </figure>
    </>
  );
}
