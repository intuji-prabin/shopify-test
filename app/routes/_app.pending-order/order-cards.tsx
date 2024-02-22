import {Button} from '~/components/ui/button';

export default function OrderCards() {
  return (
    <section className="container grid grid-cols-2 md:grid-cols-4 gap-6 ">
      <div className="bg-white  max-w-[302px] p-4 space-y-12">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          View Items
        </Button>
      </div>
      <div className="bg-white  max-w-[302px] p-4 space-y-12">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          View Items
        </Button>
      </div>
      <div className="bg-white  max-w-[302px] p-4 space-y-12">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          View Items
        </Button>
      </div>
      <div className="bg-white  max-w-[302px] p-4 space-y-12">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          View Items
        </Button>
      </div>
      <div className="bg-white  max-w-[302px] p-4 space-y-12">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          View Items
        </Button>
      </div>

      <div className="bg-white  max-w-[302px] p-4 space-y-12">
        <ul className="flex justify-between">
          <li className="font-bold text-2xl  italic leading-[29px] text-grey-900">
            Gloves
          </li>
          <li className="text-primary-500 font-medium text-lg leading-[22px]">
            6 items
          </li>
        </ul>
        <Button variant="ghost" className="w-full">
          View Items
        </Button>
      </div>
      <div className="border-dashed border-2 border-grey-100 max-w-[302px] p-4 space-y-12 flex items-center justify-center">
        <h3 className="font-bold italic uppercase text-lg leading-[22px] text-grey-200">
          add group
        </h3>
      </div>
    </section>
  );
}
