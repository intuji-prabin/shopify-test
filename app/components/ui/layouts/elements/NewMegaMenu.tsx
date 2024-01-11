import ArrowForward from '~/components/icons/arrowForward';

export const NewMegaMenu = ({isOpen}: {isOpen: boolean}) => {
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
    <div
      className={`${
        isOpen ? 'opacity-100' : 'opacity-0'
      } transition-opacity megamenu-content p-3  text-black shadow-xl absolute bg-white top-16 -left-8 -mt-2 flex flex-row `}
    >
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px]">
        {subMenus?.map((subMenu) => (
          <li
            key={subMenu.id}
            className="group/menu relative italic font-bold text-lg text-grey-900 flex menu-hov justify-between"
          >
            <span className="rounded px-2 py-1 font-medium text-lg flex flex-row-reverse items-center menu-hov w-full justify-between">
              {' '}
              <ArrowForward />
              {subMenu.menu}
            </span>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px] border border-x-2 border-[#F5F5F5] px-2 border-y-0">
        {subMenus?.map((subMenu) => (
          <li
            key={subMenu.id}
            className="group/menu relative  text-grey-900 flex menu-hov font-medium not-italic text-lg  items-center"
          >
            <span className="rounded px-2 py-1 font-medium text-lg flex flex-row-reverse items-center menu-hov between w-full justify-between">
              {' '}
              <ArrowForward />
              {subMenu.menu}
            </span>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col space-y-2 text-white submenu-nav min-w-[217px]">
        {subMenus?.map((subMenu) => (
          <li
            key={subMenu.id}
            className="group/menu relative  text-grey-900 menu-hov font-medium not-italic text-lg flex  items-center"
          >
            <span className="rounded px-2 py-1 font-medium text-lg flex flex-row-reverse items-center menu-hov justify- w-full">
              {' '}
              {subMenu.menu}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
