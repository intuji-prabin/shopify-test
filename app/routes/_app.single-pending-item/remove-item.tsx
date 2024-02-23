import {VariantProps} from 'class-variance-authority';
import RemoveItem from '~/components/icons/removeItem';
import {Button, ButtonProps, buttonVariants} from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
export default function CreateGroup({
  handleRemoveAllItems,
  buttonVariant,
}: {
  handleRemoveAllItems: () => void;
  buttonVariant:
    | 'link'
    | 'input'
    | 'primary'
    | 'secondary'
    | 'disabled'
    | 'ghost'
    | 'danger'
    | 'danger_dark'
    | null
    | undefined;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="min-w-[111px] min-h-10">
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
            <div className="flex items-center justify-center flex-col gap-1">
              <h3 className=" text-grey-800 leading-[22px] text-lg font-medium">
                Delete
              </h3>
              <p className="text-center font-normal leading-[21px] text-base text-neutral-400">
                All products will be removed from your List. Are you sure you
                want to continue?
              </p>
            </div>
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
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
