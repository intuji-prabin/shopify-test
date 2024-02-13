import {Link} from '@remix-run/react';
import {Children, Fragment} from 'react';

type Props = {
  children?: React.ReactNode;
};

type ItemsProps = Props & {
  href?: string;
  className?: string;
};

const Breadcrumb = ({children}: Props) => {
  const childrenArray = Children.toArray(children);
  const childrenWithSeperator = childrenArray.map((child, index) => {
    if (index !== childrenArray.length - 1) {
      return (
        <Fragment key={`breadcrumb-${index}`}>
          {child}
          <li>
            <span className="breadcrumb--icon">/</span>
          </li>
        </Fragment>
      );
    }
    return child;
  });

  return (
    <div data-cy="breadcrumb-nav">
      <ul className="flex flex-wrap gap-x-1.5 text-grey-400">
        {childrenWithSeperator}
      </ul>
    </div>
  );
};

const BreadcrumbItem = ({children, className, href, ...props}: ItemsProps) => {
  return (
    <li {...props}>
      {href ? (
        <Link to={href} className={className}>
          {children}
        </Link>
      ) : (
        <>{children}</>
      )}
    </li>
  );
};

export {Breadcrumb, BreadcrumbItem};
