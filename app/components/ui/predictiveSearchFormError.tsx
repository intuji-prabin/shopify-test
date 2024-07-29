import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';

export const PredictiveSearchFormError = ({
  quantity,
  moq,
}: {
  quantity: number;
  moq: string;
}) => {
  return (
    <p className="font-medium leading-none text-red-500 pt-1.5">
      {quantity < Number(moq) && quantity >= 1 && (
        <>Orders below MOQ ({moq}) will incur additional surcharges</>
      )}
      {(quantity < 1 || isNaN(quantity)) && (
        <>Minimum order quantity should be greater than 0</>
      )}
      {quantity > CART_QUANTITY_MAX && (
        <>Maximum order quantity is {CART_QUANTITY_MAX}</>
      )}
    </p>
  );
};
