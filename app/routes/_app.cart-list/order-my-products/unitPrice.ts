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
  let selectUomWithConversion;
  if (defaultUom != finalUOM && uomRange.length > 0) {
    selectUomWithConversion = uomRange.find((item: any) => {
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
      return (
        Number(priceRan?.price) *
        Number(selectUomWithConversion?.conversionFactor || 1)
      );
    }
  }
  return totalPrice;
}
