import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';

export type Product = {
  uom: string;
  uomName: string;
  defaultUOM: string;
  defaultUOMName: string;
  defaultPrice: number;
  compareAtPrice: number;
  companyPrice: number;
  unitOfMeasure: [
    {
      unit: string;
      conversion_factor: number;
    },
  ];
  priceRange: [
    {
      minQty: number;
      maxQty: number;
      price: string;
    },
  ];
  totalPrice: number;
  moq: number;
  quantity: number;
  sku: string;
  title: string;
  variantId: string;
  productId: string;
  featureImage: string;
};

type Group = {
  groupName: string;
  groupId: number;
  totalProduct: number;
  products: Product[];
};

type GetProductResponseSchema = {
  status: boolean;
  message: string;
  payload: Group;
};

export async function getGroupDetails({
  groupId,
  customerId,
}: {
  groupId: string;
  customerId: string;
}) {
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}?groupId=${groupId}`;

    const results = await useFetch<GetProductResponseSchema>({url});

    if (!results.status) {
      throw new Error(results.message);
    }
    return results.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}
