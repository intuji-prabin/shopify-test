import {Account} from '~/components/icons/account';
import {Content} from '~/components/icons/content';
import {Home} from '~/components/icons/home';
import {MyTeam} from '~/components/icons/myteam';
import {Invoice, Order, Statements} from '~/components/icons/orderStatus';
import {Product} from '~/components/icons/product';
import Promotions from '~/components/icons/promotions';
import Resources from '~/components/icons/resources';
import {Settings} from '~/components/icons/setting';
import {Support} from '~/components/icons/support';
import {Routes} from '~/lib/constants/routes.constent';
import {
  AccountDropDownMobile,
  ContentDropdownMobile,
  ResourcesDropdownMobile,
} from './mobile-navbar/mobile-drop';

export const menuItemsData = [
  {
    title: 'Home',
    url: '/',
    type: 'link',
    icon: <Home />,
  },
  {
    title: 'Accounts',
    type: 'normal',
    icon: <Account />,
    submenu: [
      {
        title: 'Orders',
        url: Routes.ORDERS,
        icon: <Order />,
      },
      {
        title: 'Invoice',
        url: Routes.INVOICES,
        icon: <Invoice />,
      },
      {
        title: 'Statements',
        url: Routes.STATEMENTS,
        icon: <Statements />,
      },
    ],
  },
  {
    title: 'Products',
    type: 'megamenu',
    icon: <Product />,
    url: Routes.CATEGORIES,
    submenu: [
      {
        title: 'Web Design',
        url: 'web-design',
      },
      {
        title: 'Web Development',
        url: 'web-dev',
        submenu: [
          {
            title: 'Frontend',
            url: 'frontend',
          },
          {
            title: 'Backend',
            submenu: [
              {
                title: 'NodeJS',
                url: 'node',
              },
              {
                title: 'PHP',
                url: 'php',
              },
            ],
          },
        ],
      },
      {
        title: 'SEO',
        url: 'seo',
      },
    ],
  },
  {
    title: 'Content Management',
    type: 'normal',
    icon: <Content />,
    submenu: [
      {
        title: 'Promotions',
        url: Routes.PROMOTIONS,
        icon: <Promotions />,
      },
    ],
  },
  {
    title: 'My Team',
    type: 'link',
    url: '/team',
    icon: <MyTeam />,
  },
  {
    title: 'Support',
    type: 'link',
    url: '/support',
    icon: <Support />,
  },
  {
    title: 'Resources',
    type: 'normal',
    icon: <Resources />,
    submenu: [
      {
        title: 'Certificate Generation',
        url: Routes.CERTIFICATE_GENERATION,
        icon: <Invoice />,
      },
    ],
  },
  {
    title: 'Company Information',
    type: 'link',
    url: '/company-info',
    icon: <Settings />,
  },
];

export const mobileMenuItemsData = [
  {
    id: 0,
    title: 'Home',
    url: '/',
    icon: <Home />,
  },
  {
    id: 1,
    title: <AccountDropDownMobile />,
  },
  {
    id: 2,
    title: 'All Product',
    icon: <Product />,
    url: Routes.CATEGORIES,
  },
  {
    id: 3,
    title: <ContentDropdownMobile />,
  },
  {
    id: 4,
    title: 'My Team',
    url: Routes.TEAM,
    icon: <MyTeam />,
  },
  {
    title: 'Support',
    url: Routes.SUPPORT,
    icon: <Support />,
  },
  {
    id: 5,
    title: <ResourcesDropdownMobile />,
  },
  {
    id: 6,
    title: 'Settings',
    url: Routes.SETTINGS,
    icon: <Settings />,
  },
];
