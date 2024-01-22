import {useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {ProductCard} from '~/components/ui/product-card';
import {ProductCardData} from './product-card-data';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {FilterForm, SortByFilterForm} from './filter-form';

export async function loader({params}: LoaderFunctionArgs) {
  return json({id: params.childCategoryId});
}
export default function ProductPage() {
  const {id} = useLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1">
        <h1 className="sticky top-[100px] bg-neutral-white p-4">
          <FilterForm />
        </h1>
      </div>
      <div className="col-start-2 col-end-5">
        <SortByFilterForm />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 my-6">
          {ProductCardData.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        <div className="bg-neutral-white py-4 px-6 border-t flex items-center justify-between w-full">
          <p className="w-40 text-grey-400 font-medium">
            1-7 of {ProductCardData.length} Items
          </p>
          <PaginationWrapper pageSize={5} totalCount={ProductCardData.length} />
        </div>
      </div>
    </div>
  );
}
