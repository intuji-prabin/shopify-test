import {Arrowleft} from '~/components/icons/arrowleft';
import OrderStats from './order-stats';
import OrderSteps from './orderSteps';
import OrderTopDetail from './orderTopDetail';
import OrderBreadcrumb from './order-detail-breadcrumb';
import {Button} from '~/components/ui/button';

export default function route() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-baseline mb-6">
        <OrderBreadcrumb title={'002374313'} />
        <div className="flex items-start gap-2">
          <p className="text-lg italic font-bold leading-[22p-x]">6 items</p>
          <Button variant="primary">re-order</Button>
        </div>
      </div>

      {/* order card starts here */}
      <div className="bg-white p-6 flex flex-col gap-6">
        {/* <OrderTopDetail order_no={'0005145629'} /> */}
        <OrderSteps />
        <OrderStats />
      </div>
    </div>
  );
}
