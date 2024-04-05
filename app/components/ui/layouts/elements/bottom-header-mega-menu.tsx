import {Link} from '@remix-run/react';
import {useLayoutEffect, useState} from 'react';
import ArrowForward from '~/components/icons/arrowForward';
import {Payload} from '~/routes/_app/app.server';

export const MegaMenu = ({categories}: {categories: Payload[]}) => {
  //State to store the selected/active menu and submenu IDs
  const [activeMenu, setActiveMenu] = useState<{
    menu: Payload;
    subMenu: Payload;
  }>({
    menu: {id: 1, title: '', identifier: '', child_categories: []},
    subMenu: {id: 1, title: '', identifier: '', child_categories: []},
  });
  useLayoutEffect(() => {
    if (!categories) return;
    setActiveMenu({
      menu: {
        id: categories?.at(0)?.id ?? 1,
        identifier: categories?.at(0)?.identifier ?? '',
        title: categories?.at(0)?.title ?? '',
        child_categories: categories?.at(0)?.child_categories ?? [],
      },
      subMenu: {
        id: categories?.at(0)?.child_categories?.at(0)?.id ?? '',
        title: categories?.at(0)?.child_categories?.at(0)?.title ?? '',
        identifier:
          categories?.at(0)?.child_categories?.at(0)?.identifier ?? '',
        child_categories:
          categories?.at(0)?.child_categories?.at(0)?.child_categories ?? [],
      },
    });
  }, []);

  const activeLevel1Menu = categories?.find(
    (menu) => menu?.id === activeMenu?.menu?.id,
  );
  const activeLevel2SubMenu = activeLevel1Menu?.child_categories?.find(
    (subMenu) => subMenu?.id === activeMenu?.subMenu?.id,
  );

  return (
    <>
      {categories.length > 0 && (
        <ul
          className={`transition-opacity megamenu-content p-3  text-black shadow-xl absolute bg-white top-8 -left-8  flex flex-row z-50`}
        >
          {/* Level 1 Menus Begin Here */}
          <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] z-10 pr-2 max-h-[330px] overflow-y-auto">
            {categories?.map((menu: Payload) => (
              <li
                key={'list' + menu.id}
                className={`relative  flex menu-hov justify-between 
              ${
                activeMenu.menu?.id === menu.id
                  ? 'bg-primary-100 text-primary-500'
                  : ''
              }
            `}
                onMouseOver={() =>
                  setActiveMenu((prevMenu) => ({
                    ...prevMenu,
                    menu,
                    subMenu: {
                      id: menu.child_categories?.at(0)?.id ?? '',
                      identifier:
                        menu?.child_categories?.at(0)?.identifier ?? '',
                      title: menu?.child_categories?.at(0)?.title ?? '',
                      child_categories:
                        menu?.child_categories?.at(0)?.child_categories ?? [],
                    },
                  }))
                }
              >
                <Link to="/categories" className="w-full">
                  <p className="flex flex-row-reverse items-center justify-between w-full px-2 py-1 text-lg rounded menu-hov">
                    {' '}
                    <ArrowForward width={'24px'} height={'24px'} />
                    <span className="w-[169px] italic font-bold text-2xl text-grey-900">
                      {' '}
                      {menu.title}{' '}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          {/* Level 1 Menus End Here */}

          {/* Level 2 Menus Begin Here */}
          <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] border border-x-2 border-[#F5F5F5] px-2 border-y-0  max-h-[330px] overflow-y-auto">
            {/* Finding the currently active Level 1 Menu and displaying only its items */}
            {categories
              ?.find((menu: Payload) => menu?.id === activeMenu?.menu.id)
              ?.child_categories?.map((subMenu: Payload) => {
                return (
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
                    {subMenu.child_categories &&
                    subMenu.child_categories.length > 0 ? (
                      <Link to="/categories" className="w-full">
                        <p className="flex items-center justify-between px-2 py-1 rounded menu-hov between">
                          <span className="w-[calc(100%_-_24px)] text-lg font-medium text-grey-900">
                            {subMenu.title}
                          </span>
                          <div className="w-6">
                            <ArrowForward width={'24px'} height={'24px'} />
                          </div>
                        </p>
                      </Link>
                    ) : (
                      <Link
                        to={`/category/${activeMenu?.menu?.identifier}/${subMenu?.identifier}`}
                        className="w-full"
                      >
                        <p className="flex items-center justify-between px-2 py-1 rounded menu-hov between">
                          <span className="w-[calc(100%_-_24px)] text-lg font-medium text-grey-900">
                            {subMenu.title}
                          </span>
                        </p>
                      </Link>
                    )}
                  </li>
                );
              })}
          </ul>
          {/* Level 2 Menus End Here */}

          {/* Level 3 i.e Final Level Menus Begin Here */}
          {activeLevel2SubMenu?.child_categories &&
            activeLevel2SubMenu?.child_categories?.length > 0 && (
              <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] px-2 max-h-[330px] overflow-y-auto">
                {/* Finding the currently active Level 1 Menu & Level 2 Sub Menu and displaying only its items */}
                {categories
                  ?.find((menu: Payload) => menu?.id === activeMenu?.menu?.id)
                  ?.child_categories?.find(
                    (subMenu: Payload) =>
                      subMenu?.id === activeMenu?.subMenu?.id,
                  )
                  ?.child_categories?.map((subMenu: Payload) => {
                    return (
                      <li
                        key={subMenu.id}
                        className="relative flex items-center text-lg not-italic font-medium text-grey-900 menu-hov"
                      >
                        <Link
                          to={`/category/${activeMenu?.menu?.identifier}/${activeMenu?.subMenu?.identifier}/${subMenu?.identifier}`}
                          className="w-full"
                        >
                          <p className="flex items-center px-2 py-1 rounded menu-hov justify- ">
                            {' '}
                            <span className="w-[169px] text-grey-900 text-lg font-medium">
                              {subMenu.title}
                            </span>
                          </p>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            )}
          {/* Level 3 i.e Final Level Menus End Here */}
        </ul>
      )}
    </>
  );
};
