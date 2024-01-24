import {Link} from '@remix-run/react';

export default function ShippingAddressCards() {
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
  );
}
