import {Link} from '@remix-run/react';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';

export default function OrderCards() {
  return (
    <section className="container grid grid-cols-1 mxs:grid-cols-2 md:grid-cols-4 gap-6 ">
      <div className="bg-white  max-[unset] md:max-w-[302px] p-4 space-y-12 min-h-[149px]">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          <Link to={Routes.SINGLE_PENDING_ITEM} className="w-full">
            View Items
          </Link>
        </Button>
      </div>
      <div className="bg-white  max-[unset] md:max-w-[302px] p-4 space-y-12 min-h-[149px]">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          <Link to="">View Items</Link>
        </Button>
      </div>
      <div className="bg-white  max-[unset] md:max-w-[302px] p-4 space-y-12 min-h-[149px]">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          <Link to="">View Items</Link>
        </Button>
      </div>
      <div className="bg-white  max-[unset] md:max-w-[302px] p-4 space-y-12 min-h-[149px]">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          <Link to="">View Items</Link>
        </Button>
      </div>
      <div className="bg-white  max-[unset] md:max-w-[302px] p-4 space-y-12 min-h-[149px]">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          <Link to="">View Items</Link>
        </Button>
      </div>

      <div className="bg-white  max-[unset] md:max-w-[302px] p-4 space-y-12 min-h-[149px]">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          <Link to="">View Items</Link>
        </Button>
      </div>
      <Link
        className="border-dashed border-2 border-grey-100 max-[unset] md:max-w-[302px]  space-y-12 flex items-center justify-center min-h-[149px]"
        to={''}
      >
        <h3 className="font-bold italic uppercase text-lg leading-[22px] text-grey-200">
          add group
        </h3>
      </Link>
      <Link
        className="border-dashed border-2 border-grey-100 max-[unset] md:max-w-[302px]  space-y-12 flex items-center justify-center min-h-[149px]"
        to={''}
      >
        <h3 className="font-bold italic uppercase text-lg leading-[22px] text-grey-200">
          add group
        </h3>
      </Link>
      <Link
        className="border-dashed border-2 border-grey-100 max-[unset] md:max-w-[302px]  space-y-12 flex items-center justify-center min-h-[149px]"
        to={''}
      >
        <h3 className="font-bold italic uppercase text-lg leading-[22px] text-grey-200">
          add group
        </h3>
      </Link>
      <Link
        className="border-dashed border-2 border-grey-100 max-[unset] md:max-w-[302px]  space-y-12 flex items-center justify-center min-h-[149px]"
        to={''}
      >
        <h3 className="font-bold italic uppercase text-lg leading-[22px] text-grey-200">
          add group
        </h3>
      </Link>
    </section>
  );
}
