import {useState} from 'react';
import {FetcherWithComponents, useFetcher} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import {Button} from '~/components/ui/button';
import {DangerAlert, InfoAlert} from '~/components/icons/alert';
import {CreateableSelectInput} from '~/components/ui/createable-select';
import {Product} from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Can } from '~/lib/helpers/Can';

interface GroupItem {
  productId: string;
  quantity: number;
  uom: string;
}

type Submit = 'create' | 'update';

export interface SubmitPayload {
  groupItemList: GroupItem[];
  submitType: Submit;
  group: string;
}

interface CreateGroupProps {
  table: Table<Product>;
  selectedValue: string | null;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | null>>;
  fetcher: FetcherWithComponents<unknown>;
  productGroupOptions: {value: string; label: string}[];
  numberOfSelectedRows: number;
  handleSaveForLater: () => void;
  error: {
    isError: boolean;
    message: string;
  };
  setError: React.Dispatch<
    React.SetStateAction<{
      isError: boolean;
      message: string;
    }>
  >;
}
export default function CreateGroup({
  table,
  error,
  fetcher,
  selectedValue,
  setError,
  handleSaveForLater,
  numberOfSelectedRows,
  setSelectedValue,
  productGroupOptions,
}: CreateGroupProps) {
  return (
    <Dialog>
      <Can I="view" a="save_product_list_to_group">
        <DialogTrigger asChild>
          <Button
            variant={numberOfSelectedRows === 0 ? 'disabled' : 'primary'}
            className="min-w-[111px] min-h-10"
          >
            Save for later
          </Button>
        </DialogTrigger>
      </Can>
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

          <CreateableSelectInput
            error={error}
            setError={setError}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            options={productGroupOptions}
          />

          {error.isError ? (
            <p className="pt-1 error-msg">
              <DangerAlert />
              <span className="pl-2">{error.message}</span>
            </p>
          ) : (
            <p className="pt-1 error-msg !text-grey-500">
              <InfoAlert />
              <span className="pl-2">
                Create or Select a New Group, Name Must Be Under 50 Characters
              </span>
            </p>
          )}
        </div>
        <DialogFooter className="block p-4">
          <Button
            type="submit"
            variant={
              error.isError ||
              fetcher.state === 'submitting' ||
              fetcher.state !== 'idle'
                ? 'disabled'
                : 'primary'
            }
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
