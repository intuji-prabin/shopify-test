import {Dialog, DialogClose, DialogContent} from '~/components/ui/dialog';
import {Delete} from '~/components/icons/delete';
import {Button} from '~/components/ui/button';

type ConfirmDeleteModalTypes = {
  isConfirmDialogOpen: boolean;
  setDialogState: React.Dispatch<
    React.SetStateAction<{
      isUploadCSVDialogOpen: boolean;
      isConfirmDialogOpen: boolean;
    }>
  >;
  setFile?: React.Dispatch<React.SetStateAction<string | null>>;
};

export function ConfirmDeleteModal({
  isConfirmDialogOpen,
  setDialogState,
  setFile,
}: ConfirmDeleteModalTypes) {
  return (
    <Dialog
      open={isConfirmDialogOpen}
      onOpenChange={() =>
        setDialogState((previousState) => ({
          ...previousState,
          isConfirmDialogOpen: false,
        }))
      }
    >
      <DialogContent>
        <figure>
          <div className="flex justify-center items-center mb-4">
            <span className="h-10 w-10 bg-semantic-danger-100 flex justify-center items-center rounded-full">
              <Delete />
            </span>
          </div>
          <figcaption className="text-center">
            <p className="text-lg leading-5.5 font-medium text-grey-900 mb-1">
              Delete File
            </p>
            <p className="text-grey-400">
              Are you sure you want to delete this file? This action cannot be
              undone.
            </p>
          </figcaption>
        </figure>
        <div className="grid grid-cols-2 gap-x-2">
          <Button
            className="uppercase"
            variant="ghost"
            onClick={() =>
              setDialogState({
                isUploadCSVDialogOpen: true,
                isConfirmDialogOpen: false,
              })
            }
          >
            cancel
          </Button>
          <DialogClose asChild></DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                setFile && setFile(null);
              }}
            >
              yes,delete
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
