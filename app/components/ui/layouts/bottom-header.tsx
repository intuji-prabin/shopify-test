import {menuItemsData} from './elements/menuItemData';
import {SingleNavItem} from './elements/single-nav-item';

const BottomHeader = () => {
  const depthLevel = 0;
  return (
    <nav className="desktop-nav bg-primary-500 py-5 relative">
      <div className="container">
        <ul className="menus flex flex-row justify-between">
          {menuItemsData.map((menu, index) => {
            return (
              <SingleNavItem menu={menu} key={index} depthLevel={depthLevel} />
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomHeader;

export type MenuItems = (typeof menuItemsData)[0];
