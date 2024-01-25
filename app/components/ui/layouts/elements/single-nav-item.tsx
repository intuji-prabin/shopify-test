import {useEffect, useRef, useState} from 'react';
import {MenuItems} from '../bottom-header';
import ArrowUp from '~/components/icons/arrowUp';
import ArrowDown from '~/components/icons/arrowDown';
import {Link, useNavigate} from '@remix-run/react';
import {DropdownMenu} from './dropdownItems';
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
  categories: any;
}) => {
  const menuRef = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu('');
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', (event) =>
      handleClickOutside(event),
    );
    //Clean up function => Cleaning up our Event Listeners
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <li
        className=" flex flex-row items-center justify-center p-3
          text-white italic font-bold text-lg gap-1  menu-items active:bg-primary-600 hover:bg-transparent"
        ref={menuRef}
      >
        <div className="flex items-center gap-1 relative menu-links">
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
                className={`flex gap-2 items-center font-bold italic text-lg arrow-toggle  focus:outline-none ${
                  activeMenu === menu.title ? 'text-secondary-500' : ''
                }`}
                aria-expanded={activeMenu === menu.title ? 'true' : 'false'}
                onClick={() => {
                  if (menu.title === 'Product') {
                    setActiveMenu('');
                    return;
                  }
                  setActiveMenu(menu.title);
                }}
                onMouseEnter={() => {
                  if (menu.title === 'Product') {
                    setActiveMenu(menu.title);
                  } else {
                    if (activeMenu === 'Product') {
                      setActiveMenu('');
                    }
                  }
                }}
              >
                {menu.title === 'Product' ? (
                  <Link to="/products">{menu.title}</Link>
                ) : (
                  <>{menu.title} </>
                )}
                {activeMenu === menu.title ? (
                  <ArrowUp fillColor="#FFE600" />
                ) : (
                  <ArrowDown />
                )}
              </button>
              <DropdownMenu
                submenus={menu.submenu}
                isOpen={activeMenu === menu.title}
                activeMenu={activeMenu}
                closeMenu={() => setActiveMenu('')}
                type={menu.type === 'megamenu' ? 'megamenu' : 'normal'}
                categories={categories}
              />
            </>
          ) : (
            <Link to={menu.url}>{menu.title}</Link>
          )}
        </div>
      </li>
    </>
  );
};
