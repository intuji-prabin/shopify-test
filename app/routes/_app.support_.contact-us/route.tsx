import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { ContactUsCard } from '~/routes/_app.support_.contact-us/contact-us-card';
import { BackButton } from '~/components/ui/back-button';
import { Routes } from '~/lib/constants/routes.constent';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getSupportContact } from './support-contact-us.server';
import { useLoaderData } from '@remix-run/react';
import { MetaFunction } from '@shopify/remix-oxygen';
import { useConditionalRender } from '~/hooks/useAuthorization';

export const meta: MetaFunction = () => {
  return [{ title: 'Contact Us' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    await isAuthenticate(context);
    const contacts = await getSupportContact({ context });
    return json({ contacts });
  } catch (error) {
    throw new Error('something went wrong');
  }
}

export default function ContactUsPage() {
  const { contacts } = useLoaderData<typeof loader>();
  const shouldRender = useConditionalRender('view_contact_details');

  return (
    shouldRender && (
      <section className="container">
        <div className="pt-6 pb-4 ">
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

        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 my-6 lg:grid-cols-2">
            {contacts.map((item, index) => (
              <ContactUsCard key={index} {...item} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <h3>No contacts found</h3>
          </div>
        )}
      </section>
    )
  );
}
