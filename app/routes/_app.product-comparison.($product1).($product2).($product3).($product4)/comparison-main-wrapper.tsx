import { Link, useLocation, useNavigate } from '@remix-run/react';
import CloseMenu from '~/components/icons/closeMenu';
import { TooltipInfo } from '~/components/icons/orderStatus';
import { Button } from '~/components/ui/button';
import { PredictiveSearch } from '~/components/ui/predictive-search';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';

export type finalProductResponse = {
  productResponse: {
    product1: productResponse;
    product2: productResponse;
    product3: productResponse;
    product4: productResponse;
  }
}

export type ProductFinalResponse = {
  id: string;
  handle: string;
  title: string;
  finalProductInfoArray: { key: string, value: string }[];
  featuredImage: { url: string };
  companyPrice: string;
  currency: string;
  defaultPrice: string;
  vendor: string;
};

type productResponse = {
  product: ProductFinalResponse;
}

export default function ComparisonWrapper(productResponse: finalProductResponse) {
  const finalResponse = productResponse?.productResponse;
  const product1 = finalResponse?.product1?.product;
  const product2 = finalResponse?.product2?.product;
  const product3 = finalResponse?.product3?.product;
  const product4 = finalResponse?.product4?.product;

  const location = useLocation();
  const navigate = useNavigate();

  const clearSelectedProduct = (productId: string) => {
    const originalURL = location.pathname;
    let splitURL = originalURL.split('/');

    // splitURL = splitURL.filter((item) => item !== productId);
    // let resultURL = splitURL.join('/');
    // navigate(resultURL);

    let indexToRemove = splitURL.lastIndexOf(productId);
    if (indexToRemove !== -1) {
      splitURL.splice(indexToRemove, 1);
    }
    let resultURL = '/' + splitURL.slice(1).join('/');
    navigate(resultURL);
  }
  return (
    <div className="mt-6 overflow-x-auto bg-white">
      <div className='flex gap-6 p-6'>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          <figure className='flex items-center justify-center h-48 p-5 bg-grey-25'>
            <img src={product1?.featuredImage?.url || DEFAULT_IMAGE?.IMAGE} alt="product1" className='object-contain h-full overflow-hidden' />
          </figure>
          <div className='pt-3'>
            <p className='text-lg font-medium leading-[22px] text-grey-900 overflow-y-hidden h-11 line-clamp-2'>
              <Link to={`/product/${product1?.handle}`} title={product1?.title}>
                {product1?.title}
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
                    <div className='cursor-pointer' data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts">
                      <span>
                        <TooltipInfo />
                      </span>
                    </div>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                <span className='text-lg font-medium'>{product1?.currency}</span>{product1?.companyPrice}
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
                    <div className='cursor-pointer'
                      data-tooltip="Recommended retail price"
                    >
                      <span>
                        <TooltipInfo />
                      </span>
                    </div>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-grey-300">
                <span className='text-lg font-medium'>{product1?.currency}</span>{product1?.defaultPrice}
              </h3>
              <p className="text-[14px] font-normal leading-4 text-grey-300">
                (inc. GST)
              </p>
            </div>
          </div>
          <ProductDetailInfo productInfo={product1?.finalProductInfoArray} />
        </div>
        <ProductDetailDiv productDetails={product2} clearSelectedProduct={clearSelectedProduct} />
        <ProductDetailDiv productDetails={product3} clearSelectedProduct={clearSelectedProduct} />
        <ProductDetailDiv productDetails={product4} clearSelectedProduct={clearSelectedProduct} />
      </div>
    </div>
  );
}


export function ProductDetailInfo({ productInfo }: { productInfo: { key: string, value: string }[] }) {
  return (
    <>
      {
        productInfo.map(item => (
          <div key={item.key}>
            <p className="px-6 py-3 text-lg font-semibold leading-6 capitalize text-grey-900 bg-primary-50">{item.key}</p>
            <p className="px-6 py-3 text-lg font-medium leading-6 capitalize text-grey-900">
              {item.value}
            </p>
          </div>
        ))
      }
    </>
  )
}

export function ProductDetailDiv({ productDetails, clearSelectedProduct }: { productDetails: ProductFinalResponse, clearSelectedProduct: (productId: string) => void }) {
  return (
    <div className='min-w-[290px] w-full max-w-[290px]'>
      {productDetails ?
        <>
          <figure className='relative flex items-center justify-center h-48 p-5 bg-grey-25'>
            <img src={productDetails?.featuredImage?.url || DEFAULT_IMAGE?.IMAGE} alt="product2" className='object-contain h-full overflow-hidden' />
            <Button
              className="absolute top-2 right-2 bg-white max-h-5 max-w-5 md:max-h-8 md:max-w-8 p-[3px] md:p-2 hover:bg-white"
              onClick={() => clearSelectedProduct(productDetails?.id)}
            >
              <CloseMenu fillColor="#0F1010" />
            </Button>
          </figure>
          <div className='pt-3'>
            <p className='text-lg font-medium leading-[22px] text-grey-900 overflow-y-hidden h-11 line-clamp-2'>
              <Link to={`/product/${productDetails?.handle}`} title={productDetails?.title}>
                {productDetails?.title}
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
                <span className='text-lg font-medium'>{productDetails?.currency}</span>{productDetails?.companyPrice}
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
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-grey-300">
                <span className='text-lg font-medium'>{productDetails?.currency}</span>{productDetails?.defaultPrice}
              </h3>
              <p className="text-[14px] font-normal leading-4 text-grey-300">
                (inc. GST)
              </p>
            </div>
          </div>
          <ProductDetailInfo productInfo={productDetails?.finalProductInfoArray} />
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
  )
}