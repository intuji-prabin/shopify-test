import {Link} from '@remix-run/react';
import {useState} from 'react';
import ArrowForward from '~/components/icons/arrowForward';

export interface ICategory {
  id: number;
  title: string;
  child_categories: ICategoryChildCategory[];
}

export interface ICategoryChildCategory {
  id: number;
  title: string;
  child_categories: ChildCategoryChildCategory[];
}

export interface ChildCategoryChildCategory {
  id: number;
  title: string;
}

const menus = [
  {
    id: 1,
    title: 'Machines',
    items: [
      {
        id: 1,
        title: 'Welders',
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
        title: 'Power Packs',
        items: [
          {
            id: 1,
            title: 'Power STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Power Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Power MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Power TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 3,
        title: 'Plasma Cutting',
        items: [
          {
            id: 1,
            title: 'Plasma STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Plasma Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Plasma MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Plasma TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 4,
        title: 'Gas Cutting',
        items: [
          {
            id: 1,
            title: 'Gas STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Gas Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Gas MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Gas TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 5,
        title: 'Wire Feeders',
        items: [
          {
            id: 1,
            title: 'Wire STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Wire Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Wire MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Wire TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 6,
        title: 'CNC & Automation',
        items: [
          {
            id: 1,
            title: 'CNC STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'CNC Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'CNC MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'CNC TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Safety',
    items: [
      {
        id: 1,
        title: 'Safety Welders',
        items: [
          {
            id: 1,
            title: 'Safety MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 2,
            title: 'Safety TIG Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Safety STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 4,
            title: 'Safety Multi Process Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 2,
        title: 'Safety Power Packs',
        items: [
          {
            id: 1,
            title: 'Power STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Power Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Power MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Power TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 3,
        title: 'Safety Plasma Cutting',
        items: [
          {
            id: 1,
            title: 'Plasma STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Plasma Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Plasma MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Plasma TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 4,
        title: 'Safety Gas Cutting',
        items: [
          {
            id: 1,
            title: 'Gas STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Gas Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Gas MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Gas TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 5,
        title: 'Safety Wire Feeders',
        items: [
          {
            id: 1,
            title: 'Wire STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Wire Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Wire MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Wire TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 6,
        title: 'Safety CNC & Automation',
        items: [
          {
            id: 1,
            title: 'CNC STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'CNC Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'CNC MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'CNC TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Statements',
    items: [
      {
        id: 1,
        title: 'Statements Welders',
        items: [
          {
            id: 1,
            title: 'Statements MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 2,
            title: 'Statements TIG Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Statements STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 4,
            title: 'Statements Multi Process Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 2,
        title: 'Statements Power Packs',
        items: [
          {
            id: 1,
            title: 'Power STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Power Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Power MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Power TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 3,
        title: 'Statements Plasma Cutting',
        items: [
          {
            id: 1,
            title: 'Plasma STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Plasma Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Plasma MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Plasma TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 4,
        title: 'Statements Gas Cutting',
        items: [
          {
            id: 1,
            title: 'Gas STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Gas Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Gas MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Gas TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 5,
        title: 'Statements Wire Feeders',
        items: [
          {
            id: 1,
            title: 'Wire STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Wire Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Wire MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Wire TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 6,
        title: 'Statements CNC & Automation',
        items: [
          {
            id: 1,
            title: 'CNC STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'CNC Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'CNC MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'CNC TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Accessories',
    items: [
      {
        id: 1,
        title: 'Welders',
        items: [
          {
            id: 1,
            title: 'Accessories MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 2,
            title: 'Accessories TIG Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Accessories STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 4,
            title: 'Accessories Multi Process Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 2,
        title: 'Power Packs',
        items: [
          {
            id: 1,
            title: 'Power STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Power Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Power MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Power TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 3,
        title: 'Plasma Cutting',
        items: [
          {
            id: 1,
            title: 'Plasma STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Plasma Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Plasma MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Plasma TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 4,
        title: 'Gas Cutting',
        items: [
          {
            id: 1,
            title: 'Gas STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Gas Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Gas MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Gas TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 5,
        title: 'Wire Feeders',
        items: [
          {
            id: 1,
            title: 'Wire STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Wire Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Wire MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Wire TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 6,
        title: 'CNC & Automation',
        items: [
          {
            id: 1,
            title: 'CNC STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'CNC Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'CNC MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'CNC TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Gas Equipment',
    items: [
      {
        id: 1,
        title: 'Welders',
        items: [
          {
            id: 1,
            title: 'Gas MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 2,
            title: 'Gas TIG Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Gas STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 4,
            title: 'Gas Multi Process Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 2,
        title: 'Power Packs',
        items: [
          {
            id: 1,
            title: 'Power STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Power Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Power MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Power TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 3,
        title: 'Plasma Cutting',
        items: [
          {
            id: 1,
            title: 'Plasma STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Plasma Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Plasma MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Plasma TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 4,
        title: 'Gas Cutting',
        items: [
          {
            id: 1,
            title: 'Gas STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Gas Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Gas MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Gas TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 5,
        title: 'Wire Feeders',
        items: [
          {
            id: 1,
            title: 'Wire STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Wire Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Wire MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Wire TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 6,
        title: 'CNC & Automation',
        items: [
          {
            id: 1,
            title: 'CNC STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'CNC Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'CNC MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'CNC TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Applications',
    items: [
      {
        id: 1,
        title: 'Welders',
        items: [
          {
            id: 1,
            title: 'Application MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 2,
            title: 'Application TIG Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Application STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 4,
            title: 'Application Multi Process Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 2,
        title: 'Power Packs',
        items: [
          {
            id: 1,
            title: 'Power STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Power Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Power MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Power TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 3,
        title: 'Plasma Cutting',
        items: [
          {
            id: 1,
            title: 'Plasma STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Plasma Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Plasma MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Plasma TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 4,
        title: 'Gas Cutting',
        items: [
          {
            id: 1,
            title: 'Gas STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Gas Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Gas MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Gas TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 5,
        title: 'Wire Feeders',
        items: [
          {
            id: 1,
            title: 'Wire STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'Wire Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'Wire MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'Wire TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
      {
        id: 6,
        title: 'CNC & Automation',
        items: [
          {
            id: 1,
            title: 'CNC STICK Welders',
            link: '/tig-welders',
          },
          {
            id: 2,
            title: 'CNC Multi Process Welders',
            link: '/tig-welders',
          },
          {
            id: 3,
            title: 'CNC MIG Welders',
            link: '/mig-welders',
          },
          {
            id: 4,
            title: 'CNC TIG Welders',
            link: '/tig-welders',
          },
        ],
      },
    ],
  },
];

export const NewMegaMenu = ({
  isOpen,
  categories,
}: {
  isOpen: boolean;
  categories: any;
}) => {
  //State to store the selected/active menu and submenu IDs
  const [activeMenu, setActiveMenu] = useState({
    menu: 1,
    subMenu: 1,
  });
  return (
    <div
      className={`${
        isOpen ? 'opacity-100' : 'hidden'
      } transition-opacity megamenu-content p-3  text-black shadow-xl absolute bg-white top-12 -left-8  flex flex-row z-10 mt-0`}
    >
      {/* Level 1 Menus Begin Here */}
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] z-10">
        {categories?.map((menu: ICategory) => (
          <li
            key={'list' + menu.id}
            className={`relative italic font-bold text-lg text-grey-900 flex menu-hov justify-between
              ${
                activeMenu.menu === menu.id
                  ? 'bg-primary-100 text-primary-500'
                  : ''
              }
            `}
            onMouseOver={() => setActiveMenu({menu: menu.id, subMenu: 1})}
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
          ?.find((menu: ICategory) => menu?.id === activeMenu?.menu)
          ?.child_categories?.map((subMenu: ICategory) => (
            <li
              key={subMenu.id}
              className={`relative text-grey-900 flex menu-hov font-medium not-italic text-lg items-center
               ${
                 activeMenu.subMenu === subMenu.id
                   ? 'bg-primary-100 text-primary-500'
                   : ''
               }
              `}
              onMouseOver={() =>
                setActiveMenu({menu: activeMenu.menu, subMenu: subMenu.id})
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
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] ">
        {/* Finding the currently active Level 1 Menu & Level 2 Sub Menu and displaying only its items */}
        {categories
          ?.find((menu: ICategory) => menu?.id === activeMenu?.menu)
          ?.child_categories?.find(
            (subMenu: ICategory) => subMenu?.id === activeMenu?.subMenu,
          )
          ?.child_categories?.map((subMenu: ICategory) => (
            <li
              key={subMenu.id}
              className="relative  text-grey-900 menu-hov font-medium not-italic text-lg flex  items-center"
            >
              <Link
                to={`/categories/${activeMenu?.menu}/${activeMenu.subMenu}`}
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
