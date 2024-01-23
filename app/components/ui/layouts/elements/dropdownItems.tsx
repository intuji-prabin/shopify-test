import useOutsideHover from '~/hooks/useOutsideHover';
import {NewMegaMenu} from './NewMegaMenu';
import {NormalMenuList} from './normalMenu';
export const DropdownMenu = ({
  activeMenu,
  isOpen,
  closeMenu,
  type,
}: {
  activeMenu: string;
  submenus: {
    title: string;
    url: string;
  }[];
  isOpen: boolean;
  closeMenu: () => void;
  type: 'normal' | 'megamenu';
}) => {
  const {targetRef} = useOutsideHover({
    handleOutsideHover: closeMenu,
    condition: activeMenu === 'Product',
  });
  return (
    <div ref={targetRef}>
      {type === 'megamenu' ? (
        <NewMegaMenu isOpen={isOpen} />
      ) : (
        <NormalMenuList isOpen={isOpen} />
      )}
    </div>
  );
};
