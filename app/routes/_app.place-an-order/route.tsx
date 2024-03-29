import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@shopify/remix-oxygen';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {Outlet} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Place an Order'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  return null;
}

export async function action({context, request}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const formData = await request.formData();

  const action = formData.get('_action') as 'add_product';

  switch (action) {
    case 'add_product': {
      console.log('data list', Object.fromEntries(formData));
      return redirect('/place-an-order/list');
    }
    default:
      break;
  }
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
      <Outlet />
    </>
  );
}
