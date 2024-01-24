import {Link} from '@remix-run/react';
import {ReactElement, useRef} from 'react';
import {Invoice, Order, Statements} from '~/components/icons/orderStatus';

export const NormalMenuList = ({isOpen}: {isOpen: boolean}) => {
  const menus: {title: string; href: string; icon: ReactElement}[] = [
    {
      title: 'Orders',
      href: '/docs/primitives/alert-dialog',
      icon: <Order />,
    },
    {
      title: 'Invoice',
      href: '/docs/primitives/progress',
      icon: <Invoice />,
    },
    {
      title: 'Statements',
      href: '/docs/primitives/hover-card',
      icon: <Statements />,
    },
  ];

  return (
    <>
      <ul
        className={`${
          isOpen ? 'opacity-100' : 'hidden'
        } transition-opacity flex min-w-[233px] flex-col border-2 bg-white p-3 shadow-xl md:min-w-[233px] mt-2 submenu-nav -ml-[46px] absolute text-black top-10 dropdown-content gap-2 z-20 left-0`}
      >
        {menus.map((component) => (
          <li className=" " key={component.title}>
            <Link
              to=""
              className="menu-hov flex items-center gap-1 text-grey-900 py-2 pl-1 transition duration-500 ease-in-out delay-75"
            >
              {component.icon}{' '}
              <h5 className="italic font-bold text-lg text-grey-900">
                {component.title}
              </h5>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
