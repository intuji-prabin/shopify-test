import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

type ResponseData = {
  status: boolean;
  message: string;
  payload: [];
};

export async function deletePromotion(
  request: Request,
  promotionId: number[],
  customerId: string,
) {
  const url = `${ENDPOINT.PROMOTION.BULK_DELETE}/${customerId}`;
  const isImpersonatingCheck = await isImpersonating(request);
  const body = JSON.stringify({
    promotion_id: promotionId,
  });

  const response = await useFetch<ResponseData>({
    url,
    method: AllowedHTTPMethods.DELETE,
    body,
    impersonateEnableCheck: isImpersonatingCheck,
  });

  return response;
}
