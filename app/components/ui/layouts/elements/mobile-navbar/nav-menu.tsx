import {Link} from '@remix-run/react';
import {mobileMenuItemsData} from '../bottom-header-menu-items';
import {useHamburgerMenu} from '../HamburgerMenuContext';

export default function NavMenu() {
  const {isOpen, toggleMenu} = useHamburgerMenu();

  return (
    <ul className="flex flex-col gap-4 menu-items">
      {mobileMenuItemsData.map((navigation) => (
        <li
          key={navigation.id}
          className="italic uppercase font-bold text-base text-white hover:text-secondary-500  active:text-secondary-500 hover:[&_path]:fill-secondary-500
"
        >
          {navigation.url ? (
            <Link
              to={navigation.url}
              className="w-full flex items-center gap-2 text-base font-bold leading-[21px] italic"
              onClick={() => toggleMenu(!isOpen)}
            >
              {navigation.icon}
              {navigation.title}
            </Link>
          ) : (
            <div className="w-full flex items-center gap-2 text-base font-bold leading-[21px] italic">
              {navigation.icon}
              {navigation.title}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
