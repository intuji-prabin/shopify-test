import {Separator} from '~/components/ui/separator';
import {OptionsCardData} from '~/routes/_app.support/options-data';
import {OptionsCard} from '~/routes/_app.support/options-card';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { isAuthenticate } from '~/lib/utils/authsession.server';
import { json } from '@remix-run/react';

export const loader = async (  { context } : LoaderFunctionArgs ) => {
  await isAuthenticate( context )
  return json({})
}
export default function SupportPage() {
  return (
    <section className="container">
      <h3 className=" pt-6 pb-4">Remote Support Session</h3>
      <Separator className="mb-4" />
      <p className="mb-6">
        A remote support session is a collaborative technology-driven
        interaction between a support technician and a user, where the
        technician provides assistance, troubleshooting, or guidance for
        resolving technical issues on the user's device or system. This method
        is widely used in today's digital age and offers several advantages.
      </p>
      <h4 className="mb-6">Available options</h4>
      <div className="grid gap-6 sm:grid-cols-2">
        {OptionsCardData.map((card, index) => (
          <OptionsCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}
