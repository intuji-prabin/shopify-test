import {useNavigation, useSearchParams} from '@remix-run/react';
import {
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

const PaginationSimple = ({
  paginationInfo,
  totalLength,
  page,
  pageSize,
}: {
  paginationInfo: any;
  totalLength: number;
  page: number;
  pageSize: number;
}) => {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  // Getting all query parameters
  let searchParamList = '';
  for (const [key, value] of searchParams.entries()) {
    if (key != 'page' && key != 'after' && key != 'before' && key != 'pageNo') {
      searchParamList += key + '=' + value + '&';
    }
  }

  const currentPageStartData = (page - 1) * pageSize;

  const currentPageEndData = totalLength + currentPageStartData;
  return (
    <>
      <p className="w-40 font-medium text-grey-400">
        {navigation.state !== 'loading' ? (
          <span>
            Showing {currentPageStartData === 0 ? 1 : currentPageStartData} -{' '}
            {currentPageEndData} items
          </span>
        ) : (
          <span>Loading...</span>
        )}
      </p>
      <PaginationContent>
        <li className="flex items-center mr-3 gap-x-1">
          <span className="text-grey-400">Page : </span>
          <span className="p-2 font-medium border border-solid flex justify-center items-center border-grey-50 text-grey-900 w-[34px] h-[34px]">
            {page}
          </span>
        </li>
        <li>
          <ul className="flex gap-x-3">
            <PaginationPrevious
              to={`?${searchParamList}page=${
                paginationInfo?.startCursor
              }&before=true&pageNo=${page - 1}`}
              aria-disabled={!paginationInfo?.hasPreviousPage}
              className={
                !paginationInfo?.hasPreviousPage
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
              tabIndex={!paginationInfo?.hasPreviousPage ? -1 : undefined}
            />
            <PaginationNext
              to={`?${searchParamList}page=${
                paginationInfo?.endCursor
              }&after=true&pageNo=${page + 1}`}
              aria-disabled={!paginationInfo?.hasNextPage}
              className={
                !paginationInfo?.hasNextPage
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
              tabIndex={!paginationInfo?.hasNextPage ? -1 : undefined}
            />
          </ul>
        </li>
      </PaginationContent>
    </>
  );
};

export default PaginationSimple;
