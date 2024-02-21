import {ENDPOINT} from '~/lib/constants/endpoint.constant';

interface FormDataObject {
  [key: string]: string | Blob;
}

export async function updatePromotion(
  formData: FormDataObject,
  bannerId: string,
) {
  try {
    const fData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fData.append(key, value);
    }
    console.log('formData');

    const results: any = await fetch(`${ENDPOINT.PROMOTION.GET}/${bannerId}`, {
      method: 'PATCH',
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
