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

export async function getPromotions(companyId: string) {
  try {
    const getPromotions = async (companyId: any, custom = false) => {
      const url =
        `${ENDPOINT.CUSTOM.URL}/promotion?company_id=${companyId}` +
        (custom ? '&custom_promotion=true' : '');
      const response = await useFetch<PromotionsResponse>({
        method: AllowedHTTPMethods.GET,
        url: url,
      });
      if (response?.payload?.promotions?.length === 0) {
        throw new Response('Oh no! Something went wrong!', {
          status: 404,
        });
      }
      return response?.payload?.promotions;
    };

    const promotions = await getPromotions(companyId);
    const myPromotions = await getPromotions(companyId, true);

    return {promotions, myPromotions};
  } catch (error) {
    return {promotions: [], myPromotions: []};
  }
}
