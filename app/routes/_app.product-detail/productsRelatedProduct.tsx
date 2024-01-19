import {useState} from 'react';

import {ProductLoveRed, ProductLoveWhite} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
import {ProductCard} from '~/components/ui/product-card';
import WelderHelment from 'public/weld-helmet.png';
export default function ProductsRelatedProduct() {
  return (
    <>
      <section className="bg-white mt-0 border-[1px] border-grey-50 pt-[50px]">
        <div className="container">
          <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase">
            Similar Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[18px]">
            <ProductCard
              productImageUrl={WelderHelment}
              isBuyQtyAvailable={false}
              isFavorited={false}
              sku={'1-1601-EC'}
              productName={
                'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
              }
              buyPrice={649.22}
              rppPrice={0}
              imageBackgroundColor={'#0092CF'}
            />
            <ProductCard
              productImageUrl={WelderHelment}
              isBuyQtyAvailable={true}
              isFavorited={false}
              sku={'1-1601-EC'}
              productName={
                'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
              }
              buyPrice={649.22}
              rppPrice={649.22}
              imageBackgroundColor={'#0092CF'}
            />
            <ProductCard
              productImageUrl={WelderHelment}
              isBuyQtyAvailable={false}
              isFavorited={false}
              sku={'1-1601-EC'}
              productName={
                'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
              }
              buyPrice={649.22}
              rppPrice={649.22}
              imageBackgroundColor={'#0092CF'}
            />
            <ProductCard
              productImageUrl={WelderHelment}
              isBuyQtyAvailable={true}
              isFavorited={false}
              sku={'1-1601-EC'}
              productName={
                'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
              }
              buyPrice={649.22}
              rppPrice={649.22}
              imageBackgroundColor={'#0092CF'}
            />{' '}
          </div>
        </div>
      </section>
    </>
  );
}
