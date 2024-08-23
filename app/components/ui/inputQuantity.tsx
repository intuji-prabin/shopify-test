import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {getProductPriceByQty} from '~/routes/_app.product_.$productSlug/product-detail';
import Info from '../icons/info';
import {validDecrementQty, validIncrementQty} from './validQty';

export const InputQuantity = ({
  quantity,
  setQuantity,
  unitOfMeasure,
  UOM,
  box,
  priceRange,
  companyDefaultPrice,
  setProductPrice,
  moq,
  className,
}: {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  unitOfMeasure: any;
  UOM: string;
  box: string;
  priceRange: any;
  companyDefaultPrice: number;
  setProductPrice: React.Dispatch<React.SetStateAction<number>>;
  moq: string;
  className?: string;
}) => {
  function decreaseQuantity() {
    const newQuantity = validDecrementQty(moq, quantity);
    const prices = getProductPriceByQty({
      qty: newQuantity,
      uomList: unitOfMeasure,
      selectedUOM: UOM,
      defaultUom: box,
      priceRange,
      companyDefaultPrice,
    });

    setProductPrice(prices);
    setQuantity(newQuantity);
  }

  function increaseQuantity() {
    const newQuantity = validIncrementQty(moq, quantity);
    const prices = getProductPriceByQty({
      qty: newQuantity,
      uomList: unitOfMeasure,
      selectedUOM: UOM,
      defaultUom: box,
      priceRange,
      companyDefaultPrice,
    });

    setProductPrice(prices);
    setQuantity(newQuantity);
  }

  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value);
    const prices = getProductPriceByQty({
      qty: inputQuantity,
      uomList: unitOfMeasure,
      selectedUOM: UOM,
      defaultUom: box,
      priceRange,
      companyDefaultPrice,
    });
    setProductPrice(prices);
    setQuantity(inputQuantity);
  }

  return (
    <>
      <div className={`flex cart__list--quantity ${className}`}>
        <button
          className={`border-[1px] border-grey-500 flex justify-center items-center w-14 aspect-square ${
            quantity - Number(moq) < Number(moq) ? 'cursor-not-allowed' : ''
          }`}
          onClick={decreaseQuantity}
          disabled={quantity - Number(moq) < Number(moq)}
        >
          -
        </button>
        <input
          type="number"
          className="w-20 min-h-14 h-full text-center border-x-0 !border-grey-500"
          value={quantity}
          onChange={handleInputChange}
          min={moq || 1}
          max={CART_QUANTITY_MAX}
          step={moq || 1}
          required
        />
        <button
          className={`border-[1px] border-grey-500  flex justify-center items-center aspect-square w-14 ${
            quantity + Number(moq) > CART_QUANTITY_MAX
              ? 'cursor-not-allowed'
              : ''
          }`}
          onClick={increaseQuantity}
          disabled={quantity + Number(moq) > CART_QUANTITY_MAX}
        >
          +
        </button>
      </div>
      <p className="text-sm text-grey-700 pt-2.5 flex gap-x-1 info-block">
        <div
          data-tooltip={`The minimum order quantity is ${
            moq || 1
          }. Orders below this quantity will incur additional surcharges.`}
          className="cursor-pointer"
        >
          <Info />
        </div>
        Minimum Order Quantity: {moq || 1}
      </p>
    </>
  );
};

export const InputQuantityError = ({
  quantity,
  moq,
  className,
}: {
  quantity: number;
  moq: number;
  className?: string;
}) => {
  const style = `font-medium text-red-500 leading-none pt-1.5 qty-error ${className}`;
  return (
    <>
      {quantity % moq !== 0 && quantity >= 1 && (
        <p className={style}>Quantity should be multiple of MOQ: {moq}</p>
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
