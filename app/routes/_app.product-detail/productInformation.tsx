import React from 'react';
import {
  Compare,
  Heart,
  InStock,
  Pdf,
  ProductLoveWhite,
} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
import Carousel from '~/components/ui/carousel';

export default function productInformation() {
  return (
    <section className="bg-white">
      <div className="container">
        <div></div>
        <div className="right-side-info">
          <div className="top flex flex-col gap-6">
            <div className="">
              <div className="flex justify-between">
                <figure>
                  <img src="Logo.png" alt="" />
                </figure>
                <ul className="flex gap-[7px]">
                  <li className="p-2 border-grey-50 border-[1px]">
                    <Compare />
                  </li>
                  <li className="p-2 border-grey-50 border-[1px]">
                    <Pdf />
                  </li>
                  <li className="p-2 border-grey-50 border-[1px]">
                    <ProductLoveWhite />
                  </li>
                </ul>
              </div>
              <div className="">
                <h3>
                  ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of
                  CIGWELD Edition
                </h3>
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <div>
                      <p>sku: </p>
                      <p className="text-Grey-500">1-1601-EC</p>
                    </div>
                    <div className="flex">
                      <p>Unit Of Measurement:</p>
                      <p>1 Box</p>
                      <Button
                        className="uppercase bg-primary-200 text-primary-600 font-medium leading-4 text-[14px] not-italic"
                        size="default"
                      >
                        Default
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 bg-semantic-success-100">
                    <InStock />
                    <p className="uppercase text-[14px] font-medium text-semantic-success-500">
                      IN STOCK
                    </p>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div className="pickup-available"></div>
        </div>
      </div>
    </section>
  );
}
