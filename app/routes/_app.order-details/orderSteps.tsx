import {
  BackOrder,
  Delivered,
  Dispatched,
  Picked,
  Processing,
  Recieved,
  Transit,
} from '~/components/icons/orderStatus';
import {Steps} from '~/components/ui/steps';
export default function OrderSteps() {
  return (
    <Steps simple={false} className="steps__order">
      <li className="relative text-center basis-full">
        <span className="inline-flex items-center justify-center w-16 h-16 text-lg font-medium text-white rounded-full bg-grey-100">
          <Recieved />
        </span>
        <p className="pt-2 text-lg italic font-bold text-grey-100">Received</p>
      </li>
      <li className="relative text-center basis-full active">
        <span className="inline-flex items-center justify-center w-16 h-16 text-lg font-medium text-white rounded-full bg-grey-100">
          <Processing fillColor="#fff" />
        </span>
        <p className="pt-2 text-lg italic font-bold text-grey-100">
          Processing
        </p>
        <div className="bg-status-back_order h-5 w-0.5 mx-auto"></div>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-grey-100">
          <BackOrder fillColor="#fff" />
        </span>
        <p className="pt-2 text-sm italic font-bold text-grey-100">
          Items On Back Order
        </p>
      </li>
      <li className="relative text-center basis-full">
        <span className="inline-flex items-center justify-center w-16 h-16 text-lg font-medium text-white rounded-full bg-grey-100">
          <Picked />
        </span>
        <p className="pt-2 text-lg italic font-bold text-grey-100">
          Order Picked
        </p>
      </li>
      <li className="relative text-center basis-full">
        <span className="inline-flex items-center justify-center w-16 h-16 text-lg font-medium text-white rounded-full bg-grey-100">
          <Dispatched />
        </span>
        <p className="pt-2 text-lg italic font-bold text-grey-100">
          Dispatched
        </p>
      </li>
      <li className="relative text-center basis-full">
        <span className="inline-flex items-center justify-center w-16 h-16 text-lg font-medium text-white rounded-full bg-grey-100">
          <Transit />
        </span>
        <p className="pt-2 text-lg italic font-bold text-grey-100">
          In Transit
        </p>
      </li>
      <li className="relative text-center basis-full">
        <span className="inline-flex items-center justify-center w-16 h-16 text-lg font-medium text-white rounded-full bg-grey-100">
          <Delivered />
        </span>
        <p className="pt-2 text-lg italic font-bold text-grey-100">Delivered</p>
      </li>
    </Steps>
  );
}
