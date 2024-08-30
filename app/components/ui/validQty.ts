export const validIncrementQty = (moq: string | number, quantity: number) => {
  const validMOQ = moq ? Number(moq) : 1;
  if (quantity % validMOQ !== 0 && quantity > 0) {
    let moqValidate = quantity > 0 ? Math.ceil(quantity / validMOQ) : validMOQ;
    return moqValidate > 0 ? moqValidate * validMOQ : validMOQ;
  } else if (quantity <= 0 || isNaN(quantity)) {
    return validMOQ;
  }
  return quantity + validMOQ;
};

export const validDecrementQty = (moq: string | number, quantity: number) => {
  const validMOQ = moq ? Number(moq) : 1;
  if (quantity % validMOQ !== 0 && quantity > 0) {
    let moqValidate = quantity > 0 ? Math.floor(quantity / validMOQ) : validMOQ;
    return moqValidate > 0 ? moqValidate * validMOQ : validMOQ;
  } else if (quantity <= 0 || isNaN(quantity)) {
    return validMOQ;
  }
  return quantity > validMOQ ? quantity - validMOQ : validMOQ;
};
