export function getUnitProductPrice({
  quantity,
  finalUOM,
  defaultUom,
  priceRange,
  uomRange,
  totalPrice,
}: {
  quantity: number;
  finalUOM: string;
  defaultUom: string;
  priceRange: [{minQty: number; maxQty: number; price: string}];
  uomRange: any;
  totalPrice: string;
}) {
  let finalQty = quantity;
  if (defaultUom != finalUOM && uomRange.length > 0) {
    const selectUomWithConversion = uomRange.find((item: any) => {
      return item?.code == finalUOM;
    });
    finalQty = quantity * selectUomWithConversion?.conversionFactor;
  }
  if (priceRange.length > 0) {
    const priceRan = priceRange.find((items) => {
      return (
        items?.minQty <= finalQty &&
        (items?.maxQty ? finalQty <= items?.maxQty : true)
      );
    });

    if (priceRan) {
      return priceRan?.price;
    }
  }
  return totalPrice;
}
