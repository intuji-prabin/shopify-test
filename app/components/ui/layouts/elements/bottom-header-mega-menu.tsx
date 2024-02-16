import { Link } from '@remix-run/react';
import { useState } from 'react';
import ArrowForward from '~/components/icons/arrowForward';
import { Payload } from '~/routes/_app/app.server';

export const MegaMenu = ({ categories }: { categories: Payload[] }) => {
  //State to store the selected/active menu and submenu IDs
  const [activeMenu, setActiveMenu] = useState<{
    menu: Payload;
    subMenu: Payload;
  }>({
    menu: { id: 1, title: '', identifier: '', child_categories: [] },
    subMenu: { id: 1, title: '', identifier: '', child_categories: [] },
  });
  return (
    <>
      {categories.length > 0 && (
        <ul
          className={`transition-opacity megamenu-content p-3  text-black shadow-xl absolute bg-white top-8 -left-8  flex flex-row z-50`}
        >
          {/* Level 1 Menus Begin Here */}
          <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] z-10 pr-2 ">
            {categories?.map((menu: Payload) => (
              <li
                key={'list' + menu.id}
                className={`relative italic font-bold text-lg text-grey-900 flex menu-hov justify-between 
              ${activeMenu.menu?.id === menu.id
                    ? 'bg-primary-100 text-primary-500'
                    : ''
                  }
            `}
                onMouseOver={() =>
                  setActiveMenu((prevMenu) => ({ ...prevMenu, menu }))
                }
              >
                <p className="flex flex-row-reverse items-center justify-between w-full px-2 py-1 text-lg font-medium rounded menu-hov">
                  {' '}
                  <ArrowForward width={'24px'} height={'24px'} />
                  <span className="w-[169px]"> {menu.title} </span>
                </p>
              </li>
            ))}
          </ul>
          {/* Level 1 Menus End Here */}

          {/* Level 2 Menus Begin Here */}
          <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] border border-x-2 border-[#F5F5F5] px-2 border-y-0  max-h-[280px] overflow-y-auto">
            {/* Finding the currently active Level 1 Menu and displaying only its items */}
            {categories
              ?.find((menu: Payload) => menu?.id === activeMenu?.menu.id)
              ?.child_categories?.map((subMenu: Payload) => (
                <li
                  key={subMenu.id}
                  className={`relative text-grey-900 flex menu-hov font-medium not-italic text-lg items-center
               ${activeMenu?.subMenu?.id === subMenu.id
                      ? 'bg-primary-100 text-primary-500'
                      : ''
                    }
              `}
                  onMouseOver={() =>
                    setActiveMenu((prevMenu) => ({ ...prevMenu, subMenu }))
                  }
                >
                  <p className="flex flex-row-reverse items-center justify-between px-2 py-1 text-lg font-medium rounded menu-hov between">
                    {' '}
                    <ArrowForward width={'24px'} height={'24px'} />
                    <span className="w-[169px]">{subMenu.title} </span>
                  </p>
                </li>
              ))}
          </ul>
          {/* Level 2 Menus End Here */}

          {/* Level 3 i.e Final Level Menus Begin Here */}
          <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] px-2 max-h-[280px] overflow-y-auto">
            {/* Finding the currently active Level 1 Menu & Level 2 Sub Menu and displaying only its items */}
            {categories
              ?.find((menu: Payload) => menu?.id === activeMenu?.menu?.id)
              ?.child_categories?.find(
                (subMenu: Payload) => subMenu?.id === activeMenu?.subMenu?.id,
              )
              ?.child_categories?.map((subMenu: Payload) => (
                <li
                  key={subMenu.id}
                  className="relative flex items-center text-lg not-italic font-medium text-grey-900 menu-hov"
                >
                  <Link to={`/${activeMenu?.menu?.identifier}/${activeMenu?.subMenu?.identifier}/${subMenu?.identifier}`} className="w-full">
                    <p className="flex items-center px-2 py-1 text-lg font-medium rounded menu-hov justify- text-grey-900 ">
                      {' '}
                      <span className="w-[169px]">{subMenu.title}</span>
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
          {/* Level 3 i.e Final Level Menus End Here */}
        </ul>
      )}
    </>
  );
};
