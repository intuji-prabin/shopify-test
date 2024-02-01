import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { useFetch } from '~/hooks/useFetch';
import { ENDPOINT } from '~/lib/constants/endpoint.constant';
import { getUserDetails, isAuthenticate } from '~/lib/utils/authsession.server';
import PromotionHeader from './promotion-header';
import PromotionList from './promotion-list';
import { PromotionsResponse } from './promotion-server';

export async function loader({ context }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(context);
  const companyId = userDetails.meta.company_id.value;

  // try {
  //   const promotions = (await useFetch({
  //     url: ENDPOINT.CUSTOM.URL + "/promotion?company_id=" + companyId,
  //   })) as PromotionsResponse;
  //   const myPromotions = (await useFetch({
  //     url: ENDPOINT.CUSTOM.URL + "/promotion?company_id=" + companyId + "&custom_promotion=true",
  //   })) as PromotionsResponse;
  //   return json({ promotions, myPromotions });
  // } catch (error) {
  //   return json({ promotions: [] });
  // }

  try {
    const fetchPromotions = async (companyId: string, custom: boolean = false): Promise<PromotionsResponse> => {
      const url = `${ENDPOINT.CUSTOM.URL}/promotion?company_id=${companyId}${custom ? "&custom_promotion=true" : ""}`;
      return await useFetch({ url }) as PromotionsResponse;
    };

    const promotionsPromise = fetchPromotions(companyId);
    const myPromotionsPromise = fetchPromotions(companyId, true);

    const [promotions, myPromotions] = await Promise.all([promotionsPromise, myPromotionsPromise]);

    return json({ promotions, myPromotions });
  } catch (error) {
    return json({ promotions: [] });
  }

}

const Promotions = () => {
  const { promotions, myPromotions } = useLoaderData<typeof loader>();
  console.log("test", promotions)
  console.log("mypromotions", myPromotions)

  return (
    <>
      <PromotionHeader />
      <PromotionList promotions={promotions.payload} />
    </>
  );
};

export default Promotions;
