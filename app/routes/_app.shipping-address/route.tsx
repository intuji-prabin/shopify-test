import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { MetaFunction } from '@shopify/remix-oxygen';
import { CircleInformationMajor } from '~/components/icons/orderStatus';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import ShippingAddressHeader from '~/routes/_app.shipping-address/shipping-address-breadcrumb';
import ShippingAddressCards from '~/routes/_app.shipping-address/shipping-address-card';
import {
  ShippingAddress,
  getAllCompanyShippingAddresses,
} from '~/routes/_app.shipping-address/shipping-address.server';
import { ShippingAddressError } from '~/routes/_app.shipping-address/shipping-address-error';
import { DEFAULT_ERRROR_MESSAGE } from '~/lib/constants/default-error-message.constants';

export const meta: MetaFunction = () => {
  return [{ title: 'Shipping Address' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);

  const metaParentValue = userDetails.meta.parent.value;

  const customerId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;

  const shippingAddresses = await getAllCompanyShippingAddresses(request, customerId);

  return json({ shippingAddresses });
}

export default function ShippingAddressMgmt() {
  const { shippingAddresses } = useLoaderData<typeof loader>();
  const shouldRender = useConditionalRender('view_shipping_addresses');

  return (
    shouldRender && (
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
        <ShippingAddressCards
          shippingAddresses={shippingAddresses as ShippingAddress}
        />
      </div>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <ShippingAddressError errorMessage={error.data} />;
  } else if (error instanceof Error) {
    return <ShippingAddressError errorMessage={error.message} />;
  } else {
    return <h1>{DEFAULT_ERRROR_MESSAGE}</h1>;
  }
}
