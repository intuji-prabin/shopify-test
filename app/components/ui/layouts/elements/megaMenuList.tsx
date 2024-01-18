import {Link} from '@remix-run/react';
import ArrowForward from '~/components/icons/arrowForward';

export const MegaMenuList = ({isOpen}: {isOpen: boolean}) => {
  const subMenus = [
    {
      id: 1,
      menu: 'Machines',
      subMenu: 'Welders',
      items: [
        {
          id: 1,
          title: 'MIG Welders',
          link: '/mig-welders',
        },
        {
          id: 2,
          title: 'TIG Welders',
          link: '/tig-welders',
        },
        {
          id: 3,
          title: 'STICK Welders',
          link: '/tig-welders',
        },
        {
          id: 4,
          title: 'Multi Process Welders',
          link: '/tig-welders',
        },
      ],
    },
    {
      id: 2,
      menu: 'Safety',
      subMenu: 'Power Packs',
      items: [
        {
          id: 1,
          title: 'MIG Welders',
          link: '/mig-welders',
        },
        {
          id: 2,
          title: 'TIG Welders',
          link: '/tig-welders',
        },
        {
          id: 3,
          title: 'STICK Welders',
          link: '/tig-welders',
        },
        {
          id: 4,
          title: 'Multi Process Welders',
          link: '/tig-welders',
        },
      ],
    },
    {
      id: 3,
      menu: 'Statements',
      subMenu: 'Plasma Cutting',
      items: [
        {
          id: 1,
          title: 'MIG Welders',
          link: '/mig-welders',
        },
        {
          id: 2,
          title: 'TIG Welders',
          link: '/tig-welders',
        },
        {
          id: 3,
          title: 'STICK Welders',
          link: '/tig-welders',
        },
        {
          id: 4,
          title: 'Multi Process Welders',
          link: '/tig-welders',
        },
      ],
    },
    {
      id: 4,
      menu: 'Accessories',
      subMenu: 'Plasma Cutting',
      items: [
        {
          id: 1,
          title: 'MIG Welders',
          link: '/mig-welders',
        },
        {
          id: 2,
          title: 'TIG Welders',
          link: '/tig-welders',
        },
        {
          id: 3,
          title: 'STICK Welders',
          link: '/tig-welders',
        },
        {
          id: 4,
          title: 'Multi Process Welders',
          link: '/tig-welders',
        },
      ],
    },
    {
      id: 5,
      menu: 'Gas Equipment',
      subMenu: 'Plasma Cutting',
      items: [
        {
          id: 1,
          title: 'MIG Welders',
          link: '/mig-welders',
        },
        {
          id: 2,
          title: 'TIG Welders',
          link: '/tig-welders',
        },
        {
          id: 3,
          title: 'STICK Welders',
          link: '/tig-welders',
        },
        {
          id: 4,
          title: 'Multi Process Welders',
          link: '/tig-welders',
        },
      ],
    },
    {
      id: 4,
      menu: 'Accessories',
      subMenu: 'Plasma Cutting',
      items: [
        {
          id: 1,
          title: 'MIG Welders',
          link: '/mig-welders',
        },
        {
          id: 2,
          title: 'TIG Welders',
          link: '/tig-welders',
        },
        {
          id: 3,
          title: 'STICK Welders',
          link: '/tig-welders',
        },
        {
          id: 4,
          title: 'Multi Process Welders',
          link: '/tig-welders',
        },
      ],
    },
  ];
  return (
    <nav
      className={`${
        isOpen ? 'opacity-100' : 'hidden'
      } transition-opacity megamenu-content p-4  text-black shadow-xl absolute bg-white top-16 -mt-2`}
    >
      <ul className="flex flex-col space-y-2 text-white submenu-nav z-10">
        {subMenus?.map((subMenu) => (
          <li
            key={subMenu.id}
            className="group/menu relative italic font-bold text-lg text-grey-900 flex menu-hov"
          >
            <span className="rounded px-2 py-1 font-medium text-lg flex flex-row-reverse items-center menu-hov">
              {' '}
              <ArrowForward />
              {subMenu.menu}
            </span>
            <ul className="absolute left-full top-0 mt-0 flex hidden  space-y-2 rounded  px-3 group-hover/menu:block">
              <li className="group/submenu relative normal text-lg text-grey-900 flex menu-hov">
                <span className="px-2 py-1 menu-hover font-medium not-italic text-lg flex  items-center">
                  {subMenu.subMenu}
                  <ArrowForward />
                </span>
                <ul className="absolute left-full top-0 mt-0 flex hidden flex-col space-y-2 rounded bg-gray-700 p-2 group-hover/menu:block">
                  {subMenu.items?.map((item) => (
                    <Link to={item.link}>
                      <li className="px-2 py-1 hover:bg-grey-600">
                        {item?.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};
