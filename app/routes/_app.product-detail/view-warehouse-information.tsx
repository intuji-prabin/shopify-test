'use client';

import {Link} from '@remix-run/react';
import {useState} from 'react';
import {Drawer} from 'vaul';
import CloseMenu from '~/components/icons/closeMenu';
import {
  Distance,
  PhoneMajor,
  PickupLocation,
} from '~/components/icons/orderStatus';
type ProductInfoProps = {
  warehouseLink: string;
  pickupTitle: string;
  productImageUrl: string;
  productName: string;
  placetitle: string;
  pickupTime: string;
  customerName: string;
  street: string;
  city: string;
  location: string;
  coordinates: string;
  directionLink: string;
};

export function WarehouseInformation({
  warehouseLink,
  pickupTitle,
  productImageUrl,
  productName,
  pickupTime,
  customerName,
  placetitle,
  street,
  city,
  location,
  coordinates,
  directionLink,
}: ProductInfoProps) {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <Link to="">
          <button className="text-[14px] italic font-bolf leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
            {warehouseLink}
          </button>
        </Link>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0 z-50">
          <div className=" bg-white flex-1 h-full w-[410px]  z-50">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-bold text-[30px] italic leading-[36px] p-6 text-[#001328] flex items-start justify-between">
                {pickupTitle}

                <Drawer.Close>
                  <CloseMenu fillColor="#636969" />
                </Drawer.Close>
              </Drawer.Title>
              <div className="border-2  border-t-grey-50 border-x-0 border-b-0 p-6 flex flex-col gap-10">
                <div className="flex gap-2">
                  <figure className="w-12 h-12 p-2 border-[1px] border-grey-50">
                    <img
                      src={productImageUrl}
                      className=""
                      alt="product-image"
                    />
                  </figure>
                  <h5 className="text-lg text-[#252727] italic leading-6 font-bold max-w-[306px]">
                    {productName}
                  </h5>
                </div>
                <div className="flex  gap-2">
                  <PickupLocation />
                  <div className="flex flex-col gap-4 flex-grow items-baseline">
                    <div>
                      <p className="text-base italic leading-[21px] font-bold text-grey-700">
                        {placetitle}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {' '}
                      <div>
                        {' '}
                        <p>{pickupTime}</p>
                      </div>
                      <div className="flex flex-col">
                        <p>{customerName}</p>
                        <p>{street}</p>
                        <p>{city}</p>
                      </div>
                      <div className="flex flex-col"></div>
                    </div>
                    <div>
                      <div className="flex gap-[6px] items-center">
                        <Distance />
                        <p>{location}</p>
                      </div>
                      <div className="flex gap-[6px] items-center">
                        <PhoneMajor />
                        <p>{coordinates}</p>
                      </div>
                    </div>
                    <Link
                      to=""
                      className="text-[14px] italic font-bolf leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]"
                    >
                      {directionLink}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
