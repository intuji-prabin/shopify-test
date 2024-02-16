import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export async function getPromotionById(promotionId: string) {
  try {
    const results = await useFetch<any>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PROMOTION.GET}/${promotionId}`,
    });

    if (!results.status) {
      throw new Response(results.message, {
        status: 404,
      });
    }
    return results;
  } catch (error) {
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}

interface FormDataObject {
  [key: string]: string | Blob;
}

export async function createPromotion(
  formData: FormDataObject,
  bannerId: string,
) {
  try {
    const fData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fData.append(key, value);
    }
    fData.append('banner_id', bannerId);
    console.log('final', fData);

    const results: any = await fetch(
      'https://liberia-denver-sa-royal.trycloudflare.com/api/promotion',
      {
        method: 'POST',
        body: fData,
      },
    );

    if (!results.status) {
      throw new Response(results.message, {
        status: 404,
      });
    }
    return results;
  } catch (error) {
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}
