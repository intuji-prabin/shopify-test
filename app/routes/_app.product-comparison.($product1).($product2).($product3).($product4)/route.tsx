import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import ComparisonBreadcrumb from './comparison-breadcrumb';
import ComparisonWrapper from './comparison-main-wrapper';
import { useLoaderData } from '@remix-run/react';
import { getSingleProduct } from './getProduct.server';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const productResponse = {} as any;
  if (params?.product1) {
    productResponse.product1 = await getSingleProduct(context, params?.product1);
  }
  if (params?.product2) {
    productResponse.product2 = await getSingleProduct(context, params?.product2);
  }
  if (params?.product3) {
    productResponse.product3 = await getSingleProduct(context, params?.product3);
  }
  if (params?.product4) {
    productResponse.product4 = await getSingleProduct(context, params?.product4);
  }
  return { productResponse }
}

export default function route() {
  const { productResponse } = useLoaderData<typeof loader>();
  return (
    <section className="container py-12">
      {Object.keys(productResponse).length > 0 ?
        <>
          <ComparisonBreadcrumb title={'compare'} />
          <ComparisonWrapper productResponse={productResponse} />
        </> : <div>Please add initial product to compare from product detail page</div>
      }
    </section>
  );
}
