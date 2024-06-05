import { Link, useSubmit } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useState } from 'react';
import { ValidatedForm, useIsValid } from 'remix-validated-form';
import { z } from 'zod';
import { Ordertrack } from '~/components/icons/orderStatus';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { TRACK_AN_ORDERID } from '~/lib/constants/general.constant';
import { Routes } from '~/lib/constants/routes.constent';
import { ConfirmationInput } from '~/routes/_app.team/confirmation-form';
import { useHamburgerMenu } from './HamburgerMenuContext';
import { Label } from '~/components/ui/label';
import { Can } from '~/lib/helpers/Can';
import Distance from '~/components/icons/distance';
import ArrowRight from '~/components/icons/arrowRight';

const TrackAnOrderFormValidator = z.object({
  trackAnOrderId: z
    .string()
    .trim()
    .min(1, { message: 'Purchase Order Number is required' }),
});

export const TrackAnOrderSchemaValidator = withZod(TrackAnOrderFormValidator);

export type TrackAnOrderFormType = z.infer<typeof TrackAnOrderFormValidator>;

export type TrackAnOrderFormFieldNameType = keyof TrackAnOrderFormType;

export function TrackAnOrderButton({
  trackAnOrderHome,
}: {
  trackAnOrderHome?: boolean;
}) {
  const { toggleMenu } = useHamburgerMenu();
  const [open, setOpen] = useState(false);
  const isConfirm = useIsValid('trackOrder-form');
  const submit = useSubmit();

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Can I="view" a="track_order">
        <DialogTrigger asChild>
          {trackAnOrderHome ? (
            <button className="cta__btn pr-6 pl-4 py-4 lg:py-6 lg:pl-6 lg:pr-8 text-lg italic font-bold capitalize bg-primary-500 text-white lg:text-xl xl:text-2xl min-h-[88px] flex justify-between items-center">
              <span className="flex items-center gap-1">
                <Distance />
                Track An Order
              </span>
              <span className="arrow__animation">
                <ArrowRight fillColor="#ffffff" />
              </span>
            </button>
          ) : (
            <button
              className="flex items-center gap-1 track-order"
              onClick={() => toggleMenu(false)}
            >
              <Ordertrack />
              <p className="text-base italic font-bold text-white uppercase ">
                Track an order
              </p>
            </button>
          )}
        </DialogTrigger>
      </Can>

      <DialogContent className="sm:max-w-[366px] track-an-order p-0 block">
        <DialogHeader>
          <DialogTitle className="flex p-4 text-lg italic font-bold leading-6 capitalize text-grey-900">
            Track an order
          </DialogTitle>
        </DialogHeader>
        <ValidatedForm
          id="trackOrder-form"
          validator={TrackAnOrderSchemaValidator}
          onSubmit={(_, event) => {
            submit(event.currentTarget);
            handleClick();
          }}
          method="POST"
          action={Routes.TRACK_AN_ORDER}
        >
          <div className="flex flex-col gap-1 px-4 pt-4 pb-2 border-[1px] border-t-grey-100 border-b-0 border-x-0 ">
            <Label className="capitalize">Purchase order number</Label>
            <ConfirmationInput
              name={TRACK_AN_ORDERID}
              placeholder="Purchase Order Number"
            />
          </div>
          <DialogFooter className="block p-4">
            <Button
              type="submit"
              className="w-full text-sm italic font-bold leading-6 uppercase"
              disabled={!isConfirm}
            >
              Track Order
            </Button>
          </DialogFooter>
        </ValidatedForm>
      </DialogContent>
    </Dialog>
  );
}
