import {useSubmit} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import React from 'react';
import {Button} from '~/components/ui/button';
import {ComboboxDemo} from '~/components/ui/createable-select';
import {Product} from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {number, string} from 'zod';

interface GroupItem {
  productId: string;
  quantity: number;
  uom: string;
}

export default function CreateGroup({
  table,
  productGroupOptions,
}: {
  table: Table<Product>;
  productGroupOptions: {value: string; label: string}[];
}) {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const isDisabled = table.getSelectedRowModel().rows.length === 0;
  console.log('selectedValue', selectedValue);

  const groupItemList: GroupItem[] = [];

  table.getSelectedRowModel().flatRows.map((item) => {
    groupItemList.push({
      productId: item.original.productId,
      quantity: item.original.quantity,
      uom: item.original.uom,
    });
  });
  console.log('selected value', groupItemList);

  const submit = useSubmit();

  const handleSaveForLater = () => {
    //@ts-ignore
    submit(groupItemList, {method: 'POST', encType: 'application/json'});
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={isDisabled ? 'disabled' : 'primary'}
          className="min-w-[111px] min-h-10"
        >
          Save for later
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[452px] track-an-order p-0 block">
        <DialogHeader>
          <DialogTitle className="leading-6 font-bold italic text-lg text-grey-900 flex p-4 uppercase">
            Create a group
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 p-4 border-[1px] border-t-grey-100 border-b-0 border-x-0 ">
          <label
            htmlFor="orderNumber"
            className="text-base text-normal leading-[21px] text-grey-800"
          >
            Group Name
          </label>
          <ComboboxDemo
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            options={productGroupOptions}
          />
        </div>
        <DialogFooter className="block p-4">
          <Button
            type="submit"
            className="w-full italic font-bold uppercase leading6 text-sm "
            onClick={handleSaveForLater}
          >
            Save for later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
