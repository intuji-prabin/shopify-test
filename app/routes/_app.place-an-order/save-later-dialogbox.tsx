import {VariantProps} from 'class-variance-authority';
import RemoveItem from '~/components/icons/removeItem';
import {Button, ButtonProps, buttonVariants} from '~/components/ui/button';
import {
  Dialog,
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
    | null
    | undefined;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="min-w-[111px] min-h-10">
          Save for later
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] track-an-order p-0 block">
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
          <input
            type="text"
            id="group-name"
            name="group-name"
            placeholder="Group Name"
            className="active:!border-grey-100 focus:!border-grey-100 hover:!border-grey-100 focu:bg-white active:bg-white hover:bg-white !bg-white"
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
