import {Link} from '@remix-run/react';
import {useState} from 'react';
import ArrowForward from '~/components/icons/arrowForward';

// Generated by https://quicktype.io

export interface ICategory {
  id: number;
  title: string;
  identifier: string;
  child_categories?: ICategory[];
}

export const MegaMenu = ({categories}: {categories: any}) => {
  //State to store the selected/active menu and submenu IDs
  const [activeMenu, setActiveMenu] = useState<{
    menu: ICategory;
    subMenu: ICategory;
  }>({
    menu: {id: 1, title: '', identifier: '', child_categories: []},
    subMenu: {id: 1, title: '', identifier: '', child_categories: []},
  });
  return (
    <div
      className={`transition-opacity megamenu-content p-3  text-black shadow-xl absolute bg-white top-8 -left-8  flex flex-row z-10`}
    >
      {/* Level 1 Menus Begin Here */}
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] z-10 pr-2">
        {categories?.map((menu: ICategory) => (
          <li
            key={'list' + menu.id}
            className={`relative italic font-bold text-lg text-grey-900 flex menu-hov justify-between
              ${
                activeMenu.menu?.id === menu.id
                  ? 'bg-primary-100 text-primary-500'
                  : ''
              }
            `}
            onMouseOver={() =>
              setActiveMenu((prevMenu) => ({...prevMenu, menu}))
            }
          >
            <span className="rounded px-2 py-1 font-medium text-lg flex flex-row-reverse items-center menu-hov w-full justify-between">
              {' '}
              <ArrowForward />
              {menu.title}
            </span>
          </li>
        ))}
      </ul>
      {/* Level 1 Menus End Here */}

      {/* Level 2 Menus Begin Here */}
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] border border-x-2 border-[#F5F5F5] px-2 border-y-0 ">
        {/* Finding the currently active Level 1 Menu and displaying only its items */}
        {categories
          ?.find((menu: ICategory) => menu?.id === activeMenu?.menu.id)
          ?.child_categories?.map((subMenu: ICategory) => (
            <li
              key={subMenu.id}
              className={`relative text-grey-900 flex menu-hov font-medium not-italic text-lg items-center
               ${
                 activeMenu?.subMenu?.id === subMenu.id
                   ? 'bg-primary-100 text-primary-500'
                   : ''
               }
              `}
              onMouseOver={() =>
                setActiveMenu((prevMenu) => ({...prevMenu, subMenu}))
              }
            >
              <span className="rounded px-2 py-1 font-medium text-lg flex flex-row-reverse items-center menu-hov between w-full justify-between">
                {' '}
                <ArrowForward />
                {subMenu.title}
              </span>
            </li>
          ))}
      </ul>
      {/* Level 2 Menus End Here */}

      {/* Level 3 i.e Final Level Menus Begin Here */}
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] px-2">
        {/* Finding the currently active Level 1 Menu & Level 2 Sub Menu and displaying only its items */}
        {categories
          ?.find((menu: ICategory) => menu?.id === activeMenu?.menu?.id)
          ?.child_categories?.find(
            (subMenu: ICategory) => subMenu?.id === activeMenu?.subMenu?.id,
          )
          ?.child_categories?.map((subMenu: ICategory) => (
            <li
              key={subMenu.id}
              className="relative  text-grey-900 menu-hov font-medium not-italic text-lg flex  items-center"
            >
              <Link
                to={`/categories/${subMenu?.identifier}`}
                className="w-full"
              >
                <span className="rounded px-2 py-1 font-medium text-lg flex items-center menu-hov justify- w-full text-grey-900">
                  {' '}
                  {subMenu.title}
                </span>
              </Link>
            </li>
          ))}
      </ul>
      {/* Level 3 i.e Final Level Menus End Here */}
    </div>
  );
};
