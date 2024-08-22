import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {getProductPriceByQty} from '~/routes/_app.product_.$productSlug/product-detail';
import Info from '../icons/info';

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
    const validMOQ = moq ? Number(moq) : 1;
    let newQuantity;
    if (quantity % validMOQ !== 0 && quantity > 0) {
      let moqValidate =
        quantity > 0 ? Math.floor(quantity / validMOQ) : validMOQ;
      newQuantity = moqValidate > 0 ? moqValidate * validMOQ : validMOQ;
    } else if (quantity <= 0) {
      newQuantity = validMOQ;
    } else {
      newQuantity = quantity > validMOQ ? quantity - validMOQ : validMOQ;
    }
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
    const validMOQ = moq ? Number(moq) : 1;
    let newQuantity;
    if (quantity % validMOQ !== 0 && quantity > 0) {
      let moqValidate =
        quantity > 0 ? Math.ceil(quantity / validMOQ) : validMOQ;
      newQuantity = moqValidate > 0 ? moqValidate * validMOQ : validMOQ;
    } else if (quantity <= 0) {
      newQuantity = validMOQ;
    } else {
      newQuantity = quantity + validMOQ;
    }

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
          className="border-[1px] border-grey-500  flex justify-center items-center aspect-square w-14"
          onClick={increaseQuantity}
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
}: {
  quantity: number;
  moq: number;
}) => {
  return (
    <p className="font-medium text-red-500 leading-none pt-1.5">
      {/* {quantity < moq && quantity >= 1 && (
        <>Orders below MOQ ({moq}) will incur additional surcharges</>
      )} */}
      {quantity % moq !== 0 && quantity >= 1 && (
        <>Quantity should be multiple of MOQ: {moq}</>
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
