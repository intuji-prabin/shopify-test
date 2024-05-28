import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {PromotionType} from '../_app.customise_.$promotionId/promotion.server';

interface FormDataObject {
  [key: string]: string | Blob;
}

export const getMyPromotionById = async (
  promotionId: string,
  customerId: string,
) => {
  try {
    const results = await useFetch<PromotionType>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PROMOTION.GET_MYPROMOTION}/${customerId}/${promotionId}`,
    });

    if (!results.status) {
      throw new Response(results.message, {
        status: 404,
      });
    }
    return results;
  } catch (error) {
    console.log('error: ', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export async function updatePromotion(
  formData: FormDataObject,
  bannerId: string,
  customerId: string,
) {
  try {
    const fData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fData.append(key, value);
    }

    const results: any = await fetch(
      `${ENDPOINT.PROMOTION.GET_MYPROMOTION}/${customerId}/${bannerId}`,
      {
        method: 'PATCH',
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
    console.log('error: ', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
