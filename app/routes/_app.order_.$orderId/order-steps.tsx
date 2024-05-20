import {ReactNode} from 'react';
import {Steps} from '~/components/ui/steps';
import ProcessingPopover from '~/routes/_app.order_.$orderId/order-processing-popover';
import {OrderStatus} from '~/routes/_app.order/order.server';
import {Product} from '~/routes/_app.order_.$orderId/order-details.server';
import {
  BackOrder,
  Delivered,
  Dispatched,
  InvoiceBilling,
  Picked,
  Processing,
  Recieved,
  Transit,
} from '~/components/icons/orderStatus';

interface OrderStepsList {
  label: string;
  icon: ReactNode;
  status: OrderStatus;
}

export default function OrderSteps({
  orderStatus,
  products,
}: {
  orderStatus: OrderStatus;
  products: Product[];
}) {
  const orderSteps: OrderStepsList[] = [
    {
      label: 'Recieved',
      icon: (
        <Recieved
          fillColor={`${orderStatus === 'Received' ? '#fff' : '#969C9C'}`}
        />
      ),
      status: 'Received',
    },
    {
      label: 'Processing',
      icon: (
        <Processing
          fillColor={`${orderStatus === 'Processing' ? '#fff' : '#969C9C'}`}
        />
      ),
      status: 'Processing',
    },
    {
      label: 'Order Picked',
      icon: (
        <Picked
          fillColor={`${orderStatus === 'Order Picked' ? '#fff' : '#969C9C'}`}
        />
      ),
      status: 'Order Picked',
    },
    {
      label: 'Dispatched',
      icon: (
        <Dispatched
          fillColor={`${orderStatus === 'Dispatched' ? '#fff' : '#969C9C'}`}
        />
      ),
      status: 'Dispatched',
    },
    {
      label: 'Invoice Billing',
      icon: (
        <InvoiceBilling
          fillColor={`${
            orderStatus === 'Invoice Billing' ? '#fff' : '#969C9C'
          }`}
        />
      ),
      status: 'Invoice Billing',
    },
    {
      label: 'In Transit',
      icon: (
        <Transit
          fillColor={`${orderStatus === 'InTransit' ? '#fff' : '#969C9C'}`}
        />
      ),
      status: 'InTransit',
    },
    {
      label: 'Delivered',
      icon: (
        <Delivered
          fillColor={`${orderStatus === 'Delivered' ? '#fff' : '#969C9C'}`}
        />
      ),
      status: 'Delivered',
    },
  ];

  return (
    <Steps simple={false} className="steps__order">
      {orderSteps.map((step) => (
        <li
          key={step.label}
          className={`relative text-center basis-full ${
            orderStatus === step.status ? 'active' : ''
          }`}
        >
          <span className="inline-flex items-center justify-center w-16 h-16 text-lg font-medium text-white rounded-full bg-grey-100">
            {step.icon}
          </span>
          <p className="pt-2 text-lg italic font-bold text-grey-100">
            {step.label}
          </p>
          {step.status === 'Processing' && products.length > 0 && (
            <>
              <div className="bg-status-back_order h-5 w-0.5 mx-auto"></div>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-grey-100">
                <BackOrder fillColor="#fff" />
              </span>
              <p className="pt-2 text-sm italic font-bold text-grey-100">
                Items On Back Order
              </p>
              <ProcessingPopover products={products} />
            </>
          )}
        </li>
      ))}
    </Steps>
  );
}
