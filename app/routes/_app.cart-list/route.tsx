import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import MyProducts from './order-my-products/cart-myproduct';
import OrderSummary from './order-summary/cart-order-summary';

export default function CartList() {
  return (
    <>
      <HeroBanner
        image_url={'/place-order.png'}
        section_name={'SHOPPING CART'}
      />
      <UploadSearchbar />
      <div className="flex justify-between container my-6 gap-6 items-start flex-col lg:flex-row">
        <MyProducts />
        <OrderSummary />
      </div>
    </>
  );
}
