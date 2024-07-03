import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {PromotionType} from '../_app.customise_.$promotionId/promotion.server';
import {getAccessToken, isImpersonating} from '~/lib/utils/auth-session.server';
import {AppLoadContext} from '@remix-run/server-runtime';

interface FormDataObject {
  [key: string]: string | Blob;
}

export const getMyPromotionById = async (
  context: AppLoadContext,
  request: Request,
  promotionId: string,
  customerId: string,
) => {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const results = await useFetch<PromotionType>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PROMOTION.GET_MYPROMOTION}/${customerId}/${promotionId}`,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
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
  context: AppLoadContext,
  request: Request,
  formData: FormDataObject,
  bannerId: string,
  customerId: string,
) {
  const accessTocken = (await getAccessToken(context)) as string;
  try {
    const fData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fData.append(key, value);
    }
    const isImpersonatingCheck = await isImpersonating(request);

    const results: any = await fetch(
      `${ENDPOINT.PROMOTION.GET_MYPROMOTION}/${customerId}/${bannerId}`,
      {
        method: 'PATCH',
        body: fData,
        headers: {
          'Impersonate-Enable': isImpersonatingCheck,
          Authorization: accessTocken,
        },
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
