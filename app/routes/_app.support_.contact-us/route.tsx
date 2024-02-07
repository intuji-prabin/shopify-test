import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {ContactUsCard} from '~/routes/_app.support_.contact-us/contact-us-card';
import {ContactUsData} from '~/routes/_app.support_.contact-us/contact-us-data';
import {BackButton} from '~/components/ui/back-button';
import {Routes} from '~/lib/constants/routes.constent';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {isAuthenticate} from '~/lib/utils/authsession.server';
import {getSupportContact} from './support-contact-us.server';
import {useLoaderData} from '@remix-run/react';

export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const contacts = await getSupportContact({context});
  return json({contacts});
}

export default function ContactUsPage() {
  const {contacts} = useLoaderData<typeof loader>();
  console.log(contacts);

  return (
    <section className="container">
      <div className=" pt-6 pb-4">
        <BackButton title="Contact Us" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.SUPPORT}>Support</BreadcrumbItem>
          <BreadcrumbItem
            href={Routes.SUPPORT_CONTACT_US}
            className="text-grey-900"
          >
            Contact Us
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="my-6 grid gap-6 sm:grid-cols-2">
        {(contacts.length > 0 &&
          contacts.map((item, index) => (
            <ContactUsCard key={index} {...item} />
          ))) || <h3>No contacts found</h3>}
      </div>
    </section>
  );
}
