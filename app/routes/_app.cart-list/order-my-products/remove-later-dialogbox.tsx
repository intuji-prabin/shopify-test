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
      <DialogContent className="sm:max-w-[360px] track-an-order p-0 block">
        <DialogHeader>
          <DialogTitle className="leading-6 font-bold italic text-lg text-grey-900 flex p-4 justify-center items-center flex-col gap-3">
            <div className="bg-semantic-danger-100 p-[10px] rounded-[50%]">
              <RemoveItem />
            </div>
            <h3 className="font-medium leading-[22px] text-lg text-grey-900 not-italic capitalize">
              clear cart
            </h3>
            <p className="font-normal leading-[21px] text-base text-center">
              All products will be removed from your cart. Are you sure you want
              to continue?
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
            continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
