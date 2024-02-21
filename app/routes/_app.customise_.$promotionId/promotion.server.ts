import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

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

export async function getPromotionById(promotionId: string) {
  try {
    const results = await useFetch<PromotionType>({
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
