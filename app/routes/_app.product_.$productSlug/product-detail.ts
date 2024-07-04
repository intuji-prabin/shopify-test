export function getProductPriceByQty(
  qty: any,
  uomList: any,
  selectedUOM: any,
  defaultUom: any,
  priceRange: any,
  companyDefaultPrice: any,
) {
  console.log({
    qty,
    uomList,
    selectedUOM,
    defaultUom,
    priceRange,
    companyDefaultPrice,
  });
  let finalQty = qty;
  if (defaultUom != selectedUOM && uomList.length > 0) {
    const selectUomWithConversion = uomList.find((item: any) => {
      return item?.code == selectedUOM;
    });
    finalQty = qty * selectUomWithConversion?.conversionFactor;
  }
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
