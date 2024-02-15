import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
import {Button} from '~/components/ui/button';
import PromotionCard from '~/routes/_app.promotions/promotion-card';

import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  Promotion,
  getPromotions,
} from '~/routes/_app.promotions/promotion.server';

export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(context);

  const companyId = userDetails.meta.company_id.value;
  try {
    const {promotions, totalPromotionCount} = await getPromotions({
      companyId,
    });

    return json({promotions});
  } catch (error) {
    console.log('error', error);
  }
}

export default function AvailablePromotionPage() {
  const {promotions} = useLoaderData<typeof loader>();

  return (
    <div className="pt-6">
      <div className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25">
        {promotions.map((promotion: Promotion) => (
          <div key={promotion.id}>
            <PromotionCard
              title={promotion.title}
              imageURL={promotion.image_url}
              id={promotion.id}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-6">
        <Button
          type="button"
          variant="primary"
          size="large"
          className="min-w-64"
        >
          Load More
        </Button>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <section className="container">
        <h1 className="text-center uppercase">No data found</h1>
      </section>
    );
  }
}
