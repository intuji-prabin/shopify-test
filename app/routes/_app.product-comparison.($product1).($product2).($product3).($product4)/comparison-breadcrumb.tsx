
import { Link } from '@remix-run/react';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Routes } from '~/lib/constants/routes.constent';

export default function ComparisonBreadcrumb({ title, link }: { title: string, link?: string }) {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Link to={`${"/product/" + link || Routes.CATEGORIES}`}>
          <Button
            type="button"
            size="icon"
            data-cy="back-button"
            variant="ghost"
            className="duration-300 border-grey-50 group group-hover:bg-inherit hover:border-primary-500"
          >
            <ArrowLeft className="text-grey-400 group-hover:text-primary-500" />
          </Button>
        </Link>
        <h3 className='capitalize'>{title}</h3>
      </div>
      <Breadcrumb>
        <BreadcrumbItem href={Routes.CATEGORIES}>Products</BreadcrumbItem>
        <BreadcrumbItem
          className="capitalize text-grey-900"
        >
          {title}
        </BreadcrumbItem>
      </Breadcrumb>
    </>
  );
}
