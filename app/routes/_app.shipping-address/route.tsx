import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import { CircleInformationMajor } from '~/components/icons/orderStatus';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Routes } from '~/lib/constants/routes.constent';
import ShippingAddressHeader from './shipping-address-breadcrumb';
import ShippingAddressCards from './shipping-address-card';
import { getAllCompanyShippingAddresses } from './shipping-address.server';

export async function loader() {
  const response = await getAllCompanyShippingAddresses("7710910808350");
  if (!response.data.customer.defaultAddress || response.data.customer.addresses.length === 0) {
    throw new Response("Oh no! Something went wrong!", {
      status: 404,
    });
  }
  else {
    return response?.data?.customer;
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
      <section className='container'>
        <h1 className='text-center uppercase'>No data found</h1>
      </section>
    )
  }
}