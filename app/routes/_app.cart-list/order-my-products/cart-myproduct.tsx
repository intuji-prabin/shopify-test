import {Form, useFetcher} from '@remix-run/react';
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
import FullPageLoading from '~/components/ui/fullPageLoading';
import {useTable} from '~/hooks/useTable';
import {BulkTable} from './bulk-table';
import {useMyProductColumn} from './use-column';

export default function MyProducts({products, currency}: any) {
  const {columns} = useMyProductColumn(currency);
  const {table} = useTable(columns, products);

  const fetcher = useFetcher();

  let isLoading = fetcher.formData?.get('cartList-0');

  const [open, setOpen] = useState(false);

  const tableKey = new Date().getTime();

  return (
    <div className="relative flex flex-col w-full bg-white my-product-wrapper">
      <div className="flex justify-between md:items-center my-[30px] flex-col gap-4 md:flex-row md:gap-0 items-baseline uppercase mx-6">
        <h3>My products</h3>
        <div className="flex gap-2 items-center w-full justify-between md:justify-[unset] md:w-[unset]">
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
                      className="w-full text-sm italic font-bold uppercase leading6 "
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
                        fetcher.submit(formData, {method: 'DELETE'});
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

      <div className="border-t border-grey-50 cart-order">
        {isLoading ? (
          <FullPageLoading description="Loading...." />
        ) : (
          <Form method="PUT">
            <DataTable
              table={table}
              renderSubComponent={renderSubComponent}
              key={tableKey}
            />
            <Button
              className="absolute top-[31px] right-40"
              variant="primary"
              type="submit"
            >
              Update cart
            </Button>
          </Form>
        )}
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
    />
  );
};
