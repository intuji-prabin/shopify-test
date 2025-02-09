import { Link, useLocation } from '@remix-run/react';
import { useRef, useState } from 'react';
import ArrowDown from '~/components/icons/arrowDown';
import ArrowUp from '~/components/icons/arrowUp';
import { Payload } from '~/routes/_app/app.server';
import { MenuItems } from '../bottom-header';
import { DropdownMenu } from './bottom-header-dropdown-list';

export const SingleNavItem = ({
  menu,
  activeMenu,
  setActiveMenu,
  categories,
}: {
  menu: MenuItems;
  depthLevel: number;
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
  categories: Payload[];
}) => {
  const location = useLocation();
  const currentPageRoute = location.pathname;
  const [disableHover, setDisableHover] = useState(false);

  const handleClick = () => {
    setDisableHover(!disableHover);
  };

  return (
    <li
      className={`flex flex-row items-center justify-center gap-1 p-3 text-lg italic font-bold text-white menu-items group ${currentPageRoute === menu.url
        ? 'bg-primary-600 [&>a]:text-secondary-500 [&_svg]:fill-secondary-500 hover:bg-primary-600 [&_path]:fill-secondary-500'
        : ''
        }`}
      key={menu.title}
    >
      <Link
        to={menu.url ?? ''}
        className="relative flex items-center gap-1 menu-links [&>span]:hover:text-secondary-500"
      >
        <div
          className={`${activeMenu === menu.title ? 'active' : ''} menu-icon`}
        >
          {menu.icon}
        </div>
        {menu.submenu ? (
          <>
            <button
              type="button"
              aria-haspopup="menu"
              className={`flex gap-2 items-center font-bold italic text-lg arrow-toggle focus:outline-none`}
              aria-expanded={activeMenu === menu.title ? 'true' : 'false'}
              onMouseEnter={() => {
                setActiveMenu(menu.title);
              }}
            >
              {menu.title === 'Product' && categories.length > 0 ? (
                <span className="uppercase">{menu.title}</span>
              ) : (
                <span className="uppercase">{menu.title} </span>
              )}
              <span className="hidden group-hover:block">
                <ArrowUp fillColor="#FFE600" />
              </span>

              <span className="block group-hover:hidden ">
                <ArrowDown fillColor="#FFF" />
              </span>
            </button>
            <div
              className={`group-hover:inline-block hidden absolute ${disableHover ? 'disable-hover' : ''}`}
            >
              <DropdownMenu
                submenus={menu.submenu}
                isOpen={activeMenu === menu.title}
                activeMenu={activeMenu}
                closeMenu={() => setActiveMenu('')}
                type={menu.type === 'megamenu' ? 'megamenu' : 'normal'}
                categories={categories}
                handleClick={handleClick}
              />
            </div>
          </>
        ) : (
          <span className="uppercase">{menu.title}</span>
        )}
      </Link>
    </li>
  );
};
