import {Link} from '@remix-run/react';
import {settingCards} from './settingCards';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {isAuthenticate} from '~/lib/utils/authsession.server';
import {MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => {
  return [{title: 'Company Information'}];
};
export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  return {};
}

export default function CompanySettings() {
  return (
    <div className="bg-primary-25 container pt-6 ">
      <h3 className="mb-6 text-grey-900">Company Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {settingCards.map((settingCard) => (
          <div
            key={settingCard.id}
            className="p-6 bg-white max-w-[627px] flex gap-[35px] flex-col"
          >
            <div className="flex flex-col gap-[35px]" key={settingCard.id}>
              <div className="flex  gap-2 flex-col ">
                <h4>{settingCard.title}</h4>
                <p>{settingCard.description}</p>
              </div>
              <Link
                className="uppercase text-sm italic font-bold py-2.5 px-6 bg-primary-500 text-white max-w-[116px] text-center inline-block"
                to={settingCard.link}
              >
                {settingCard.btnText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
