import { Form, Link, useLocation, useNavigate } from '@remix-run/react';
import CloseMenu from '~/components/icons/closeMenu';
import { Button } from '~/components/ui/button';
import { PredictiveSearch } from '~/components/ui/predictive-search';
import { Price } from '~/components/ui/price';
import { PRODUCT_MAX_PRICE } from '~/lib/constants/cartInfo.constant';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { Can } from '~/lib/helpers/Can';

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
  featuredImage: string;
  companyPrice: number;
  currency: string;
  defaultPrice: number;
  vendor: string;
  productVariantId: string;
  quantity: number;
  selectedUOM: number;
  currencySymbol: string;
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
  // console.log(finalResponse);

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
            <img src={product1?.featuredImage || DEFAULT_IMAGE?.IMAGE} alt="product1" className='object-contain h-full overflow-hidden' />
          </figure>
          <div className='pt-3'>
            <p className='text-lg font-medium leading-[22px] text-grey-900 overflow-y-hidden h-11 line-clamp-2'>
              <Link to={`/product/${product1?.handle}`} title={product1?.title}>
                {product1?.title}
              </Link>
            </p>
          </div>
          <div className="pt-2 pb-6">
            <Price currency={product1?.currency} price={product1?.companyPrice} originalPrice={product1?.companyPrice} currencySymbol={product1.currencySymbol} />
            <div className="pt-3 mb-3 border-b border-solid border-grey-50"></div>
            <Price currency={product1?.currency} price={product1?.companyPrice && product1?.companyPrice < PRODUCT_MAX_PRICE ? product1?.defaultPrice : 0} originalPrice={product1?.companyPrice && product1?.companyPrice < PRODUCT_MAX_PRICE ? product1?.defaultPrice : 0} variant="rrp" currencySymbol={product1.currencySymbol} />
            <Can I="view" a="add_to_cart">
              {product1?.companyPrice && product1?.companyPrice < PRODUCT_MAX_PRICE ?
                <Form method="post">
                  <input type="hidden" name="productId" value={product1?.id} />
                  <input type="hidden" name="productVariantId" value={product1?.productVariantId} />
                  <input type="hidden" name="quantity" value={product1?.quantity} />
                  <input type="hidden" name="selectUOM" value={product1?.selectedUOM} />
                  <Button className="w-full mt-3" variant="primary">Add to cart</Button>
                </Form>
                : <div className='h-[52px]'></div>}
            </Can>
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
            <img src={productDetails?.featuredImage || DEFAULT_IMAGE?.IMAGE} alt="product2" className='object-contain h-full overflow-hidden' />
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
          <div className="pt-2 pb-6">
            <Price currency={productDetails?.currency} price={productDetails?.companyPrice} originalPrice={productDetails?.companyPrice} currencySymbol={productDetails.currencySymbol} />
            <div className="pt-3 mb-3 border-b border-solid border-grey-50"></div>
            <Price currency={productDetails?.currency} price={productDetails?.companyPrice && productDetails?.companyPrice < PRODUCT_MAX_PRICE ? productDetails?.defaultPrice : 0} originalPrice={productDetails?.companyPrice && productDetails?.companyPrice < PRODUCT_MAX_PRICE ? productDetails?.defaultPrice : 0} variant="rrp" currencySymbol={productDetails.currencySymbol} />
            <Can I="view" a="add_to_cart">
              {productDetails?.companyPrice && productDetails?.companyPrice < PRODUCT_MAX_PRICE ?
                <Form method="post">
                  <input type="hidden" name="productId" value={productDetails?.id} />
                  <input type="hidden" name="productVariantId" value={productDetails?.productVariantId} />
                  <input type="hidden" name="quantity" value={productDetails?.quantity} />
                  <input type="hidden" name="selectUOM" value={productDetails?.selectedUOM} />
                  <Button className="w-full mt-3" variant="primary">Add to cart</Button>
                </Form>
                : <div className='h-[52px]'></div>}
            </Can>
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