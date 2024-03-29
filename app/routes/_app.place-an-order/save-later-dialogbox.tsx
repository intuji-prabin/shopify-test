import {VariantProps} from 'class-variance-authority';
import React, {useEffect} from 'react';
import RemoveItem from '~/components/icons/removeItem';
import {Button, ButtonProps, buttonVariants} from '~/components/ui/button';
import {ComboboxDemo} from '~/components/ui/createable-select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

export default function CreateGroup({
  isDisabled,
  productGroupOptions,
}: {
  isDisabled: boolean;
  productGroupOptions: {value: string; label: string}[];
}) {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);
  console.log('selectedValue', selectedValue);

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
          >
            Save for later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
