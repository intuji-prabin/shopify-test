import {Arrowleft} from '~/components/icons/arrowleft';
import OrderStats from './order-stats';
import OrderSteps from './orderSteps';
import OrderTopDetail from './orderTopDetail';

export default function route() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-baseline mb-6">
        <div className=" flex flex-col gap-[6px]">
          <div className="flex gap-4  ">
            <button className="border-[1px] border-grey-100 h-10 w-10 flex items-center justify-center">
              <Arrowleft />
            </button>
            <h3 className="text-grey-900">Order Details</h3>
          </div>
          <ul className="flex gap-1 layout-breadcrumb">
            <li>Order</li>
            <li>/</li>
            <li>0005145629 </li>
          </ul>
        </div>
        <div className="flex items-start gap-2">
          <p className="text-lg italic font-bold leading-[22p-x]">6 items</p>
          <button className="text-[14px] italic font-bold uppercase leading-6 bg-primary-500 py-2 px-6 text-white">
            re-order
          </button>
        </div>
      </div>

      {/* order card starts here */}
      <div className="bg-white p-6 flex flex-col gap-6">
        <OrderTopDetail />
        <OrderSteps />
        <OrderStats />
      </div>
    </div>
  );
}
