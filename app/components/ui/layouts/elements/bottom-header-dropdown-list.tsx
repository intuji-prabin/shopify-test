import {NormalMenuList} from './bottom-header-dropdown-menu';
import {MegaMenu} from './bottom-header-mega-menu';

export const DropdownMenu = ({
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
  return (
    <>
      {type === 'megamenu' ? (
        <MegaMenu categories={categories} />
      ) : (
        <NormalMenuList />
      )}
    </>
  );
};
