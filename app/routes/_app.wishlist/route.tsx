import {useLoaderData} from '@remix-run/react';
import {json} from '@remix-run/server-runtime';
import {WishListTable} from './wishlist';

//Type Definitions for the Wishlist Page
export type WishListProductType = {
  productImageUrl: string;
  productName: string;
  sku: string;
  inStock: boolean;
};
export type WishListItem = {
  id: string;
  product: WishListProductType;
  buyPrice: number;
  quantity: number;
  action: string;
};

//Dummy Static Data for the Wishlist Items
const items: WishListItem[] = [
  {
    id: 'm5gr84i9',
    action: 'add to cart',
    product: {
      sku: 'W1400190',
      productName:
        'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
      productImageUrl: 'product.png',
      inStock: true,
    },
    buyPrice: 200,
    quantity: 200,
  },
  {
    id: 'asdf2324',
    action: 'add to cart',
    product: {
      sku: 'W1400190',
      productName:
        'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
      productImageUrl: 'product.png',
      inStock: false,
    },
    buyPrice: 200,
    quantity: 200,
  },
];

//API calling function to fetch wishlisted products
async function getWishlistedItems() {
  return items;
}

export const loader = async () => {
  const items = await getWishlistedItems();
  return json({items});
};

export default function route() {
  const {items} = useLoaderData<typeof loader>();
  return (
    <>
      <WishListTable title="Wishlist" data={items} />
    </>
  );
}
