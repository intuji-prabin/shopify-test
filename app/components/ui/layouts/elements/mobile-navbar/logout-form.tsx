import {Form} from '@remix-run/react';
import {Signout} from '~/components/icons/signout';
import {Button} from '~/components/ui/button';

export default function LogoutForm() {
  return (
    <Form method="post" action="/logout" className="w-full">
      <Button className="flex gap-[2px] justify-start p-0 hover:bg-transparent">
        <Signout />
        <p className="italic uppercase font-bold text-base text-white">
          Log out
        </p>
      </Button>
    </Form>
  );
}
