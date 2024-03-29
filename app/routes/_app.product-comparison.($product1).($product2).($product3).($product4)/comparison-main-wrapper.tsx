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
  warranty: { value: string };
  material: { value: string };
  product_weight?: { value: string };
  supplier: { value: string };
  featuredImage: { url: string };
  variants: {
    moq: string;
    sku: string;
    id: string;
  }
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
  const product1 = finalResponse?.product1;
  const product2 = finalResponse?.product2;
  const product3 = finalResponse?.product3;
  const product4 = finalResponse?.product4;

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
            <img src={product1?.product?.featuredImage?.url || DEFAULT_IMAGE?.IMAGE} alt="product1" className='object-contain h-full overflow-hidden' />
          </figure>
          <div className='pt-3'>
            <p className='text-lg font-medium leading-[22px] text-grey-900 overflow-y-hidden h-11 line-clamp-2'>
              <Link to={`/product/${product1?.product?.handle}`} title={product1?.product?.title}>
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
                    <div className='cursor-pointer' data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts">
                      <span>
                        <TooltipInfo />
                      </span>
                    </div>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                <span className='text-lg font-medium'>{product1?.product?.currency}</span>{product1?.product?.companyPrice}
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
                <span className='text-lg font-medium'>{product1?.product?.currency}</span>{product1?.product?.defaultPrice}
              </h3>
              <p className="text-[14px] font-normal leading-4 text-grey-300">
                (inc. GST)
              </p>
            </div>
          </div>
          <ProductDetailInfo warranty={product1?.product?.warranty?.value && product1?.product?.warranty?.value || "N/A"} material={product1?.product?.material?.value && product1?.product?.material?.value || "N/A"} weight={product1?.product?.product_weight?.value && product1?.product?.product_weight?.value || "N/A"} supplier={product1?.product?.supplier?.value && product1?.product?.supplier?.value || "N/A"} vendor={product1?.product?.vendor && product1?.product?.vendor || "N/A"} moq={product1?.product?.variants?.moq && product1?.product?.variants?.moq || "N/A"} sku={product1?.product?.variants?.sku && product1?.product?.variants?.sku || "N/A"} />
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
                <p className='text-lg font-medium leading-[22px] text-grey-900 overflow-y-hidden h-11 line-clamp-2'>
                  <Link to={`/product/${product2?.product?.handle}`} title={product2?.product?.title}>
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
                    <span className='text-lg font-medium'>{product2?.product?.currency}</span>{product2?.product?.companyPrice}
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
                    <span className='text-lg font-medium'>{product2?.product?.currency}</span>{product2?.product?.defaultPrice}
                  </h3>
                  <p className="text-[14px] font-normal leading-4 text-grey-300">
                    (inc. GST)
                  </p>
                </div>
              </div>
              <ProductDetailInfo warranty={product2?.product?.warranty?.value && product2?.product?.warranty?.value || "N/A"} material={product2?.product?.material?.value && product2?.product?.material?.value || "N/A"} weight={product2?.product?.product_weight?.value && product2?.product?.product_weight?.value || "N/A"} supplier={product2?.product?.supplier?.value && product2?.product?.supplier?.value || "N/A"} vendor={product2?.product?.vendor && product2?.product?.vendor || "N/A"} moq={product2?.product?.variants?.moq && product2?.product?.variants?.moq || "N/A"} sku={product2?.product?.variants?.sku && product2?.product?.variants?.sku || "N/A"} />
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
                  onClick={() => clearSelectedProduct(product3?.product?.id)}
                >
                  <CloseMenu fillColor="#0F1010" />
                </Button>
              </figure>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900 overflow-y-hidden h-11 line-clamp-2'>
                  <Link to={`/product/${product3?.product?.handle}`} title={product3?.product?.title}>
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
                    <span className='text-lg font-medium'>{product3?.product?.currency}</span>{product3?.product?.companyPrice}
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
                    <span className='text-lg font-medium'>{product3?.product?.currency}</span>{product3?.product?.defaultPrice}
                  </h3>
                  <p className="text-[14px] font-normal leading-4 text-grey-300">
                    (inc. GST)
                  </p>
                </div>
              </div>
              <ProductDetailInfo warranty={product3?.product?.warranty?.value && product3?.product?.warranty?.value || "N/A"} material={product3?.product?.material?.value && product3?.product?.material?.value || "N/A"} weight={product3?.product?.product_weight?.value && product3?.product?.product_weight?.value || "N/A"} supplier={product3?.product?.supplier?.value && product3?.product?.supplier?.value || "N/A"} vendor={product3?.product?.vendor && product3?.product?.vendor || "N/A"} moq={product3?.product?.variants?.moq && product3?.product?.variants?.moq || "N/A"} sku={product3?.product?.variants?.sku && product3?.product?.variants?.sku || "N/A"} />
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
                  onClick={() => clearSelectedProduct(product4?.product?.id)}
                >
                  <CloseMenu fillColor="#0F1010" />
                </Button>
              </figure>
              <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900 overflow-y-hidden h-11 line-clamp-2'>
                  <Link to={`/product/${product4?.product?.handle}`} title={product4?.product?.title}>
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
                    <span className='text-lg font-medium'>{product4?.product?.currency}</span>{product4?.product?.companyPrice}
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
                    <span className='text-lg font-medium'>{product4?.product?.currency}</span>{product4?.product?.defaultPrice}
                  </h3>
                  <p className="text-[14px] font-normal leading-4 text-grey-300">
                    (inc. GST)
                  </p>
                </div>
              </div>
              <ProductDetailInfo warranty={product3?.product?.warranty?.value && product3?.product?.warranty?.value || "N/A"} material={product3?.product?.material?.value && product3?.product?.material?.value || "N/A"} weight={product3?.product?.product_weight?.value && product3?.product?.product_weight?.value || "N/A"} supplier={product3?.product?.supplier?.value && product3?.product?.supplier?.value || "N/A"} vendor={product3?.product?.vendor && product3?.product?.vendor || "N/A"} moq={product3?.product?.variants?.moq && product3?.product?.variants?.moq || "N/A"} sku={product3?.product?.variants?.sku && product3?.product?.variants?.sku || "N/A"} />
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
    </div>
  );
}


export function ProductDetailInfo({ warranty, material, weight, supplier, vendor, moq, sku }: { warranty: string, material: string, weight: string, supplier: string, vendor: string, moq: string, sku: string }) {
  return (
    <>
      <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Warranty</p>
      <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">
        {warranty}
      </p>
      <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Material</p>
      <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">
        {material}
      </p>
      <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Product Weight</p>
      <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">
        {weight}
      </p>
      <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Supplier</p>
      <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">
        {supplier}
      </p>
      <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Vendor</p>
      <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">
        {vendor}
      </p>
      <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Minimum Order Quantity</p>
      <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">
        {moq}
      </p>
      <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">SKU</p>
      <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">
        {sku}
      </p>
    </>
  )
}