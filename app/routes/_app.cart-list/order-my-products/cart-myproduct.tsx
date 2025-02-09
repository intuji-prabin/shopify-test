import {Form, useSubmit} from '@remix-run/react';
import {useState} from 'react';
import RemoveItem from '~/components/icons/removeItem';
import {Button} from '~/components/ui/button';
import {DataTable} from '~/components/ui/data-table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import Loader from '~/components/ui/loader';
import {useTable} from '~/hooks/useTable';
import {BulkTable} from './bulk-table';
import {useMyProductColumn} from './use-column';
import {DangerAlert} from '~/components/icons/alert';

export default function MyProducts({
  products,
  setUpdateCart,
  updateCart,
  fetcher,
}: any) {
  const {columns} = useMyProductColumn({
    setUpdateCart,
  });
  const {table} = useTable(columns, products);

  let isLoading = fetcher.formData?.get('cartList-0');

  const [open, setOpen] = useState(false);

  const submit = useSubmit();

  return (
    <div className="w-full xl:w-[calc(100%_-_435px)]">
      {updateCart && (
        <div className="flex gap-3 py-2 px-4 border-l-4 border-r-0 bg-semantic-danger-100 border-semantic-danger-500 border-y-0">
          <DangerAlert />
          <p className="text-base font-normal leading-[21px]">
            Please update your cart to continue
          </p>
        </div>
      )}
      <div className="relative flex flex-col bg-white mt-4">
        <div className="flex justify-between sm:items-center my-[30px] flex-col gap-4 sm:flex-row sm:gap-0 items-baseline uppercase mx-6">
          <h3>My products</h3>
          <div className="flex gap-2 items-center w-full justify-between sm:justify-[unset] sm:w-[unset]">
            <div className="flex gap-2">
              <div className="product-remove">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant={
                        table.getSelectedRowModel().rows.length === 0
                          ? 'disabled'
                          : 'danger_dark'
                      }
                      className="min-w-[111px] min-h-10"
                    >
                      Remove
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[360px] track-an-order p-0 block">
                    <DialogHeader>
                      <DialogTitle className="flex flex-col items-center justify-center gap-3 p-4 text-lg italic font-bold leading-6 text-grey-900">
                        <div className="bg-semantic-danger-100 p-[10px] rounded-[50%]">
                          <RemoveItem />
                        </div>
                        <h3 className="font-medium leading-[22px] text-lg text-grey-900 not-italic capitalize">
                          clear cart
                        </h3>
                        <p className="font-normal leading-[21px] text-base text-center">
                          All products will be removed from your cart. Are you
                          sure you want to continue?
                        </p>
                      </DialogTitle>
                    </DialogHeader>

                    <DialogFooter className="flex px-4 pb-4">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          className="w-full uppercase"
                          variant="ghost"
                        >
                          cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="w-full text-sm italic font-bold uppercase"
                        variant="primary"
                        onClick={() => {
                          const formData = new FormData();
                          table
                            .getSelectedRowModel()
                            .flatRows.map((item, index) =>
                              formData.append(
                                `cartList-${index}`,
                                item.original.id,
                              ),
                            );
                          formData.append('action', 'order_delete');
                          fetcher.submit(formData, {method: 'DELETE'});
                          setUpdateCart(false);
                          table.resetRowSelection();
                          setOpen(false);
                        }}
                      >
                        continue
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-grey-50 cart-order data__table">
          {isLoading ? (
            <div className="absolute inset-0 z-[9999] bg-white/95">
              <div className="flex items-center justify-center h-full gap-x-4 gap-y-2">
                <p className="text-lg">Loading....</p>
                <Loader width="w-8" height="h-8" />
              </div>
            </div>
          ) : (
            <Form
              method="PUT"
              onSubmit={(event) => {
                submit(event.currentTarget);
                setUpdateCart(false);
              }}
            >
              <DataTable
                table={table}
                renderSubComponent={renderSubComponent}
              />
              {updateCart && (
                <Button
                  className="absolute top-[75px] sm:top-[31px] right-6 sm:right-40 animate-btn"
                  variant="primary"
                  type="submit"
                >
                  Update cart
                </Button>
              )}
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

export const renderSubComponent = ({row}: any) => {
  return (
    <BulkTable
      product={row.original.priceRange}
      quantity={'Quantity'}
      price={'Price'}
      currency={row.original.currency}
      currencySymbol={row.original.currencySymbol}
      defaultUOM={row.original.defaultUOMName}
    />
  );
};
