import {useState, useEffect} from 'react';
import {WishListResponse} from '~/routes/_app.wishlist/route';

const useSort = ({items}: {items: WishListResponse[]}) => {
  const [finalItems, setFinalItems] = useState(items);

  useEffect(() => {
    setFinalItems([...items].sort((a, b) => a.title.localeCompare(b.title)));
  }, [items]);
  return finalItems;
};

export default useSort;
