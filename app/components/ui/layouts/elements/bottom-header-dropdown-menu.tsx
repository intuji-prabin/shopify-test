import { Link } from '@remix-run/react';
import { Can } from '~/lib/helpers/Can';

export const NormalMenuList = ({
  submenus,
}: {
  submenus: {
    title: string;
    url?: string;
    icon?: JSX.Element;
    external?: boolean;
  }[];
}) => {
  return (
    <ul
      className={`transition-opacity flex min-w-[233px] flex-col border-2 bg-white p-3 shadow-xl md:min-w-[233px] submenu-nav -ml-[21px] absolute text-black top-8 dropdown-content gap-2 z-20 left-0`}
    >
      {submenus.map((component) => (
        <Can
          I="view"
          a={
            component.title === 'Statements'
              ? 'view_company_statements'
              : component.title === 'Invoices'
                ? 'view_company_invoices'
                : component.title === 'Certificate Generation'
                  ? 'conformance_certificates'
                  : 'view_orders'
          }
          key={component.title}
        >
          <li className="" key={component.title}>
            {component.external ? (
              <div
                className="flex items-center gap-1 py-2 pl-1 transition duration-500 ease-in-out delay-75 menu-hov text-grey-900"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(component.url, '_blank')
                }}
              >
                {component.icon}{' '}
                <h5 className="text-lg italic font-bold text-grey-900">
                  {component.title}
                </h5>
              </div>
            ) : (
              <Link
                to={component.url || ''}
                className="flex items-center gap-1 py-2 pl-1 transition duration-500 ease-in-out delay-75 menu-hov text-grey-900"
              >
                {component.icon}{' '}
                <h5 className="text-lg italic font-bold text-grey-900">
                  {component.title}
                </h5>
              </Link>
            )}
          </li>
        </Can>
      ))}
    </ul>
  );
};
