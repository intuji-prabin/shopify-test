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
        className={`flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial ${
          quantity - 1 < 1 ? 'cursor-not-allowed' : ''
        }`}
        onClick={decreaseQuantity}
        disabled={quantity - 1 < 1}
      >
        -
      </button>
      <input
        type="number"
        className="flex-1 text-center border-x-0 !border-grey-500 sm:min-w-20"
        value={quantity}
        onChange={handleInputChange}
      />
      <button
        className="flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial"
        onClick={increaseQuantity}
      >
        +
      </button>
    </>
  );
};
