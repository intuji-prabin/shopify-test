import {
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

const PaginationSimple = ({ currentPage, previousQuery, nextQuery, paginationInfo }: { currentPage: number, previousQuery: any, nextQuery: any, paginationInfo: any }) => {
  console.log("paginationInfo", paginationInfo?.startCursor)
  return (
    <PaginationContent>
      <li className='flex items-center mr-3 gap-x-1'><span className='text-grey-400'>Page : </span><span className='p-2 font-medium border border-solid flex justify-center items-center border-grey-50 text-grey-900 w-[34px] h-[34px]'>{currentPage}</span></li>
      <li>
        <ul className='flex gap-x-3'>
          <PaginationPrevious
            to={`?page=${paginationInfo?.startCursor}&before=true`}
            // aria-disabled={isPreviousButtonDisabled}
            className={!paginationInfo?.hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
          // tabIndex={isPreviousButtonDisabled ? -1 : undefined}
          />
          <PaginationNext
            to={`?page=${paginationInfo?.endCursor}&after=true`}
            // aria-disabled={isNextButtonDisabled}
            className={!paginationInfo?.hasNextPage ? 'pointer-events-none opacity-50' : ''}
          // tabIndex={isNextButtonDisabled ? -1 : undefined}
          />
        </ul>
      </li>
    </PaginationContent>
  );
};

export default PaginationSimple;
