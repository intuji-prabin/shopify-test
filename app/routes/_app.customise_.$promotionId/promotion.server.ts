import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getAccessToken, isImpersonating} from '~/lib/utils/auth-session.server';
import {encrypt} from '~/lib/utils/cryptoUtils';

export interface PromotionType {
  status: boolean;
  message: string;
  payload: Payload;
}
export interface Payload {
  id: number;
  image_url: string;
  title: string;
  logo_url: string;
  company_name: string;
  company_id: string;
  company_email: string;
  company_domain: string;
  company_fax: string;
  color: string;
  background_color: string;
  created_by: string;
  expaire_at: Date;
  create_at: Date;
  updated_at: Date;
  phone: null;
  original_image: null;
}

export async function getPromotionById(
  context: AppLoadContext,
  request: Request,
  promotionId: string,
  customerId: string,
) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const results = await useFetch<PromotionType>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PROMOTION.GET}/${customerId}/${promotionId}`,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

    if (!results.status) {
      throw new Error(results.message);
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

interface FormDataObject {
  [key: string]: string | Blob;
}

export async function createPromotion(
  context: AppLoadContext,
  request: Request,
  formData: FormDataObject,
  bannerId: string,
  customerId: string,
) {
  const accessTocken = (await getAccessToken(context)) as string;
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const fData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fData.append(key, value);
    }
    fData.append('banner_id', bannerId);
    const results: any = await fetch(
      `${ENDPOINT.PROMOTION.GET}/${customerId}`,
      {
        method: 'POST',
        body: fData,
        headers: {
          Authorization: accessTocken,
          'Impersonate-Enable': isImpersonatingCheck,
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
