import {useNavigation, useSearchParams} from '@remix-run/react';
import {PAGE_LIMIT} from '~/routes/_app.promotions/promotion-constants';

export function useLoadMore({
  totalPromotionCount,
}: {
  totalPromotionCount: number;
}) {
  const pageParam = 'page';

  const [searchParams, setSearchParams] = useSearchParams();

  const navigation = useNavigation();

  const currentPage = Number(searchParams.get(pageParam) || 1);

  const totalPages = Math.ceil(totalPromotionCount / PAGE_LIMIT);

  const isLoadMoreDisabled = currentPage >= totalPages;

  const isLoading = navigation.state === 'loading';

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams);

    params.set(pageParam, String(currentPage + 1));

    setSearchParams(params, {
      preventScrollReset: true,
    });
  };

  return {isLoading, isLoadMoreDisabled, handleLoadMore};
}
