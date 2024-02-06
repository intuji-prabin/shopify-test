
import { Payload } from '~/routes/_app/app.server';
import { NormalMenuList } from './bottom-header-dropdown-menu';
import { MegaMenu } from './bottom-header-mega-menu';

export const DropdownMenu = ({
  type,
  categories,
  submenus,
}: {
  activeMenu: string;
  submenus: {
    title: string;
    url?: string;
    icon?: JSX.Element;
  }[];
  isOpen: boolean;
  closeMenu: () => void;
  type: 'normal' | 'megamenu';
  categories: Payload[];
}) => {
  return (
    <>
      {type === 'megamenu' ? (
        <MegaMenu categories={categories} />
      ) : (
        <NormalMenuList submenus={submenus} />
      )}
    </>
  );
};
