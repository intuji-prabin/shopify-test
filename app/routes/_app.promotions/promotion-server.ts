import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface PromotionsResponse {
  status: boolean;
  message: string;
  payload: Payload[];
}

export interface Payload {
  id: number;
  image_url: string;
  title: null;
  logo_url: string;
  company_name: string;
  company_id: string;
  company_email: string;
  company_domain: string;
  company_fax: string;
  color: string;
  background_color: string;
  created_by: string;
  expaire_at: Date;
  create_at: Date;
  updated_at: Date;
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
      if (response?.payload.length === 0) {
        throw new Response('Oh no! Something went wrong!', {
          status: 404,
        });
      }
      return response?.payload;
    };

    const promotions = await getPromotions(companyId);
    const myPromotions = await getPromotions(companyId, true);

    return {promotions, myPromotions};
  } catch (error) {
    return {promotions: {}, myPromotions: {}};
  }
}
