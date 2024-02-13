import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface PromotionsResponse {
  status: boolean;
  message: string;
  payload: Payload;
}

export interface Payload {
  totalPromotions: number;
  promotions: Promotion[];
}

export interface Promotion {
  id: number;
  title: string;
  image_url: string;
}

export async function getPromotions({
  companyId,
  custom = false,
  pageNumber,
}: {
  companyId: string;
  custom?: boolean;
  pageNumber?: number;
}) {
  const url =
    `${ENDPOINT.PROMOTION.GET}?page=${pageNumber}&company_id=${companyId}` +
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

  return {
    totalPromotionCount: response?.payload?.totalPromotions,
    promotions: response?.payload?.promotions,
  };
}
