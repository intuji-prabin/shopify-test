import {ENDPOINT} from '~/lib/constants/endpoint.constant';

export async function getProductDetails(customerId: string, handle: string) {
  try {
    const results: any = await fetch(
      `${ENDPOINT.PRODUCT.GET_PRODUCT}/${customerId}/${handle}`,
      // `https://processors-fatty-dvds-destroyed.trycloudflare.com/api/product/${customerId}/${handle}`,
      {
        method: 'GET',
      },
    );
    const response = await results.json();
    // if (!results.status) {
    //   throw new Response(results.message, {
    //     status: 404,
    //   });
    // }
    if (response?.errors) {
      throw new Error('Something went wrong');
    }
    if (!response?.status) {
      throw new Error(response?.message);
    }
    return response.payload;
  } catch (error) {
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}
