import {Link} from '@remix-run/react';
import {CircleInformationMajor} from '~/components/icons/orderStatus';

type InfoBarDetails = {
  title: string;
  url: string;
};
export default function InfoBar({title, url}: InfoBarDetails) {
  return (
    <div className="flex gap-2 px-4 py-2 mb-2 border-l-4 border-r-0 bg-semantic-info-100 border-semantic-info-500 border-y-0">
      <CircleInformationMajor />
      <p className="text-base font-normal ">
        {title}{' '}
        <span className="underline text-semantic-info-500">
          <Link to="">{url}</Link>
        </span>
      </p>
    </div>
  );
}
