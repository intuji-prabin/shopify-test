import { json, useLoaderData } from '@remix-run/react';
import { OptionsCardData } from '~/routes/_app.support/options-data';
import { OptionsCard } from '~/routes/_app.support/options-card';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { isAuthenticate, isImpersonating } from '~/lib/utils/auth-session.server';
import { MetaFunction } from '@shopify/remix-oxygen';
import { BackButton } from '~/components/ui/back-button';
import { Can } from '~/lib/helpers/Can';

export const meta: MetaFunction = () => {
  return [{ title: 'Support' }];
};

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const isImpersonatingCheck = await isImpersonating(request);
  return json({ isImpersonatingCheck });
};

export default function SupportPage() {
  const { isImpersonatingCheck } = useLoaderData<typeof loader>();
  return (
    <section className="container">
      <div className="pt-6 pb-4">
        <BackButton className="capitalize" title="Remote Support Session" />
      </div>
      <p className="mb-6">
        A remote support session is a collaborative technology-driven
        interaction between a support technician and a user, where the
        technician provides assistance, troubleshooting, or guidance for
        resolving technical issues on the user's device or system. This method
        is widely used in today's digital age and offers several advantages.
      </p>
      <h4 className="mb-6">Available options</h4>
      <div className="grid gap-6 sm:grid-cols-2">
        {OptionsCardData.map((card) => (
          <Can
            key={card.title}
            I="view"
            a={
              card.title === 'Allow Impersonation'
                ? 'allow_impersonation'
                : card.title === 'My Tickets'
                  ? 'ticket_operations'
                  : 'view_contact_details'
            }
          >
            {(card.title === 'Allow Impersonation' && isImpersonatingCheck === "true") ?
              null : <OptionsCard key={card.title} {...card} />}
          </Can>
        ))}
      </div>
    </section>
  );
}
