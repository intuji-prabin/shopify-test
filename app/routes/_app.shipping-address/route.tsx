import { Link } from '@remix-run/react';
import { Arrowleft } from '~/components/icons/arrowleft';

import { CircleInformationMajor } from '~/components/icons/orderStatus';

export default function ShippingAddressMgmt() {
  const shippingCards = [
    {
      id: 0,
      Name: 'Alex Smith',
      phone: 'Phone',
      addresstitle: 'address',
      postalcode: 'Postal Code',
      btn: 'Default Shipping Address',
      phoneno: '+61 414 123 456',
      address: '99th Street, Wandiligong, NSW',
      pstcode: '2424',
    },
    {
      id: 1,
      Name: 'Alex Smith',
      phone: 'Phone',
      addresstitle: 'address',
      postalcode: 'Postal Code',

      phoneno: '+61 414 123 456',
      address: '99th Street, Wandiligong, NSW',
      pstcode: '2424',
    },
    {
      id: 2,
      Name: 'Alex Smith',
      phone: 'Phone',
      addresstitle: 'address',
      postalcode: 'Postal Code',

      phoneno: '+61 414 123 456',
      address: '99th Street, Wandiligong, NSW',
      pstcode: '2424',
    },
    {
      id: 3,
      Name: 'Alex Smith',
      phone: 'Phone',
      addresstitle: 'address',
      postalcode: 'Postal Code',

      phoneno: '+61 414 123 456',
      address: '99th Street, Wandiligong, NSW',
      pstcode: '2424',
    },
    {
      id: 4,
      Name: 'Alex Smith',
      phone: 'Phone',
      addresstitle: 'address',
      postalcode: 'Postal Code',

      phoneno: '+61 414 123 456',
      address: '99th Street, Wandiligong, NSW',
      pstcode: '2424',
    },
  ];

  return (
    <div className="container py-12 ">
      <div>
        <div className="mb-[32px] flex flex-col gap-[6px]">
          <div className="flex gap-4 ">
            <button className="border-[1px] border-grey-100 h-10 w-10 flex items-center justify-center">
              <Arrowleft />
            </button>
            <h3 className="text-grey-900">Shipping Address </h3>
          </div>
          <ul className="flex gap-1 layout-breadcrumb">
            <li>Company Settings</li>
            <li>/</li>
            <li>Shipping Address </li>
          </ul>
        </div>
        <div className="flex gap-2 px-4 py-2 mb-2 border-l-4 border-r-0 bg-semantic-info-100 border-semantic-info-500 border-y-0">
          <CircleInformationMajor />
          <p className="text-base font-normal ">
            To edit or add new details please{' '}
            <span className="underline text-semantic-info-500">
              <Link to="">contact us.</Link>
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {shippingCards.map((shippingCard) => (
            <div className="p-6 bg-white min-w-[unset] 2xl:min-w-[628px] flex gap-[35px] flex-col">
              <div className="flex flex-col gap-[35px]" key={shippingCard.id}>
                <div className="flex flex-col gap-2 ">
                  <div className="flex justify-between">
                    <h5>{shippingCard.Name}</h5>
                    {shippingCard.btn && (
                      <button className="p-[6px] bg-primary-200">
                        <Link
                          to=""
                          className="text-[14px] font-medium leading-4 text-primary-500"
                        >
                          {shippingCard.btn}
                        </Link>
                      </button>
                    )}
                  </div>
                  <ul className="flex flex-col gap-2">
                    <li className="flex justify-start gap-[17px] text-grey-900">
                      <p className="text-lg font-bold leading-[22px]">
                        {shippingCard.phone}
                      </p>
                      <p className="font-normal">{shippingCard.phoneno}</p>
                    </li>
                    <li className="flex justify-start gap-[17px] text-grey-900">
                      <p className="text-lg font-bold leading-[22px]">
                        {shippingCard.addresstitle}
                      </p>
                      <p className="font-normal">{shippingCard.address}</p>
                    </li>
                    <li className="flex justify-start gap-[17px] text-grey-900">
                      <p className="text-lg font-bold leading-[22px]">
                        {shippingCard.postalcode}
                      </p>
                      <p className="font-normal">{shippingCard.pstcode}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
