
import { Payload } from '~/routes/_app/app.server';
import { NormalMenuList } from './bottom-header-dropdown-menu';
import { MegaMenu } from './bottom-header-mega-menu';

export const DropdownMenu = ({
  type,
  categories,
  submenus,
  handleClick
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
  handleClick: (event: any) => void;
}) => {
  return (
    <>
      {type === 'megamenu' ? (
        <MegaMenu categories={categories} handleClick={handleClick} />
      ) : (
        <NormalMenuList submenus={submenus} />
      )}
    </>
  );
};
