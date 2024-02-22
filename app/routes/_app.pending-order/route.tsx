import HeroBanner from '~/components/ui/hero-section';
import OrderCards from './order-cards';

export default function route() {
  return (
    <>
      <HeroBanner
        image_url={'/place-order.png'}
        section_name={'Pending Order (6/10 Group Cards)'}
      />
      <OrderCards />
    </>
  );
}
