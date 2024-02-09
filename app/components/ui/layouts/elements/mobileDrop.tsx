import {Link} from '@remix-run/react';
import {Invoice, Order, Statements} from '~/components/icons/orderStatus';
import Promotions from '~/components/icons/promotions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {Routes} from '~/lib/constants/routes.constent';
export function MobileDropDOwn() {
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

  const contentManagement = [
    {
      title: 'Promotions',
      url: Routes.PROMOTIONS,
      icon: <Promotions />,
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
          Account
        </AccordionTrigger>
          <AccordionContent>
          <ul>
            {' '}
            {accounts.map((account) => {
              return (
                <li className="flex flex-row items-center justify-center gap-1 p-3 text-lg italic font-bold text-white menu-items group ">
                  <Link
                    to={account.url}
                    className="relative flex items-center gap-1 menu-links 
                    "
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
  );
}
