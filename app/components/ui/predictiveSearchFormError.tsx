import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';

export const PredictiveSearchFormError = ({
  quantity,
  moq,
}: {
  quantity: number;
  moq: string;
}) => {
  const style = 'font-medium leading-none text-sm text-red-500 pb-1.5';
  return (
    <>
      {quantity < Number(moq) && quantity >= 1 && (
        <p className={style}>
          Orders below MOQ ({moq}) will incur additional surcharges
        </p>
      )}
      {(quantity < 1 || isNaN(quantity)) && (
        <p className={style}>Minimum order quantity should be greater than 0</p>
      )}
      {quantity > CART_QUANTITY_MAX && (
        <p className={style}>Maximum order quantity is {CART_QUANTITY_MAX}</p>
      )}
    </>
  );
};
