import {NewMegaMenu} from './NewMegaMenu';
import {NormalMenuList} from './normalMenu';

export const DropdownMenu = ({
  submenus,
  isOpen,
  depthLevel,
  type,
}: {
  submenus: {
    title: string;
    url: string;
  }[];
  isOpen: boolean;
  depthLevel: number;
  type: 'normal' | 'megamenu';
}) => {
  return (
    <>
      {type === 'megamenu' ? (
        <NewMegaMenu isOpen={isOpen} />
      ) : (
        <NormalMenuList isOpen={isOpen} />
      )}
    </>
  );
};
