import React, { createContext, useContext, useEffect, useState } from 'react';

// Define a type for your context
interface HamburgerContextType {
  isOpen: boolean;
  toggleMenu: (state?: boolean) => void;
}

// Create the context
const HamburgerContext = createContext<HamburgerContextType | undefined>(
  undefined,
);

// Create a custom hook to consume the context
export const useHamburgerMenu = () => {
  const context = useContext(HamburgerContext);
  if (!context) {
    throw new Error(
      'useHamburgerMenu must be used within a HamburgerMenuProvider',
    );
  }
  return context;
};

// Create the provider component
export const HamburgerMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = (state?: boolean) => {
    setIsOpen(state ?? !isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-active');
    } else {
      document.body.classList.remove('menu-active');
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('menu-active');
    };
  }, [isOpen]);

  return (
    <HamburgerContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </HamburgerContext.Provider>
  );
};
