import {Account} from '~/components/icons/account';
import {Content} from '~/components/icons/content';
import {Home} from '~/components/icons/home';
import {MyTeam} from '~/components/icons/myteam';
import {Product} from '~/components/icons/product';
import Resources from '~/components/icons/resources';
import {Settings} from '~/components/icons/setting';
import {Support} from '~/components/icons/support';

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
      {title: 'Orders', url: '/orders'},
      {title: 'Orders', url: '/orders'},
      {title: 'Orders', url: '/orders'},
    ],
  },
  {
    title: 'Product',
    type: 'megamenu',
    icon: <Product />,
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
      {title: 'Orders', url: '/orders'},
      {title: 'Orders', url: '/orders'},
      {title: 'Orders', url: '/orders'},
    ],
  },
  {
    title: 'My Team',
    type: 'link',
    url: '/about',
    icon: <MyTeam />,
  },
  {
    title: 'Support',
    type: 'link',
    url: '/support',
    icon: <Support />,
  },
  {
    title: 'Resourcs',
    type: 'normal',
    icon: <Resources />,
    submenu: [
      {title: 'Orders', url: '/orders'},
      {title: 'Orders', url: '/orders'},
      {title: 'Orders', url: '/orders'},
    ],
  },
  {
    title: 'Settings',
    type: 'link',
    url: '/settings',
    icon: <Settings />,
  },
];
