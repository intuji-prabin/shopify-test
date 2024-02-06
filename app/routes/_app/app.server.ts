import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface CategoriesType {
  status: boolean;
  message: string;
  payload: Payload[];
}

export interface Payload {
  id: number;
  title: string;
  identifier: string;
  child_categories?: Payload[];
}

export async function getCategories() {
  try {
    const response = await useFetch<CategoriesType>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.CUSTOM.URL}/product/category`,
    });
    if (!response?.status) {
      throw new Error(response?.message);
    }
    return formattedResponse(response);
  } catch (e) {
    if (e instanceof Error) {
      return [];
    }
    return [];
  }
}

const formattedResponse = (response: CategoriesType) => {
  if (!response.payload || response.payload.length < 1) {
    return [];
  }

  const data: Payload[] = response.payload.map((item) => ({
    id: item?.id,
    title: item?.title,
    identifier: item?.identifier,
    child_categories: item?.child_categories,
  }));

  return data;
};
