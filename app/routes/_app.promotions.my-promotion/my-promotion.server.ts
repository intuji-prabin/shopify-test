import {useFetch} from '~/hooks/useFetch';
import {ADMIN_ACCESS_TOKEN} from '~/lib/constants/auth.constent';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type ResponseData = {
  status: boolean;
  message: string;
  payload: [];
};

export async function deletePromotion(
  promotionId: number[],
  customerId: string,
) {
  const url = `${ENDPOINT.PROMOTION.BULK_DELETE}/${customerId}`;

  const body = JSON.stringify({
    promotion_id: promotionId,
  });

  const response = await useFetch<ResponseData>({
    url,
    method: AllowedHTTPMethods.DELETE,
    body,
  });

  return response;
}

export async function exportPromotion(promotionId: number[]) {
  const url = `${ENDPOINT.PROMOTION.BULK_EXPORT}`;

  const body = JSON.stringify({
    promotion_id: promotionId,
  });

  const options: RequestInit = {
    method: AllowedHTTPMethods.POST,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
    },
    body,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const contentType = response.headers.get('content-type');

    let fileData: ArrayBuffer | Blob;

    if (contentType && contentType === 'application/zip') {
      const buffer = await response.arrayBuffer();
      fileData = buffer;
    } else if (contentType && contentType === 'application/octet-stream') {
      const blob = await response.blob();
      fileData = blob;
    } else {
      throw new Error('Unexpected content type');
    }
    return fileData;
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}
