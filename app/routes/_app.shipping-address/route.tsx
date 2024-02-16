import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {MetaFunction} from '@shopify/remix-oxygen';
import {CircleInformationMajor} from '~/components/icons/orderStatus';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {Routes} from '~/lib/constants/routes.constent';
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
import ShippingAddressHeader from '~/routes/_app.shipping-address/shipping-address-breadcrumb';
import ShippingAddressCards from '~/routes/_app.shipping-address/shipping-address-card';
import {getAllCompanyShippingAddresses} from '~/routes/_app.shipping-address/shipping-address.server';

export const meta: MetaFunction = () => {
  return [{title: 'Shipping Address'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  try {
    await isAuthenticate(context);
    const {userDetails} = await getUserDetails(context);
    const metaParentValue = userDetails.meta.parent.value;
    const customerId =
      metaParentValue === 'null' ? userDetails.id : metaParentValue;

    const response = await getAllCompanyShippingAddresses(customerId);
    if (response) {
      return json(response);
    }
    return null;
  } catch (error) {
    throw new Error('something went wrong');
  }
}

export default function ShippingAddressMgmt() {
  const results = useLoaderData<typeof loader>();
  return (
    <div className="container py-12 ">
      <ShippingAddressHeader title={'Shipping Address '} />
      <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3 mb-6'>
        <CircleInformationMajor />
        <AlertDescription className="text-base !translate-y-0 !pl-6">
          To edit or add new shipping address please&nbsp;
          <Link
            to={Routes.SUPPORT_CONTACT_US}
            className="font-medium underline text-semantic-info-500 decoration-1 decoration-semantic-info-500"
          >
            contact us.
          </Link>
        </AlertDescription>
      </Alert>
      <ShippingAddressCards data={results} />
    </div>
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
    return (
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>Something went wrong</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
