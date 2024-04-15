import React, {createContext, useState} from 'react';
export interface GroupItem {
  placeId: number;
  productId: string;
  quantity: number;
  uom: string;
  variantId?: string;
}

export const SelectProductContext = createContext<{
  selectedProduct: GroupItem[];
  setSelectedProduct: React.Dispatch<React.SetStateAction<GroupItem[]>>;
}>({selectedProduct: [], setSelectedProduct: () => {}});

export function SelectProductProvider({children}: {children: React.ReactNode}) {
  const [selectedProduct, setSelectedProduct] = useState<GroupItem[]>([]);
  return (
    <SelectProductContext.Provider
      value={{selectedProduct, setSelectedProduct}}
    >
      {children}
    </SelectProductContext.Provider>
  );
}
