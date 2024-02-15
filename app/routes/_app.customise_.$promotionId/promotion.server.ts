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

export async function createPromotion({formData}: any) {
  try {
    console.log('hi');
    // const body = {
    //   company_name: 'Kumari pvt ltd',
    //   company_id: 'abc12345',
    //   company_email: 'hgjghj',
    //   company_domain: 'ghdh',
    //   company_fax: '45464',
    //   color: 'ghfgh',
    //   background_color: 'fghdfg',
    //   image: new Blob(['dummy image file'], {type: 'image/jpeg'}),
    //   logo: new Blob(['dummy image file'], {type: 'image/jpeg'}),
    // };
    // const fData = new FormData();
    // for (const [key, value] of Object.entries(data)) {
    //   fData.append(key, value);
    // }
    // console.log('sal', fData);

    // const body = fData;

    const results = await fetch(ENDPOINT.PROMOTION.GET, {
      method: 'POST',
      body: formData,
    });
    console.log('finaltest', results);

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
