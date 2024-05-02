import {useState} from 'react';
import {ProductLoveRed, ProductLoveWhite} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
import {Can} from '~/lib/helpers/Can';

// Product Card Info Props
type ProductCardInfoProps = {
  sku: string;
  product_name: string;
  buy_price: number;
  rpp_price: number;
  gst_rrp: string;
};

// Product Card Image Props
type ProductCardImageProps = {
  product_image_url: string;
  is_buy_qty_available: boolean;
  is_favorited: boolean;
};

// product cards button
type ProductCartButtons = {
  view_details: string;
  add_to_cart: string;
};
// Product Card Info Component
export function ProductCardInfo({
  sku,
  product_name,
  rpp_price,
  gst_rrp,
}: ProductCardInfoProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Upper tag and paragraph */}
      <div className="tag flex flex-col gap-[11px]">
        <div>
          <p className="text-base font-medium text-grey-400">{sku}</p>
          <h5 className="h-12 text-lg italic font-bold leading-6 whitespace-normal text-grey-900 line-clamp-2 text-ellipsis">
            {product_name}
          </h5>
        </div>
        {/* Bottom price comparisons */}
        <div className="flex gap-6">
          <div className="flex items-baseline gap-[6px]">
            <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
              ${rpp_price}
            </h3>
            <p className="text-[14px] font-normal leading-4">{gst_rrp}</p>
          </div>
        </div>
      </div>
      <ProductCardButtons
        view_details={'view details'}
        add_to_cart={'add to cart'}
      />
    </div>
  );
}

// Product Card Image Component
export function ProductCardImage({
  product_image_url,
  is_favorited,
}: ProductCardImageProps) {
  const [heartFill, setHeartFill] = useState(is_favorited);

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
        <img src={product_image_url} alt="" />
      </figure>
    </div>
  );
}

// Product Card Buttons Component
export function ProductCardButtons({
  view_details,
  add_to_cart,
}: ProductCartButtons) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Can I="view" a="view_product_detail">
        <Button variant="primary" size="default" className="w-full">
          {view_details}
        </Button>
      </Can>
      <Can I="view" a="add_to_cart">
        <Button variant="ghost" size="default" className="w-full">
          {add_to_cart}
        </Button>
      </Can>
    </div>
  );
}

// Main Alternative Product Component
export default function AlternativeProduct() {
  return (
    <>
      <h3 className="text-[36px] italic font-bold leading-[36px] mb-8 uppercase">
        alternative products
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white">
            <ProductCardImage
              is_buy_qty_available={true}
              is_favorited={false}
              product_image_url="/product.png"
            />
            <ProductCardInfo
              sku="SKU: 1-1601-EC"
              product_name="ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition"
              buy_price={649.22}
              rpp_price={799.87}
              gst_rrp={'inc.gst'}
            />
          </div>
        ))}
      </div>
    </>
  );
}
