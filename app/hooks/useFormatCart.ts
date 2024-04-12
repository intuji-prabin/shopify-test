interface CartInfo {
  cartId: string;
  lineItems: number;
}

export const useFormatCart = (cartInfo: CartInfo) => {
  return {
    cartId: cartInfo?.cartId,
    lineItems: cartInfo?.lineItems,
  };
};
