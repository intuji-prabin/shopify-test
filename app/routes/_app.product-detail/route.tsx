import React from 'react';
import ProductTab from './productTabs';
import ProductInformation from './productInformation';
import CarouselThumb from './carouselThumb';

export default function route() {
  return (
    <>
      <div className="container">
        {/* <ProductInformation />
        <ProductTab /> */}
        <CarouselThumb
          images={images}
          thumbNailCarouseloptions={{axis: 'y'}}
          mainCarouseloptions={{}}
        />
      </div>
    </>
  );
}
