import useOutsideHover from '~/hooks/useOutsideHover';

import { NormalMenuList } from './bottom-header-dropdown-menu';
import { MegaMenu } from './bottom-header-mega-menu';

export const DropdownMenu = ({
  activeMenu,
  isOpen,
  closeMenu,
  type,
  categories,
}: {
  activeMenu: string;
  submenus: {
    title: string;
    url: string;
  }[];
  isOpen: boolean;
  closeMenu: () => void;
  type: 'normal' | 'megamenu';
  categories: any;
}) => {
  const { targetRef } = useOutsideHover({
    handleOutsideHover: closeMenu,
    condition: activeMenu === 'Product',
  });
  return (
    <div ref={targetRef}>
      {type === 'megamenu' ? (
        <MegaMenu isOpen={isOpen} categories={categories} />
      ) : (
        <NormalMenuList isOpen={isOpen} />
      )}
    </div>
  );
};
