import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

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
  expaire_at: string;
}

export async function getPromotions({
  context,
  request,
  custom = false,
  filterBy,
  pageNumber,
  customerId,
  paramsList,
}: {
  context: AppLoadContext;
  request: Request;
  filterBy?: string | null;
  custom?: boolean;
  pageNumber?: number;
  customerId?: string;
  paramsList?: any;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    let url = `${ENDPOINT.PROMOTION.GET}/${customerId}?`;
    if (paramsList?.filter_by) {
      url += `&filter_by=${paramsList?.filter_by}`;
    }
    if (custom) {
      url += '&custom_promotion=true';
    }

    if (paramsList?.page) {
      url += `&page=${paramsList?.page}`;
    }

    const response = await useFetch<PromotionsResponse>({
      method: AllowedHTTPMethods.GET,
      url,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
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
