import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import EmptyList from '~/components/ui/empty-list';
import { isAuthenticate } from '~/lib/utils/auth-session.server';

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  console.log('hello index page');

  return null;
}

export default function PlaceAnOrderIndexPage() {
  return (
    <EmptyList />
  );
}
