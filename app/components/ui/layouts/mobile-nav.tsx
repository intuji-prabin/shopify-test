import {NotificationIcon} from '../../icons/notification';
import {Cart, Heart} from '../../icons/orderStatus';
import {FaSearch} from 'react-icons/fa';
import {useState} from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import HamburgerIcon from '~/components/icons/hamburgerIcon';
import {Signout} from '~/components/icons/signout';
import Search from '~/components/icons/search';
import {Note} from '~/components/icons/note';
import {Button} from '../button';

export default function MobileNav() {
  const [isHamOpen, setIsHamOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navIcons = [
    {
      id: 1,
      icon: <Cart />,
      notification: '3',
    },
    {
      id: 2,
      icon: <Note />,
      notification: '3',
    },
    {
      id: 3,
      icon: <Heart />,
      notification: '3',
    },
    {
      id: 4,
      icon: <NotificationIcon />,
      notification: '3',
    },
  ];
  const navigations = [
    {
      id: 0,
      title: 'Home',
    },
    {
      id: 1,
      title: 'dashboard',
    },
    {
      id: 2,
      title: 'All products',
    },
    {
      id: 4,
      title: 'Blogs',
    },
  ];
  return (
    <>
      <div className="bg-grey-900 px-4 py-6 flex justify-between items-center">
        <a href="">
          <figure>
            <img src="logo.png" alt="" />
          </figure>
        </a>
        <div className="flex gap-2 items-center">
          <Button
            className="border border-[#313535] p-2 bg-transparent max-w-10 max-h-10 hover:bg-transparent"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
            }}
          >
            {' '}
            <Search fillColor="#FFE600" />
          </Button>

          <Button
            className="border border-[#313535] p-2 bg-transparent max-w-10 max-h-10 hover:bg-transparent"
            onClick={() => {
              setIsHamOpen(!isHamOpen);
            }}
          >
            {isHamOpen ? <CloseMenu /> : <HamburgerIcon />}
          </Button>
        </div>
      </div>

      <div
        className={`bg-primary-500 p-4 flex flex-col gap-[195px] transition-opacity ease-in-out delay-75 duration-150 
        ${isHamOpen ? 'opacity-100' : 'opacity-0'}  `}
      >
        <div className="user-menu flex gap-4 flex-col">
          <div className="flex justify-between ">
            {' '}
            <div className="flex gap-2 ">
              <figure>
                <img src="pfp.png" alt="" />
              </figure>
              <p className="text-lg font-normal text-white">Niel De Grass</p>
            </div>
            <nav className="navbar">
              <ul className="nav-list flex gap-3 items-center h-full">
                {navIcons.map((navIcon) => (
                  <li className="nav-item relative" key={navIcon.id}>
                    <div className="absolute bg-semantic-danger-500 h-[14px] w-[14px] rounded-[50%] right-[-9px] top-[-9px] flex items-center justify-center text-xs text-white font-medium p-2">
                      {navIcon.notification}
                    </div>
                    <a className="nav-link">{navIcon.icon}</a>
                    <div className=""></div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="search-bar flex border gap-2 border-white items-center min-w-[unset] w-full max-h-12 px-4 py-3 xl:min-w-[453px] ">
            <FaSearch className="search-icon fill-white" />
            <input
              type="text"
              placeholder="Search Product"
              className="border-none w-full placeholder:italic placeholder:text-base placeholder:font-bold placeholder:text-white bg-transparent outline-none text-white"
            />
          </div>

          <div className="">
            <ul className="flex flex-col gap-4">
              {navigations.map((navigation) => (
                <li
                  key={navigation.id}
                  className="italic uppercase font-bold text-base text-white hover:text-secondary-500  active:text-secondary-500"
                >
                  <a href="" className="w-full block">
                    {navigation.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex gap-[2px]">
          <Signout />
          <p className="italic uppercase font-bold text-base text-white">
            sign out
          </p>
        </div>
      </div>
    </>
  );
}
