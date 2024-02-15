import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export async function getPromotionById(promotionId: string) {
  try {
    const results = await useFetch<any>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PROMOTION.GET}/${promotionId}`,
    });

    if (!results) {
      throw new Response('Oh no! Something went wrong!', {
        status: 404,
      });
    }
    return results;
  } catch (error) {
    return {promotions: {}};
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
    // // const body = fData
    const results = await fetch(
      'https://personality-sullivan-vhs-barnes.trycloudflare.com/api/promotion',
      {
        method: 'POST',
        body: fData,
      },
    );

    if (!results) {
      throw new Response('Oh no! Something went wrong!', {
        status: 404,
      });
    }
    return results;
  } catch (error) {
    console.log('errr', error);
    return {};
  }
}
