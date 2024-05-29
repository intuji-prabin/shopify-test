import {Link} from '@remix-run/react';
import {settingCards} from './settingCards';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {MetaFunction} from '@shopify/remix-oxygen';
import {BackButton} from '~/components/ui/back-button';
import {Can} from '~/lib/helpers/Can';

export const meta: MetaFunction = () => {
  return [{title: 'Company Information'}];
};
export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  return null;
}

export default function CompanySettings() {
  return (
    <div className="container pt-6 bg-primary-25 ">
      <div className="mb-6">
        <BackButton
          className="capitalize text-grey-900"
          title="Distributor Information"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {settingCards.map((settingCard) => (
          <div
            key={settingCard.id}
            className="p-6 bg-white max-w-[627px] flex gap-[35px] flex-col"
          >
            <div className="flex flex-col gap-[35px]" key={settingCard.id}>
              <div className="flex flex-col gap-2">
                <h4>{settingCard.title}</h4>
                <p>{settingCard.description}</p>
              </div>
              <Can
                I="view"
                a={
                  settingCard.title === 'Distributor Profile'
                    ? 'view_company_information'
                    : settingCard.title === 'Shipping Addresses'
                    ? 'view_shipping_addresses'
                    : ''
                }
              >
                <Link
                  className="uppercase text-sm italic font-bold py-2.5 px-6 bg-primary-500 text-white max-w-[116px] text-center inline-block"
                  to={settingCard.link}
                >
                  {settingCard.btnText}
                </Link>
              </Can>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
