import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface CategoryDetailType {
  status: boolean;
  message: string;
  payload: Payload[];
}

export interface Payload {
  id: number;
  title: string;
  category_id: string;
  identifier: string;
  description: null | string;
  imageUrl: string;
  child_categories: Payload[];
}

export async function getCategoriesDetail() {
  try {
    const response = await useFetch<CategoryDetailType>({
      method: AllowedHTTPMethods.GET,
      url: ENDPOINT.CATEGORY.GET_DETAIL,
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

const formattedResponse = (response: CategoryDetailType) => {
  if (!response.payload || response.payload.length < 1) {
    return [];
  }

  const data: Payload[] = response.payload.map((item) => ({
    id: item?.id,
    title: item?.title,
    category_id: item?.category_id,
    identifier: item?.identifier,
    description: item?.description,
    imageUrl: item?.imageUrl,
    child_categories: item?.child_categories,
  }));

  return data;
};
