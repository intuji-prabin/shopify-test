import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { getUserDetails, isAuthenticate } from '~/lib/utils/authsession.server';
import PromotionHeader from './promotion-header';
import PromotionList from './promotion-list';
import { getPromotions } from './promotion-server';

export async function loader({ context }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(context);
  const companyId = userDetails.meta.company_id.value;

  const response = await getPromotions(companyId);
  if (response) {
    return json({ response });
  }
  return { response: {} };
}

const Promotions = () => {
  const { response } = useLoaderData<any>();

  return (
    <>
      <PromotionHeader />
      <PromotionList promotionData={response} />
    </>
  );
};

export default Promotions;

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
