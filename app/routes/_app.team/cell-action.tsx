import {Separator} from '~/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import ConfirmationForm from '~/routes/_app.team/confirmation-form';

type DeactivateDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeactivateDialog({
  isOpen,
  setIsOpen,
}: DeactivateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-4 gap-2 !rounded-none">
        <DialogHeader>
          <DialogTitle
            asChild
            className="text-lg leading-6 font-bold italic tracking-normal pb-4"
          >
            <h5>Deactivate Account</h5>
          </DialogTitle>
          <Separator />
          <DialogDescription className="py-4">
            <p className="text-lg font-medium leading-5.5 !text-grey-700">
              Are you sure you want to deactivate this user?
            </p>
            <ul className="list-disc pl-8 pt-4 flex flex-col space-y-4 text-base font-normal leading-5.5 text-grey-700">
              <li className="">
                <span className="font-medium">
                  After confirmation, the user account will be deactivated.
                </span>
                To reactivate the account you can simply change the switch of
                the user again.
              </li>
              <li>
                This action restricts the user's access to the system or
                platform, preventing them from logging in and using their
                account.
              </li>
              <li>
                This action blocks the user from using their account, making it
                impossible for them to log in and access the system or platform.
              </li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex !flex-col">
          <ConfirmationForm setIsOpen={setIsOpen} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
