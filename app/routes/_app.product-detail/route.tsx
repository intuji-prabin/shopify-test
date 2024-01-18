import React from 'react';
import ProductTab from './productTabs';
import ProductInformation from './productInformation';

export default function route() {
  return (
    <>
      <div className="container">
        <ProductInformation />
        <ProductTab />
      </div>
    </>
  );
}
