'use client';

import {Link} from '@remix-run/react';
import {Drawer} from 'vaul';
import {PickupLocation} from '~/components/icons/orderStatus';
type ProductInfoProps = {
  pickupTitle: string;
  productImageUrl: string;
  productName: string;
  placeitle: string;
  pickupTime: string;
  customerName: string;
  street: string;
  city: string;
  location: number;
  coordinates: number;
};

export function WarehouseInformation({
  pickupTitle,
  productImageUrl,
  productName,
  pickupTime,
  customerName,
  street,
  city,
  location,
  coordinates,
}: ProductInfoProps) {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <Link to="">
          <button className="text-[14px] italic font-bolf leading-6 uppercase underline decoration-primary-500">
            View WAREHOUSE information
          </button>
        </Link>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
          <div className="p-4 bg-white flex-1 h-full">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-bold text-[30px] italic leading-[36px]">
                {pickupTitle}
              </Drawer.Title>
              <div className="flex gap-2">
                <figure>
                  <img src={productImageUrl} className="" alt="product-image" />
                </figure>
                <h5>{productName}</h5>
              </div>
            </div>
            <div className="flex  gap-2">
              <PickupLocation />
              <div className="">
                <p>{pickupTitle}</p>
                <p>Usually ready in 4 hours</p>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
