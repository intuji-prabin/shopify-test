import { Link } from '@remix-run/react';
import { Content } from '~/components/icons/content';
import { Invoice, Order, Statements } from '~/components/icons/orderStatus';
import Promotions from '~/components/icons/promotions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

import { Account } from '~/components/icons/account';
import Resources from '~/components/icons/resources';
import { Routes } from '~/lib/constants/routes.constent';
import { useHamburgerMenu } from '../HamburgerMenuContext';
export function AccountDropDownMobile() {
  const { isOpen, toggleMenu } = useHamburgerMenu();

  const accounts = [
    {
      title: 'Orders',
      url: Routes.ORDERS,
      icon: <Order fillColor="#fff" />,
    },
    {
      title: 'Invoice',
      url: Routes.INVOICES,
      icon: <Invoice fillColor="#fff" />,
    },
    {
      title: 'Statements',
      url: Routes.STATEMENTS,
      icon: <Statements fillColor="#fff" />,
    },
  ];

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full submenu-mobile-nav [&>button]:flex items-start gap-2"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex items-start gap-2">
            <Account />
            Account
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {' '}
              {accounts.map((account) => {
                return (
                  <li
                    className="flex flex-row items-center justify-center gap-1 p-3 text-lg italic font-bold text-white menu-items group "
                    key={account.title}
                  >
                    <Link
                      to={account.url}
                      className="relative flex items-center gap-1 menu-links "
                      onClick={() => toggleMenu(!isOpen)}
                    >
                      {account.title}
                      {account.icon}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export function ContentDropdownMobile() {
  const { isOpen, toggleMenu } = useHamburgerMenu();
  const contentManagement = [
    {
      id: 1,
      title: 'Promotions',
      url: Routes.PROMOTIONS,
      icon: <Promotions fill="#fff" />,
    },
  ];

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full submenu-mobile-nav [&>button]:flex items-start gap-2"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex items-start gap-2">
          <Content />
          Content management
        </AccordionTrigger>
        <AccordionContent>
          <ul>
            {contentManagement.map((account) => (
              <li
                key={account.id}
                className="flex flex-row items-center justify-center gap-1 p-3 text-lg italic font-bold text-white menu-items group"
              >
                <Link
                  to={account.url}
                  className="relative flex items-center gap-1 menu-links"
                  onClick={() => toggleMenu(!isOpen)}
                >
                  {' '}
                  {account.icon}
                  {account.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function ResourcesDropdownMobile() {
  const { isOpen, toggleMenu } = useHamburgerMenu();

  const resources = [
    {
      title: 'Certificate Generation',
      url: Routes.CERTIFICATE_GENERATION,
      icon: <Invoice fillColor="#fff" />,
    },
    {
      title: 'Cigweld MSDS Dashboard',
      url: "https://jr.chemwatch.net/outb/dashboard",
      icon: <Invoice fillColor="#fff" />,
      external: true,
    },
  ];

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full submenu-mobile-nav [&>button]:flex items-start gap-2"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex items-start gap-2">
          <Resources />
          Resources
        </AccordionTrigger>
        <AccordionContent>
          <ul>
            {resources.map((account, index) => (
              <li
                key={index}
                className="flex flex-row items-center justify-center gap-1 p-3 text-lg italic font-bold text-white menu-items group"
              >
                <Link
                  to={account.url}
                  className="relative flex items-center gap-1 menu-links"
                  onClick={() => toggleMenu(!isOpen)}
                  target={account.external ? '_blank' : ''}
                >
                  {' '}
                  {account.icon}
                  {account.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
