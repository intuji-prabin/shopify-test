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
  companyId: string,
) {
  try {
    const fData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fData.append(key, value);
    }
    fData.append('company_id', companyId);
    console.log('finalData', fData.get('logo'));

    const results: any = await fetch(`${ENDPOINT.PROMOTION.GET}`, {
      method: 'POST',
      body: fData,
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
