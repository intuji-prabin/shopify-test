import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type ResponseData = {
  status: boolean;
  message: string;
  payload: [];
};

export async function deletePromotion(request: Request) {
  const formData = await request.formData();

  const formDataObject: Record<string, FormDataEntryValue> = {};

  const promotionId: number[] = [];

  formData.forEach((value, key) => {
    formDataObject[key] = value;
    if (typeof value === 'string') {
      promotionId.push(parseInt(value));
    }
  });

  const url = `${ENDPOINT.PROMOTION.BULK_DELETE}`;

  const body = JSON.stringify({
    promotion_id: promotionId,
  });

  return await useFetch<ResponseData>({
    url,
    method: AllowedHTTPMethods.DELETE,
    body,
  });
}
