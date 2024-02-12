import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
import PromotionHeader from './promotion-header';
import PromotionList from './promotion-list';
import {getPromotionsList} from './promotion-server';

export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(context);
  const companyId = userDetails.meta.company_id.value;

  const response = await getPromotionsList(companyId);
  if (response) {
    return json({response});
  }
  return {response: {}};
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  // Convert formData to a plain object

  const formDataObject: Record<string, FormDataEntryValue> = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  // Log the formDataObject
  console.log(formDataObject);
  return null;
}

const Promotions = () => {
  const {response} = useLoaderData<any>();

  return (
    <section className="container">
      <div className="relative">
        <PromotionHeader />
        {response?.promotions.length > 0 ||
        response?.myPromotions.length > 0 ? (
          <PromotionList promotionData={response} />
        ) : (
          'No data found'
        )}
      </div>
    </section>
  );
};

export default Promotions;

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
