export function getProductPriceByQty( qty : any, uomList : any, selectedUOM : any, defaultUom : any, priceRange : any, companyDefaultPrice : any ) {

    let finalQty = qty
    if( defaultUom != selectedUOM ) {
        const selectUomWithConversion =  uomList.find( ( item : any ) => {
            return item?.unit == selectedUOM
        })
        finalQty = qty * selectUomWithConversion?.conversion_factor
    }
    if( priceRange.length > 0 ) {
       const priceRan =  priceRange.find( ( items : any) => {
        return items?.minQty <= finalQty && ( items?.maxQty ? finalQty < items?.maxQty : true )
       })
  
       if( priceRan ) {
            return finalQty * priceRan?.price
       }
    }
  
    return finalQty * companyDefaultPrice
  
  }