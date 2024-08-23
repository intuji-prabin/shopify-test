export const validateDiscountPrice = (
    type2UsedStatus : boolean,
    type3UsedStatus : boolean,
    discountPrice  : number
) => {
    if(type2UsedStatus || type3UsedStatus) {
        return discountPrice;
    }
    return 0
}