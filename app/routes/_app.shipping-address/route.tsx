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
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(context);
  const metaParentValue = userDetails.meta.parent.value;
  const customerId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;

  const shippingAddresses = await getAllCompanyShippingAddresses(customerId);
  return json({shippingAddresses});
}

export default function ShippingAddressMgmt() {
  const {shippingAddresses} = useLoaderData<typeof loader>();
  return (
    <div className="container pt-6 ">
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
      <ShippingAddressCards shippingAddresses={shippingAddresses} />
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
      <div className="container pt-6">
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
        <div className="min-h-[400px] flex justify-center items-center ">
          <div className="flex flex-col gap-4 items-center">
            <h3>No address found</h3>
            <p className="font-normal leading-[22px] text-lg text-grey">
              To add New Shipping Address please contact support
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
