export function getProductPriceByQty({
  qty,
  uomList,
  selectedUOM,
  defaultUom,
  priceRange,
  companyDefaultPrice,
  discountStatus = false,
}: {
  qty: number;
  uomList: any;
  selectedUOM: number;
  defaultUom: any;
  priceRange: any;
  companyDefaultPrice: any;
  discountStatus?: boolean;
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
      return finalQty * priceRan?.price;
    }
  }

  return finalQty * companyDefaultPrice;
}
