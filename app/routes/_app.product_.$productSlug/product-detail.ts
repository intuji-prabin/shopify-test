export function getProductPriceByQty({
  qty,
  uomList,
  selectedUOM,
  defaultUom,
  priceRange,
  companyDefaultPrice,
  discountStatus = false,
  discountPrice = 0,
}: {
  qty: number;
  uomList: any;
  selectedUOM: number | string;
  defaultUom: any;
  priceRange: any;
  companyDefaultPrice: any;
  discountStatus?: boolean;
  discountPrice?: number;
}) {
  let finalQty = qty;
  let selectUomWithConversion;
  if (discountStatus) {
    return qty * companyDefaultPrice;
  }
  if (defaultUom != selectedUOM && uomList.length > 0) {
    selectUomWithConversion = uomList.find((item: any) => {
      return item?.code == selectedUOM;
    });
    finalQty = qty * selectUomWithConversion?.conversionFactor;
  }
  finalQty = Math.round(finalQty);
  if (priceRange.length > 0) {
    const priceRan = priceRange.find((items: any) => {
      return (
        items?.minQty <= finalQty &&
        (items?.maxQty ? finalQty <= items?.maxQty : true)
      );
    });

    if (priceRan) {
      // prettier-ignore
      const totalPrice = (finalQty * priceRan?.price) - discountPrice;
      return validateTotalPrce( qty, totalPrice)
    }
  }

  return validateTotalPrce( qty, finalQty * companyDefaultPrice );
}

const validateTotalPrce = ( qty : number, totalPrice : number ) => {
  const pricePerQty = Number( ( totalPrice / qty ).toFixed(2) );
  const newTotalPrice = qty * pricePerQty;

  return Number( newTotalPrice.toFixed(2) );
}
