import {LoaderFunctionArgs, json, redirect} from '@remix-run/server-runtime';
import {isAuthenticate, getUserDetails} from '~/lib/utils/authsession.server';
import PromotionHeader from './promotion-header';
import PromotionList from './promotion-list';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {PromotionsResponse} from './promotion-server';
import {useLoaderData} from '@remix-run/react';

export async function loader({context}: LoaderFunctionArgs) {
  try {
    await isAuthenticate(context);
    const userDetails = await getUserDetails(context);
    // console.log('Extacting Company Id =>', userDetails.userDetails.meta.company_id.id);
    const promotions = (await useFetch({
      url: ENDPOINT.CUSTOM.PROMOTIONS + '1',
    })) as PromotionsResponse;
    return json({promotions});
  } catch (error) {
    return redirect('/login');
  }
}

const Promotions = () => {
  const {promotions} = useLoaderData<typeof loader>();

  return (
    <>
      <PromotionHeader />
      <PromotionList promotions={promotions.payload} />
    </>
  );
};

export default Promotions;
