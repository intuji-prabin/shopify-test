import React from 'react';
import {PcIcon} from '~/components/icons/pc-icon';
import {HeadPhoneIcon} from '~/components/icons/headphone-icon';
import {PhoneIcon, PhoneIconImage} from '~/components/icons/phone-icon';
import {Routes} from '~/lib/constants/routes.constent';

export type OptionsCardType = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

export const OptionsCardData: OptionsCardType[] = [
  {
    icon: <PcIcon />,
    title: 'Allow Impersonation',
    description:
      'When enabled, it grants a user or a process the ability to act on behalf of another user or entity.',
    link: Routes.SUPPORT_ALLOW_IMPERSONATE,
  },
  {
    icon: <HeadPhoneIcon />,
    title: 'My Tickets',
    description:
      'My tickets provide a comprehensive view of your support history. Access them easily, review updates, and track resolutions.',
    link: Routes.SUPPORT_TICKETS,
  },
  {
    icon: <PhoneIconImage image_url={'/phone-icon.png'} />,
    title: 'Contact Us',
    description: 'Find the list of contact details.',
    link: Routes.SUPPORT_CONTACT_US,
  },
];
