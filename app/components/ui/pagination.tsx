import * as React from 'react';
import {ChevronLeft, ChevronRight, MoreHorizontal} from 'lucide-react';
import {type ButtonProps, buttonVariants} from '~/components/ui/button';
import {Link} from '@remix-run/react';
import {cn} from '~/lib/utils/utils';

const Pagination = ({className, ...props}: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({className, ...props}, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-3', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({className, ...props}, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <PaginationItem>
    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'primary' : 'ghost',
          size,
        }),
        'p-1.5 border-grey-50',
        className,
      )}
      {...props}
    />
  </PaginationItem>
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('', className)}
    {...props}
  >
    <ChevronLeft className="h-5 w-5" />
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('', className)}
    {...props}
  >
    <ChevronRight className="h-5 w-5" />
  </PaginationLink>
);

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
