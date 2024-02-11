import {useNavigation, useSearchParams} from '@remix-run/react';
import {
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

const PaginationSimple = ({
  paginationInfo,
  totalProductLength,
  currentPage,
  setCurrentPage,
}: {
  paginationInfo: any;
  totalProductLength: number;
  currentPage: number;
  setCurrentPage: any;
}) => {
  const navigation = useNavigation();
  // console.log('object', window.location);

  const prevBtn = () => {
    if (paginationInfo?.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextBtn = () => {
    if (paginationInfo?.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const showProductPerPage = 3;

  const currentPageStartData = (currentPage - 1) * showProductPerPage;
  const currentPageEndData = totalProductLength + currentPageStartData;

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
            {currentPage}
          </span>
        </li>
        <li>
          <ul className="flex gap-x-3">
            <PaginationPrevious
              to={`?page=${paginationInfo?.startCursor}&before=true&pageNo=${
                currentPage - 1
              }`}
              aria-disabled={!paginationInfo?.hasPreviousPage}
              className={
                !paginationInfo?.hasPreviousPage
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
              tabIndex={!paginationInfo?.hasPreviousPage ? -1 : undefined}
              onClick={prevBtn}
            />
            <PaginationNext
              to={`?page=${paginationInfo?.endCursor}&after=true&pageNo=${
                currentPage + 1
              }`}
              aria-disabled={!paginationInfo?.hasNextPage}
              className={
                !paginationInfo?.hasNextPage
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
              tabIndex={!paginationInfo?.hasNextPage ? -1 : undefined}
              onClick={nextBtn}
            />
          </ul>
        </li>
      </PaginationContent>
    </>
  );
};

export default PaginationSimple;
