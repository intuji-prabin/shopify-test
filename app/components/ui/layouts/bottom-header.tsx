
import { useState } from 'react';
import { menuItemsData } from './elements/bottom-header-menu-items';
import { SingleNavItem } from './elements/bottom-header-single-Menus';
import { Payload } from '~/routes/_app/app.server';

const BottomHeader = ({ categories }: { categories: Payload[] }) => {

  const depthLevel = 0;
  const [activeMenu, setActiveMenu] = useState('');
  return (
    <nav className="relative desktop-nav bg-primary-500">
      <div className="container">
        <ul className="flex flex-row justify-between menus">
          {menuItemsData.map((menu, index) => {
            return (
              <SingleNavItem
                menu={menu}
                key={index}
                depthLevel={depthLevel}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                categories={categories}
              />
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomHeader;

export type MenuItems = (typeof menuItemsData)[0];
