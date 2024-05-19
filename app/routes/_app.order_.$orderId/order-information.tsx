import {OrderDetails} from '~/routes/_app.order_.$orderId/order-details.server';
import {OrderStatusChip} from '~/components/ui/order-status-chip';
import {Link} from '@remix-run/react';
import {
  Carrier,
  CopyLink,
  CurrentStatus,
  Orderstats,
  Printblue,
} from '~/components/icons/orderStatus';

export default function OrderInformation({
  orderInformation,
}: {
  orderInformation: Omit<OrderDetails, 'products'>;
}) {
  const orderNumber = [
    {
      title: 'WMS Consignment No',
      value: orderInformation.consignmentNumber || 'N/A',
    },
    {
      title: 'Reference',
      value: orderInformation.referenceNumber || 'N/A',
    },
    {
      title: 'Purchase Order No',
      value: orderInformation.poNumber || 'N/A',
    },
  ];

  return (
    <>
      <div className="flex gap-6">
        {/* left order status card */}
        <div className="min-w-[unset] md:min-w-[286px] p-6 bg-grey-25">
          <div className=" flex flex-col gap-6">
            {orderNumber.map((order, index) => (
              <div key={`${order.value}-${index}`}>
                <p className="order-status-title ">{order.title}</p>{' '}
                <p className="order-status-info ">{order.value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* right order status card */}
        <div className="flex-grow flex flex-col ">
          <div className="border-gray-100 border-x-0 border-b-2 border-t-0 flex flex-col md:flex-row">
            <div className=" p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px] items-center">
                <Orderstats />
                <h5>Delivery Information</h5>
              </div>
              <p className="max-w-[235px] text-lg font-normal ">
                {orderInformation.shippingAddress1}{' '}
                {orderInformation.shippingAddress2},{' '}
                {orderInformation.shippingCountry}{' '}
                {orderInformation.shippingPostalCode}
              </p>
            </div>
            <div className="p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px] items-center">
                <CurrentStatus />
                <h5>Current Status</h5>
              </div>
              <div className="max-w-[235px]">
                <OrderStatusChip status={orderInformation.orderStatus} />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row ">
            <div className="p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px] items-center">
                <Carrier />
                <h5>Carrier Information</h5>
              </div>
              <div className="max-w-[235px]">
                <ul className="flex gap-2 flex-col">
                  <li className="flex justify-start gap-[17px] text-grey-900">
                    <p className=" font-medium text-base leading-[22px]">
                      Carrier
                    </p>
                    <p className="font-normal">
                      {orderInformation.carrier || 'N/A'}
                    </p>
                  </li>
                  <li className="flex justify-start gap-[17px] text-grey-900">
                    <p className=" font-medium text-base leading-[22px]">
                      Carrier Type
                    </p>
                    <p className="font-normal">
                      {orderInformation.carrierType || 'N/A'}
                    </p>
                  </li>
                  <li className="flex justify-start gap-[17px] text-grey-900">
                    <p className=" font-medium text-base leading-[22px]">
                      Service Level
                    </p>
                    <p className="font-normal">
                      {orderInformation.serviceLevel || 'N/A'}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px] items-center">
                <Printblue />
                <h5>Proof of Delivery</h5>
              </div>
              <div className="flex gap-2 items-center">
                {orderInformation.shipmentDocumentUrl ||
                orderInformation.shipmentTrackingUrl ? (
                  <>
                    {orderInformation.shipmentDocumentUrl && (
                      <Link
                        to={orderInformation.shipmentDocumentUrl}
                        className="bg-primary-500 p-2"
                      >
                        <CopyLink />
                        <p className="font-normal text-base">
                          Shipment Document
                        </p>
                      </Link>
                    )}
                    {orderInformation.shipmentTrackingUrl && (
                      <Link
                        to={orderInformation.shipmentTrackingUrl}
                        className="bg-primary-500 p-2"
                      >
                        <CopyLink />
                        <p className="font-normal text-base">
                          Shipment Tracking
                        </p>
                      </Link>
                    )}
                  </>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
