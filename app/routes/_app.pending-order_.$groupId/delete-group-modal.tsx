import { useSubmit } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import RemoveItem from '~/components/icons/removeItem';
import { Delete } from '~/components/icons/delete';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '~/components/ui/dialog';

export function DeleteGroupModal({ groupName }: { groupName: string }) {
  const submit = useSubmit();

  const handleDelete = () => {
    const formData = new FormData();

    formData.append('_action', 'delete_group');

    submit(formData, {
      method: 'POST',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Delete />
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] track-an-order p-0 block"
        id="wishlist-remove-dialogue"
      >
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center gap-4 p-4 text-lg italic font-bold leading-6 text-grey-900">
            <div className="bg-semantic-danger-100 p-[10px] rounded-[50%]">
              <RemoveItem />
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <h3 className=" text-grey-800 leading-[22px] text-lg font-medium">
                Delete Group <span className='capitalize'>"{groupName}"</span>
              </h3>
              <p className="text-center font-normal leading-[21px] text-base text-neutral-400">
                All products will be removed from your List. Are you sure you
                want to continue?
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex px-4 pb-4">
          <DialogClose asChild>
            <Button type="button" className="w-full uppercase" variant="ghost">
              cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              variant="primary"
              className="w-full text-sm italic font-bold uppercase leading6 "
              onClick={() => {
                handleDelete();
              }}
            >
              Continue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
