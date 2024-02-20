import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
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
  try {
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
      throw new Error(response.message);
    }

    return {
      totalPromotionCount: response?.payload?.totalPromotions,
      promotions: response?.payload?.promotions,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}
