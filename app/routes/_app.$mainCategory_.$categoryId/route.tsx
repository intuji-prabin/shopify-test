import {useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Separator} from '~/components/ui/separator';
import {Routes} from '~/lib/constants/routes.constent';

export async function loader({params}: LoaderFunctionArgs) {
  const mainCategory = params.mainCategory;
  const categoryId = params.categoryId;
  return {mainCategory, categoryId};
}

const SubCat = () => {
  const {mainCategory, categoryId} = useLoaderData<any>();
  return (
    <section className="container">
      <div className="pt-6">
        <BackButton
          className="capitalize"
          title={categoryId?.split('-').join(' ') ?? 'Back'}
        />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
            {mainCategory?.split('-').join(' ')}
          </BreadcrumbItem>
          <BreadcrumbItem className="capitalize text-grey-800">
            {categoryId?.split('-').join(' ')}
          </BreadcrumbItem>
        </Breadcrumb>
        <Separator className="my-2" />
      </div>
    </section>
  );
};

export default SubCat;
