import { Form, Link, useLocation, useNavigate } from '@remix-run/react';
import CloseMenu from '~/components/icons/closeMenu';
import { Button } from '~/components/ui/button';
import { Price } from '~/components/ui/price';
import { PRODUCT_MAX_PRICE } from '~/lib/constants/cartInfo.constant';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { Can } from '~/lib/helpers/Can';
import ComparisonEmpty from './comparison-empty';

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
        <ProductDetailDiv productDetails={product1} clearSelectedProduct={clearSelectedProduct} />
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
            <Price currency={productDetails?.currency} price={productDetails?.companyPrice} originalPrice={productDetails?.companyPrice} />
            <div className="pt-3 mb-3 border-b border-solid border-grey-50"></div>
            <Price currency={productDetails?.currency} price={productDetails?.companyPrice && productDetails?.companyPrice < PRODUCT_MAX_PRICE ? productDetails?.defaultPrice : 0} originalPrice={productDetails?.companyPrice && productDetails?.companyPrice < PRODUCT_MAX_PRICE ? productDetails?.defaultPrice : 0} variant="rrp" />
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
        <ComparisonEmpty />
      }
    </div>
  )
}