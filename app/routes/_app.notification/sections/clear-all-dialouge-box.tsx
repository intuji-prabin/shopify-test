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
export default function ClearAllDialouge({
  handleRemoveAllItems,
}: {
  handleRemoveAllItems: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">clear all</Button>
      </DialogTrigger>
      <DialogContent
        id="clear-all-notifications-dialogue"
        className="sm:max-w-[360px] track-an-order p-0 block "
      >
        <DialogHeader>
          <DialogTitle className="leading-6 font-bold italic text-lg text-grey-900 flex p-4 justify-center items-center flex-col gap-3">
            <div className="bg-semantic-danger-100 p-[10px] rounded-[50%]">
              <RemoveItem />
            </div>
            <h3 className="font-medium leading-[22px] text-lg text-grey-900 not-italic">
              CLear all
            </h3>
            <p className="font-normal leading-[21px] text-base text-center">
              Are you sure you want to clear all the notifications? This action
              cannot be undone.
            </p>
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
            Yes, clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
