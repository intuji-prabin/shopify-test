import {
  Carrier,
  CopyLink,
  CurrentStatus,
  Orderstats,
  Ordertrack,
  Printblue,
} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';

export default function OrderStats() {
  const orderStatus = [
    {
      id: 0,
      title: 'WMS Consignment No',
      info: '00664134',
    },
    {
      id: 1,
      title: 'Reference',
      info: '9058098',
    },
    {
      id: 2,
      title: 'Purchase Order No',
      info: '#1001',
    },
  ];
  const ordersts = [
    {
      id: 0,

      carrier: 'Carrier',
      carrier_type: 'Carrier Type',
      service_level: 'Service Level',
      phoneno: '+61 414 123 456',
      carrier_typ: 'LCL',
      service_type: 'Standard',
    },
  ];
  return (
    <>
      <div className="flex gap-6">
        {/* left order status card */}
        <div className="min-w-[unset] md:min-w-[286px] p-6 bg-grey-25">
          <div className=" flex flex-col gap-6">
            {orderStatus.map((order) => (
              <div key={order.id}>
                <p className="order-status-title ">{order.title}</p>{' '}
                {/* Fix to display the correct title */}
                <p className="order-status-info ">{order.info}</p>
              </div>
            ))}
          </div>
        </div>
        {/* right order status card */}
        <div className="flex-grow flex flex-col ">
          <div className="border-gray-100 border-x-0 border-b-2 border-t-0 flex flex-col md:flex-row">
            <div className=" p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px]">
                <Orderstats />
                <h5>Delivery Information</h5>
              </div>
              <p className="max-w-[235px] text-lg font-normal ">
                Four Square KELBURN fM 1398 97A Upland Road Wellington KELBURN,
                WELLINGTON 6012
              </p>
            </div>
            <div className="p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px]">
                <CurrentStatus />
                <h5>Current Status</h5>
              </div>
              <div className="max-w-[235px]">
                <Button variant="status_brown">processing</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row ">
            <div className="p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px]">
                <Carrier />
                <h5>Carrier Information</h5>
              </div>
              <div className="max-w-[235px]">
                <ul className="flex gap-2 flex-col">
                  {ordersts.map((order, index) => (
                    <>
                      <li
                        key={index}
                        className="flex justify-start gap-[17px] text-grey-900"
                      >
                        <p className=" font-medium text-base leading-[22px]">
                          {order.carrier}
                        </p>
                        <p className="font-normal">{order.phoneno}</p>
                      </li>
                      <li className="flex justify-start gap-[17px] text-grey-900">
                        <p className=" font-medium text-base leading-[22px]">
                          {order.carrier_type}
                        </p>
                        <p className="font-normal">{order.carrier_typ}</p>
                      </li>
                      <li className="flex justify-start gap-[17px] text-grey-900">
                        <p className=" font-medium text-base leading-[22px]">
                          {order.service_level}
                        </p>
                        <p className="font-normal">{order.service_type}</p>
                      </li>
                    </>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-5 min-w-[unset] lg:min-w-[300px] 2xl:min-w-[461px] flex flex-col gap-4">
              <div className="flex gap-[5px]">
                <Printblue />
                <h5>Proof of Delivery</h5>
              </div>
              <div className="flex gap-2 items-center">
                <button className="bg-primary-500 p-2">
                  <CopyLink />
                </button>
                <p className="font-normal text-base">Link</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
