import {useState} from 'react';

import {ProductLoveRed, ProductLoveWhite} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';

export default function AlternativeProduct() {
  return (
    <>
      <h3 className="text-[36px] italic font-bold leading-[36px] mb-8 uppercase">
        alternative products
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[18px]">
        <div className="bg-white max-w-[unset] md:max-w-[302px] ">
          <ProductCardImage
            is_buy_qty_available={true}
            is_favorited={false}
            product_image_url="product.png"
          />
          <ProductCardInfo
            sku="SKU: 1-1601-EC"
            product_name="ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of
              CIGWELD Edition"
            buy_price={649.22}
            rpp_price={799.87}
          />
        </div>
        <div className="bg-white max-w-[unset] md:max-w-[302px]">
          <ProductCardImage
            is_buy_qty_available={true}
            is_favorited={false}
            product_image_url="product.png"
          />
          <ProductCardInfo
            sku="SKU: 1-1601-EC"
            product_name="ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of
              CIGWELD Edition"
            buy_price={649.22}
            rpp_price={799.87}
          />
        </div>
        <div className="bg-white  max-w-[unset] md:max-w-[302px]">
          <ProductCardImage
            is_buy_qty_available={true}
            is_favorited={false}
            product_image_url="product.png"
          />
          <ProductCardInfo
            sku="SKU: 1-1601-EC"
            product_name="ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of
              CIGWELD Edition"
            buy_price={649.22}
            rpp_price={799.87}
          />
        </div>
      </div>
    </>
  );
}
type ProductCardInfoProps = {
  sku: string;
  product_name: string;
  buy_price: number;
  rpp_price: number;
};
type ProductCardImageProps = {
  product_image_url: string;
  is_buy_qty_available: boolean;
  is_favorited: boolean;
};
export function ProductCardInfo({
  sku,
  product_name,
  rpp_price,
}: ProductCardInfoProps) {
  return (
    <>
      <div className="p-4 flex flex-col gap-6">
        {/* for upper tag and paragraph */}
        <div className="tag flex flex-col gap-[11px]">
          <div>
            <p className="text-base font-medium text-grey-400">{sku}</p>
            <h5 className="text-lg italic font-bold leading-6 text-grey-900 line-clamp-2 text-ellipsis whitespace-normal h-12">
              {product_name}
            </h5>
          </div>
          {/* for  bottom price comparisons */}
          <div className="flex gap-6">
            <div className="flex items-baseline gap-[6px]">
              {}
              <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
                ${rpp_price}
              </h3>
              <p className="text-[14px] font-normal leading-4">Inc. GST RRP</p>
            </div>
          </div>
        </div>
        <ProductCardButtons />
      </div>
    </>
  );
}
export function ProductCardImage({
  product_image_url,
  is_buy_qty_available,
  is_favorited,
}: ProductCardImageProps) {
  const [heartFill, setHeartFill] = useState(is_favorited);
  useState(is_buy_qty_available);

  const handleHeartClick = () => {
    setHeartFill(!heartFill);
  };

  return (
    <div className="relative px-11 py-[39px] border-grey-25 border-b-2 border-x-0 border-top-0 bg-[#F2F3F4]">
      <button
        className="absolute top-2 right-2 h-[36px] w-[36px] flex items-center justify-center bg-white"
        onClick={handleHeartClick}
      >
        {heartFill ? <ProductLoveRed /> : <ProductLoveWhite />}
      </button>
      <figure className="mt-3">
        <img src={product_image_url} className="" alt="" />
      </figure>
    </div>
  );
}
export function ProductCardButtons() {
  function handleViewDetail() {
    console.log('view detail');
  }

  function handleAddToCart() {
    console.log('add to cart');
  }
  return (
    <div className="flex gap-2 justify-center items-center">
      <Button
        variant="primary"
        size="default"
        className="w-full"
        onClick={handleViewDetail}
      >
        {' '}
        view detail
      </Button>

      <Button
        variant="ghost"
        size="default"
        className="w-full"
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </div>
  );
}
