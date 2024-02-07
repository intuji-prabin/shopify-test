import RemoveItem from '~/components/icons/removeItem';
import {Button} from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {DialogClose} from '~/components/ui/dialog';
export default function RemoveDialogbox({
  handleRemoveAllItems,
}: {
  handleRemoveAllItems: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="track-time flex gap-1 items-center uppercase flex-grow bg-semantic-danger-500 text-white">
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] track-an-order p-0 block"
        id="wishlist-remove-dialogue"
      >
        <DialogHeader>
          <DialogTitle className="leading-6 font-bold italic text-lg text-grey-900 flex p-4 justify-center items-center flex-col gap-4">
            <div className="bg-semantic-danger-100 p-[10px] rounded-[50%]">
              <RemoveItem />
            </div>
            Are you sure you want to remove item?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="px-4 pb-4 flex">
          <DialogClose asChild>
            <Button type="button" className="uppercase w-full" variant="ghost">
              cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="w-full italic font-bold uppercase leading6 text-sm "
            variant="primary"
            onClick={handleRemoveAllItems}
          >
            Yes! remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
