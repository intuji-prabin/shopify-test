import { useEffect, useRef, useState } from 'react';
import { MenuItems } from '../bottom-header';
import ArrowUp from '~/components/icons/arrowUp';
import ArrowDown from '~/components/icons/arrowDown';
import { Link, useNavigate } from '@remix-run/react';
import { DropdownMenu } from './bottom-header-dropdown-list';
import { CategoriesType } from '~/routes/_app/route';
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
  categories: CategoriesType[];
}) => {
  const menuRef = useRef<HTMLLIElement>(null);

  return (
    <>
      <li
        className=" flex flex-row items-center justify-center p-3
          text-white italic font-bold text-lg gap-1  menu-items hover:bg-transparent group"
        ref={menuRef}
      >
        <Link to="" className="flex items-center gap-1 relative menu-links">
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
                className={`flex gap-2 items-center font-bold italic text-lg arrow-toggle  focus:outline-none 
                }`}
                aria-expanded={activeMenu === menu.title ? 'true' : 'false'}
                onMouseEnter={() => {
                  setActiveMenu(menu.title);
                }}
              >
                {menu.title === 'Product' ? (
                  <Link to="/categories">{menu.title}</Link>
                ) : (
                  <>{menu.title} </>
                )}
                <span className="hidden group-hover:block">
                  <ArrowUp fillColor="#FFE600" />
                </span>

                <span className="block group-hover:hidden ">
                  <ArrowDown />
                </span>
              </button>
              <div className={'group-hover:inline-block hidden absolute'}>
                <DropdownMenu
                  submenus={menu.submenu}
                  isOpen={activeMenu === menu.title}
                  activeMenu={activeMenu}
                  closeMenu={() => setActiveMenu('')}
                  type={menu.type === 'megamenu' ? 'megamenu' : 'normal'}
                  categories={categories}
                />
              </div>
            </>
          ) : (
            <Link to={menu.url}>{menu.title}</Link>
          )}
        </Link>
      </li>
    </>
  );
};
