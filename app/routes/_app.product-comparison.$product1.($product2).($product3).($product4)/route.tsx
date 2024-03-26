import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import ComparisonBreadcrumb from './comparison-breadcrumb';
import ComparisonWrapper from './comparison-main-wrapper';
import { useLoaderData } from '@remix-run/react';
import { getSingleProduct } from './getProduct.server';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  let productId;
  switch (true) {
    case Boolean(params?.product2):
      productId = params.product2 ?? '';
      break;
    case Boolean(params?.product3):
      productId = params.product3 ?? '';
      break;
    case Boolean(params?.product4):
      productId = params.product4 ?? '';
      break;
    default:
      productId = params.product1 ?? '';
      break;
  }
  const productResponse = await getSingleProduct(context, productId);
  return { productResponse }
}

export default function route() {
  const { productResponse } = useLoaderData<typeof loader>();
  console.log("product", productResponse)
  return (
    <section className="container py-12">
      <ComparisonBreadcrumb title={'compare'} />
      <ComparisonWrapper />
    </section>
  );
}
