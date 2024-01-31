import {useState} from 'react';

export default function WishlistQuantity({count}: {count: number}) {
  const [quantity, setQuantity] = useState(count);

  function decreaseQuantity() {
    setQuantity(quantity - 1);
  }
  function increaseQuantity() {
    setQuantity(quantity + 1);
  }
  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value, 10);
    setQuantity(isNaN(inputQuantity) ? 0 : inputQuantity);
  }
  return (
    <div className="flex gap-4 flex-col lg:flex-row min-h-0 lg:min-h-14">
      <div className="flex">
        <button
          className={`border-[1px] border-grey-500  flex justify-center items-center w-[56px] ${
            quantity === 0 ? 'pointer-events-none' : ''
          }`}
          onClick={decreaseQuantity}
        >
          -
        </button>
        <input
          type="text"
          className=" max-w-[61px] h-full text-center border-x-0 border-[1px] border-grey-500"
          value={quantity}
          onChange={handleInputChange}
        />
        <button
          className="border-[1px] border-grey-500  flex justify-center items-center  w-[56px]"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
}
