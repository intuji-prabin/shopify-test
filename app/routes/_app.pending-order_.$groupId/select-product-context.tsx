import React, {createContext, useState} from 'react';

export const SelectProductContext = createContext<{
  selectedProduct: never[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<never[]>>;
}>({selectedProduct: [], setSelectedProduct: () => {}});

export function SelectProductProvider({children}: {children: React.ReactNode}) {
  const [selectedProduct, setSelectedProduct] = useState<never[]>([]);
  return (
    <SelectProductContext.Provider
      value={{selectedProduct, setSelectedProduct}}
    >
      {children}
    </SelectProductContext.Provider>
  );
}
