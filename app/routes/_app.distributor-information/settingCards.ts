import {Routes} from '~/lib/constants/routes.constent';

export const settingCards = [
  {
    id: 1,
    title: 'Distributor Profile',
    description:
      "View your distributor's information for a more in-depth look into your organization.",
    btnText: 'VIEW Profile',
    link: Routes.DISTRIBUTOR_PROFILE,
  },
  {
    id: 2,
    title: 'Shipping Addresses',
    description:
      'View shipping addresses for easier handling of shipping locations.',
    btnText: 'View',
    link: Routes.SHIPPING_ADDRESS,
  },
];
