import { FormEvent } from 'react';
import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import {
  PaginationContent,
  Pagination,
  PaginationPrevious,
  PaginationNext,
} from '~/components/ui/pagination';

type PaginationPropsType = {
  totalCount: number;
  pageSize: number;
};

function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
}

export function PaginationWrapper({ totalCount, pageSize }: PaginationPropsType) {
  const pageParam = 'page';

  const submit = useSubmit();
  const [queryParams] = useSearchParams();

  const totalPages = Math.ceil(totalCount / pageSize);

  const paginationRange = range(1, totalPages);

  const currentPage = Number(queryParams.get(pageParam) || 1);

  const previousQuery = new URLSearchParams(queryParams);
  previousQuery.set(pageParam, String(currentPage - 1));

  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, String(currentPage + 1));

  if (currentPage === 0) {
    return null;
  }

  const lastPage =
    paginationRange && paginationRange[paginationRange.length - 1];

  const isPreviousButtonDisabled = currentPage === 1;

  const isNextButtonDisabled = currentPage >= Number(lastPage);

  const startIndex = (currentPage - 1) * pageSize + 1;

  const endIndex = Math.min(startIndex + pageSize - 1, totalCount);

  return (
    <div
      className="flex items-center justify-between px-6 py-4 border-t bg-neutral-white"
      data-cy="pagination-wrapper"
    >
      <p
        className="hidden w-40 font-medium text-grey-400 sm:block"
        data-cy="pagination-items-count"
      >
        {startIndex}-{endIndex} of {totalCount} Items
      </p>
      <Pagination
        className="items-center justify-center sm:justify-end"
        data-cy="pagination"
      >
        <div className="flex items-center gap-6">
          <Form
            method="get"
            onChange={(event: FormEvent<HTMLFormElement>) => {
              submit(event.currentTarget);
            }}
            className="flex items-center space-x-2"
            data-cy="pagination-select-form"
          >
            <label
              htmlFor="page"
              className="text-base font-medium text-grey-400"
            >
              Page :{' '}
            </label>
            <select
              name="page"
              value={currentPage} // default value doesn't work
              onChange={() => { }}
              className=" !py-1.5 appearance-none !border-grey-50 text-base font-medium text-grey-900"
            >
              {paginationRange &&
                paginationRange.map((pageNumber, index) => (
                  <option key={index} value={pageNumber}>
                    {pageNumber}
                  </option>
                ))}
            </select>
          </Form>
          <PaginationContent>
            <PaginationPrevious
              to={`?${previousQuery.toString()}`}
              aria-disabled={isPreviousButtonDisabled}
              className={isPreviousButtonDisabled ? 'pointer-events-none' : ''}
              tabIndex={isPreviousButtonDisabled ? -1 : undefined}
              data-cy="pagination-previous-button"
            />
            <p className="font-medium text-center text-grey-400 whitespace-nowrap">
              <span className="text-grey-900" data-cy="pagination-page-count">
                {currentPage}
              </span>{' '}
              / {totalPages}
            </p>
            <PaginationNext
              to={`?${nextQuery.toString()}`}
              aria-disabled={isNextButtonDisabled}
              className={isNextButtonDisabled ? 'pointer-events-none' : ''}
              tabIndex={isNextButtonDisabled ? -1 : undefined}
              data-cy="pagination-next-button"
            />
          </PaginationContent>
        </div>
      </Pagination>
    </div>
  );
}
