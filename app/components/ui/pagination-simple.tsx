import {useSearchParams} from '@remix-run/react';
import {
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

const PaginationSimple = () => {
  const pageParam = 'page';
  const [queryParams] = useSearchParams();
  const currentPage = Number(queryParams.get(pageParam) || 1);

  const previousQuery = new URLSearchParams(queryParams);
  previousQuery.set(pageParam, String(currentPage - 1));

  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, String(currentPage + 1));
  return (
    <PaginationContent>
      <PaginationPrevious
        to={`?${previousQuery.toString()}`}
        // aria-disabled={isPreviousButtonDisabled}
        // className={isPreviousButtonDisabled ? 'pointer-events-none' : ''}
        // tabIndex={isPreviousButtonDisabled ? -1 : undefined}
      />
      <li className="font-medium text-grey-400 w-7 text-center">
        <span className="text-grey-900">{currentPage}</span>
      </li>
      <PaginationNext
        to={`?${nextQuery.toString()}`}
        // aria-disabled={isNextButtonDisabled}
        // className={isNextButtonDisabled ? 'pointer-events-none' : ''}
        // tabIndex={isNextButtonDisabled ? -1 : undefined}
      />
    </PaginationContent>
  );
};

export default PaginationSimple;
