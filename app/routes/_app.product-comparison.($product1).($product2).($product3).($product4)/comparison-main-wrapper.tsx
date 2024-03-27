import { Link, useLocation } from '@remix-run/react';
import { TooltipInfo } from '~/components/icons/orderStatus';
import { PredictiveSearch } from '~/components/ui/predictive-search';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { ProductResponse } from './getProduct.server';
import { Button } from '~/components/ui/button';
import CloseMenu from '~/components/icons/closeMenu';

export type finalProductResponse = {
  productResponse: {
    product1: productResponse;
    product2: productResponse;
    product3: productResponse;
    product4: productResponse;
  }
}

type productResponse = {
  product: ProductResponse;
}

export default function ComparisonWrapper(productResponse: finalProductResponse) {
  const finalResponse = productResponse?.productResponse;
  const product1 = finalResponse?.product1;
  const product2 = finalResponse?.product2;
  const product3 = finalResponse?.product3;
  const product4 = finalResponse?.product4;

  const location = useLocation();

  const clearSelectedProduct = (productId: string) => {
    console.log("clicked", location.pathname)
    console.log("productId", productId)

    const originalURL = location.pathname;
    const updatedURL = originalURL.replace(/\/\d+\//, `/${productId}/`);
    console.log("updatedURL", updatedURL)
  }

  return (
    <div className="mt-6 overflow-x-auto bg-white">
      <div className='flex gap-6 p-6'>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          <figure className='flex items-center justify-center h-48 p-5 bg-grey-25'>
            <img src={product1?.product?.featuredImage?.url || DEFAULT_IMAGE?.IMAGE} alt="product1" className='object-contain h-full overflow-hidden' />
          </figure>
          <div className='pt-3'>
            <p className='text-lg font-medium leading-[22px] text-grey-900'>
              <Link to={`/product/${product1?.product?.handle}`}>
                {product1?.product?.title}
              </Link>
            </p>
          </div>
          <div className="flex gap-2 pb-6 mt-2 mb-6 border-b border-solid md:gap-6 border-grey-25">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-semantic-success-500 text-sm md:text-base font-bold uppercase leading-[21px]">
                  BUY PRICE
                </p>
                <div className="info-block">
                  <p className="flex items-center justify-center w-5 h-5 ">
                    <Link to="" data-tooltip="Recommended retail price">
                      <span>
                        <TooltipInfo />
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                $1234
              </h3>
              <p className="text-[14px] font-normal leading-4">
                (Excl. GST)
              </p>
            </div>
            <div className="flex flex-col pl-1 md:pl-6">
              <div className="flex items-center ">
                <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                  rrp
                </p>
                <div className="info-block">
                  <p className="flex items-center justify-center w-5 h-5 ">
                    <Link
                      to=""
                      data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                    >
                      <span>
                        <TooltipInfo />
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                $1234
              </h3>
              <p className="text-[14px] font-normal leading-4">
                (inc. GST)
              </p>
            </div>
          </div>
          <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Filter Lens Dimensions</p>
          <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">120 x 100 x 18 mm</p>
          <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">On/Off Control</p>
          <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">Automatic</p>
          <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Operating Temperature</p>
          <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">-5C to 55C</p>
        </div>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          {product2?.product ?
            <>
              <figure className='relative flex items-center justify-center h-48 p-5 bg-grey-25'>
                <img src={product2?.product?.featuredImage?.url || DEFAULT_IMAGE?.IMAGE} alt="product2" className='object-contain h-full overflow-hidden' />
                <Button
                  className="absolute top-2 right-2 bg-white max-h-5 max-w-5 md:max-h-8 md:max-w-8 p-[3px] md:p-2 hover:bg-white"
                  onClick={() => clearSelectedProduct(product2?.product?.id)}
                >
                  <CloseMenu fillColor="#0F1010" />
                </Button>
              </figure>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900'>
                  <Link to={`/product/${product2?.product?.handle}`}>
                    {product2?.product?.title}
                  </Link>
                </p>
              </div>
              <div className="flex gap-2 pb-6 mt-2 mb-6 border-b border-solid md:gap-6 border-grey-25">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="text-semantic-success-500 text-sm md:text-base font-bold uppercase leading-[21px]">
                      BUY PRICE
                    </p>
                    <div className="info-block">
                      <p className="flex items-center justify-center w-5 h-5 ">
                        <Link to="" data-tooltip="Recommended retail price">
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                    $1234
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (Excl. GST)
                  </p>
                </div>
                <div className="flex flex-col pl-1 md:pl-6">
                  <div className="flex items-center ">
                    <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                      rrp
                    </p>
                    <div className="info-block">
                      <p className="flex items-center justify-center w-5 h-5 ">
                        <Link
                          to=""
                          data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                        >
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                    $1234
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (inc. GST)
                  </p>
                </div>
              </div>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Filter Lens Dimensions</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">120 x 100 x 18 mm</p>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">On/Off Control</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">Automatic</p>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Operating Temperature</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">-5C to 55C</p>
            </> :
            <>
              <div className='flex items-center justify-center h-48 p-5 bg-grey-25'>
              </div>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900'>
                  Add a product
                </p>
              </div>
              <div className=' flex bg-white items-center w-full h-[38px] px-3 py-2 relative border border-solid border-grey-100 mt-4'>
                <PredictiveSearch inputPlaceholder='Search product' searchVariant="compare" />
              </div>
            </>}
        </div>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          {product3?.product ?
            <>
              <figure className='relative flex items-center justify-center h-48 p-5 bg-grey-25'>
                <img src={product3?.product?.featuredImage?.url || DEFAULT_IMAGE?.IMAGE} alt="product3" className='object-contain h-full overflow-hidden' />
                <Button
                  className="absolute top-2 right-2 bg-white max-h-5 max-w-5 md:max-h-8 md:max-w-8 p-[3px] md:p-2 hover:bg-white"
                  onClick={() => clearSelectedProduct(product2?.product?.id)}
                >
                  <CloseMenu fillColor="#0F1010" />
                </Button>
              </figure>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900'>
                  <Link to={`/product/${product3?.product?.handle}`}>
                    {product3?.product?.title}
                  </Link>
                </p>
              </div>
              <div className="flex gap-2 pb-6 mt-2 mb-6 border-b border-solid md:gap-6 border-grey-25">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="text-semantic-success-500 text-sm md:text-base font-bold uppercase leading-[21px]">
                      BUY PRICE
                    </p>
                    <div className="info-block">
                      <p className="flex items-center justify-center w-5 h-5 ">
                        <Link to="" data-tooltip="Recommended retail price">
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                    $1234
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (Excl. GST)
                  </p>
                </div>
                <div className="flex flex-col pl-1 md:pl-6">
                  <div className="flex items-center ">
                    <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                      rrp
                    </p>
                    <div className="info-block">
                      <p className="flex items-center justify-center w-5 h-5 ">
                        <Link
                          to=""
                          data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                        >
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                    $1234
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (inc. GST)
                  </p>
                </div>
              </div>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Filter Lens Dimensions</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">120 x 100 x 18 mm</p>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">On/Off Control</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">Automatic</p>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Operating Temperature</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">-5C to 55C</p>
            </> :
            <>
              <div className='flex items-center justify-center h-48 p-5 bg-grey-25'>
              </div>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900'>
                  Add a product
                </p>
              </div>
              <div className=' flex bg-white items-center w-full h-[38px] px-3 py-2 relative border border-solid border-grey-100 mt-4'>
                <PredictiveSearch inputPlaceholder='Search product' searchVariant="compare" />
              </div>
            </>}
        </div>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          {product4?.product ?
            <>
              <figure className='relative flex items-center justify-center h-48 p-5 bg-grey-25'>
                <img src={product4?.product?.featuredImage?.url || DEFAULT_IMAGE?.IMAGE} alt="product4" className='object-contain h-full overflow-hidden' />
                <Button
                  className="absolute top-2 right-2 bg-white max-h-5 max-w-5 md:max-h-8 md:max-w-8 p-[3px] md:p-2 hover:bg-white"
                  onClick={() => clearSelectedProduct(product2?.product?.id)}
                >
                  <CloseMenu fillColor="#0F1010" />
                </Button>
              </figure>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900'>
                  <Link to={`/product/${product4?.product?.handle}`}>
                    {product4?.product?.title}
                  </Link>
                </p>
              </div>
              <div className="flex gap-2 pb-6 mt-2 mb-6 border-b border-solid md:gap-6 border-grey-25">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="text-semantic-success-500 text-sm md:text-base font-bold uppercase leading-[21px]">
                      BUY PRICE
                    </p>
                    <div className="info-block">
                      <p className="flex items-center justify-center w-5 h-5 ">
                        <Link to="" data-tooltip="Recommended retail price">
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                    $1234
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (Excl. GST)
                  </p>
                </div>
                <div className="flex flex-col pl-1 md:pl-6">
                  <div className="flex items-center ">
                    <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                      rrp
                    </p>
                    <div className="info-block">
                      <p className="flex items-center justify-center w-5 h-5 ">
                        <Link
                          to=""
                          data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                        >
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                    $1234
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (inc. GST)
                  </p>
                </div>
              </div>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Filter Lens Dimensions</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">120 x 100 x 18 mm</p>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">On/Off Control</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">Automatic</p>
              <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Operating Temperature</p>
              <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">-5C to 55C</p>
            </> :
            <>
              <div className='flex items-center justify-center h-48 p-5 bg-grey-25'>
              </div>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900'>
                  Add a product
                </p>
              </div>
              <div className=' flex bg-white items-center w-full h-[38px] px-3 py-2 relative border border-solid border-grey-100 mt-4'>
                <PredictiveSearch inputPlaceholder='Search product' searchVariant="compare" />
              </div>
            </>}
        </div>
      </div>
    </div >
  );
}
