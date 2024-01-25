import {useState} from 'react';
import {menuItemsData} from './elements/bottom-header-menu-items';
import {SingleNavItem} from './elements/bottom-header-single-Menus';

const BottomHeader = ({categories}: {categories: any}) => {
  const depthLevel = 0;
  const [activeMenu, setActiveMenu] = useState('');
  return (
    <nav className="desktop-nav bg-primary-500  relative">
      <div className="container">
        <ul className="menus flex flex-row justify-between">
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
