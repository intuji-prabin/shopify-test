import useOutsideHover from '~/hooks/useOutsideHover';
import {NewMegaMenu} from './NewMegaMenu';
import {NormalMenuList} from './normalMenu';
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
    condition: activeMenu === 'Product',
  });
  return (
    <div ref={targetRef}>
      {type === 'megamenu' ? (
        <NewMegaMenu isOpen={isOpen} categories={categories} />
      ) : (
        <NormalMenuList isOpen={isOpen} />
      )}
    </div>
  );
};
