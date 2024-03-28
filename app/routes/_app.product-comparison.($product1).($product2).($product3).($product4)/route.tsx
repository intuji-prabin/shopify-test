import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import ComparisonBreadcrumb from './comparison-breadcrumb';
import ComparisonWrapper from './comparison-main-wrapper';
import { Link, useLoaderData } from '@remix-run/react';
import { getSingleProduct } from './getProduct.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { Button } from '~/components/ui/button';
import { Routes } from '~/lib/constants/routes.constent';

export const loader = async ({ params, context, request }: LoaderFunctionArgs) => {
  const productResponse = {} as any;
  const { userDetails } = await getUserDetails(request);
  if (params?.product1) {
    productResponse.product1 = await getSingleProduct(context, params?.product1, userDetails?.id);
  }
  if (params?.product2) {
    productResponse.product2 = await getSingleProduct(context, params?.product2, userDetails?.id);
  }
  if (params?.product3) {
    productResponse.product3 = await getSingleProduct(context, params?.product3, userDetails?.id);
  }
  if (params?.product4) {
    productResponse.product4 = await getSingleProduct(context, params?.product4, userDetails?.id);
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
        </> :
        <div>
          <h4 className='text-center'>Please add initial product to compare from product detail page</h4>
          <Link to={Routes.CATEGORIES}>
            <Button className='mx-auto mt-4'>Go to categories</Button>
          </Link>
        </div>
      }
    </section>
  );
}
