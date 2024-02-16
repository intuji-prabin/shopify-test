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
  custom = false,
  companyId,
  filterBy,
  pageNumber,
}: {
  companyId: string;
  filterBy?: string | null;
  custom?: boolean;
  pageNumber?: number;
}) {
  let url = `${ENDPOINT.PROMOTION.GET}?`;

  if (companyId) {
    url += `&company_id=${companyId}`;
  }

  if (filterBy) {
    url += `&filter_by=${filterBy}`;
  }
  if (custom) {
    url += '&custom_promotion=true';
  }

  if (pageNumber) {
    url += `&page=${pageNumber}`;
  }

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
