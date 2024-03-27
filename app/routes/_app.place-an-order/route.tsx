import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import OrderTable from './order-table';
import {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {isAuthenticate} from '~/lib/utils/auth-session.server';

export const meta: MetaFunction = () => {
  return [{title: 'Place an Order'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  return null;
}

export default function BulkOrderPage({measurement}: {measurement?: string}) {
  return (
    <>
      <HeroBanner
        imageUrl={'/place-order.png'}
        sectionName={'PLACE AN ORDER'}
      />
      <UploadSearchbar searchVariant="place_an_order" />
      <OrderTable />
    </>
  );
}
