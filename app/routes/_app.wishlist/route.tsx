import {useLoaderData} from '@remix-run/react';
import {json} from '@remix-run/server-runtime';
import {WishListTable} from './wishlist';
import {items} from './wishlistItems';

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
