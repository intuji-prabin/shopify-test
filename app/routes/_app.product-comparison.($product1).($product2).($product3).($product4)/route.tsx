import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError
} from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { AuthError } from '~/components/ui/authError';
import FullPageLoading from '~/components/ui/fullPageLoading';
import { PredictiveSearch } from '~/components/ui/predictive-search';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { addProductToCart } from '../_app.product_.$productSlug/product.server';
import { AuthError } from '~/components/ui/authError';
import { AuthErrorHandling } from '~/lib/utils/authErrorHandling';
import ComparisonBreadcrumb from './comparison-breadcrumb';
import ComparisonWrapper from './comparison-main-wrapper';
import { getSingleProduct } from './getProduct.server';
import ComparisonEmpty from './comparison-empty';

export const loader = async ({
  params,
  context,
  request,
}: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const productResponse = {} as any;
  const { userDetails } = await getUserDetails(request);
  if (params?.product1) {
    productResponse.product1 = await getSingleProduct(
      request,
      context,
      params?.product1,
      userDetails?.id,
    );
  }
  if (params?.product2) {
    productResponse.product2 = await getSingleProduct(
      request,
      context,
      params?.product2,
      userDetails?.id,
    );
  }
  if (params?.product3) {
    productResponse.product3 = await getSingleProduct(
      request,
      context,
      params?.product3,
      userDetails?.id,
    );
  }
  if (params?.product4) {
    productResponse.product4 = await getSingleProduct(
      request,
      context,
      params?.product4,
      userDetails?.id,
    );
  }
  return { productResponse };
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  const fromData = await request.formData();
  try {
    const cartInfo = Object.fromEntries(fromData);
    const accessTocken = (await getAccessToken(context)) as string;
    const addToCart = await addProductToCart(
      cartInfo,
      accessTocken,
      context,
      request,
    );
    setSuccessMessage(messageSession, 'Item added to cart successfully');
    return json(
      {},
      {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log('this is err', error?.message);
      setErrorMessage(messageSession, error?.message);
      return json(
        {},
        {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        },
      );
    }
    console.log('this is err');
    setErrorMessage(
      messageSession,
      'Item not added to cart. Please try again later.',
    );
    return json(
      {},
      {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      },
    );
  }
}

export default function route() {
  const { productResponse } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <>
      {navigation.state === 'loading' && <FullPageLoading />}
      <section className="container py-12">
        {Object.keys(productResponse).length > 0 ? (
          <>
            <ComparisonBreadcrumb title={'compare'} link={`${productResponse.product1.product.handle}`} />
            <ComparisonWrapper productResponse={productResponse} />
          </>
        ) : (
          <>
            <ComparisonBreadcrumb title={'compare'} />
            <div className='mt-6 overflow-x-auto bg-white'>
              <div className='flex gap-6 p-6'>
                <div className='min-w-[290px] w-full max-w-[290px]'>
                  <ComparisonEmpty />
                  <div className='h-[50vh]'></div>
                </div>
                <div className='min-w-[290px] w-full max-w-[290px]'>
                  <ComparisonEmpty />
                </div>
                <div className='min-w-[290px] w-full max-w-[290px]'>
                  <ComparisonEmpty />
                </div>
                <div className='min-w-[290px] w-full max-w-[290px]'>
                  <ComparisonEmpty />
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    if(AuthErrorHandling( error.message )){ 
      return <AuthError errorMessage={error.message} />
    }
    return (
      <div className="container pt-6">
        <div className="min-h-[400px] flex justify-center items-center ">
          <div className="flex flex-col items-center gap-2">
            <h3>Error has occured</h3>
            <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
