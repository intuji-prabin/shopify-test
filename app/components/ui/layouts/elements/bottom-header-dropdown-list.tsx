import useOutsideHover from '~/hooks/useOutsideHover';

import {NormalMenuList} from './bottom-header-dropdown-menu';
import {MegaMenu} from './bottom-header-mega-menu';
import {menuItemsData} from './bottom-header-menu-items';

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
  const {targetRef} = useOutsideHover({
    handleOutsideHover: closeMenu,
    condition: menuItemsData.some((item) => item && activeMenu === item.title),
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
