import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';

export const PredictiveSearchQtyBtn = ({
  moq,
  quantity,
  setQuantity,
}: {
  moq: string;
  quantity: number;
  setQuantity: any;
}) => {
  function decreaseQuantity() {
    if (isNaN(quantity - 1)) {
      setQuantity(parseFloat(moq) || 1);
      return;
    }
    setQuantity(quantity - 1);
  }

  function increaseQuantity() {
    if (isNaN(quantity + 1)) {
      setQuantity(parseFloat(moq) || 1);
      return;
    }
    setQuantity(quantity + 1);
  }

  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value);
    setQuantity(inputQuantity);
  }

  return (
    <>
      <button
        className={`flex items-center max-w-[38px] justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial ${
          quantity - Number(moq) < Number(moq) ? 'cursor-not-allowed' : ''
        }`}
        onClick={decreaseQuantity}
        disabled={quantity - Number(moq) < Number(moq)}
      >
        -
      </button>
      <input
        type="number"
        className="flex-1 text-center border-x-0 !border-grey-500 sm:min-w-20"
        value={quantity}
        min={moq || 1}
        max={CART_QUANTITY_MAX}
        step={moq || 1}
        onChange={handleInputChange}
      />
      <button
        className="flex items-center max-w-[38px] justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial"
        onClick={increaseQuantity}
      >
        +
      </button>
    </>
  );
};
