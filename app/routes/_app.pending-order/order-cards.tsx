import {Link} from '@remix-run/react';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';
import {ProductGroup} from '~/routes/_app.pending-order/pending-order.server';

const TOTAL_GROUP_NUMBER = 10;

export function ProductGroupCardGrid({
  productGroupList,
}: {
  productGroupList: ProductGroup[];
}) {
  const emptyGroupNumber = TOTAL_GROUP_NUMBER - productGroupList.length;

  return (
    <section className="container grid grid-cols-1 mxs:grid-cols-2 md:grid-cols-4 gap-6 ">
      {productGroupList.map((productGroup) => (
        <ProductGroupCard key={productGroup.groupId} {...productGroup} />
      ))}
      {[...Array(emptyGroupNumber)].map((_, index) => (
        <EmptyGroupCard key={index} />
      ))}
    </section>
  );
}

function ProductGroupCard({groupId, groupName, totalItems}: ProductGroup) {
  return (
    <div className="bg-white  max-[unset] md:max-w-[302px] p-4 space-y-12 min-h-[149px] flex flex-col justify-between">
      <ul className="flex justify-between items-start">
        <li className="font-bold text-2xl  italic leading-[29px] text-grey-900 capitalize">
          {groupName}
        </li>
        <li className="text-primary-500 font-medium text-lg leading-[22px]">
          {totalItems} items
        </li>
      </ul>
      <Button variant="ghost" className="w-full">
        <Link
          to={`${Routes.PENDING_ORDER}/${groupId}`}
          prefetch="intent"
          className="w-full"
        >
          View Items
        </Link>
      </Button>
    </div>
  );
}

function EmptyGroupCard() {
  return (
    <Link
      className="border-dashed border-2 border-grey-100 max-[unset] md:max-w-[302px]  space-y-12 flex items-center justify-center min-h-[149px]"
      to={Routes.PLACE_AN_ORDER}
      prefetch="intent"
    >
      <h3 className="font-bold italic uppercase text-lg leading-[22px] text-grey-200">
        add group
      </h3>
    </Link>
  );
}
