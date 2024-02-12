import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface PromotionsResponse {
  status: boolean;
  message: string;
  payload: Payload;
}

export interface Payload {
  promotions: Promotion[];
}

export interface Promotion {
  id: number;
  title: null | string;
  image_url: string;
}
const getPromotions = async (companyId: any, custom = false) => {
  const url =
    `${ENDPOINT.PROMOTION.GET}?company_id=${companyId}` +
    (custom ? '&custom_promotion=true' : '');
  const response = await useFetch<PromotionsResponse>({
    method: AllowedHTTPMethods.GET,
    url: url,
  });
  if (!response.status) {
    throw new Response('Oh no! Something went wrong!', {
      status: 404,
    });
  }
  return response?.payload?.promotions;
};

export async function getPromotionsList(companyId: string) {
  try {
    const promotions = await getPromotions(companyId);
    const myPromotions = await getPromotions(companyId, true);
    console.log({promotions});
    console.log({myPromotions});

    return {promotions, myPromotions};
  } catch (error) {
    return {promotions: [], myPromotions: []};
  }
}
