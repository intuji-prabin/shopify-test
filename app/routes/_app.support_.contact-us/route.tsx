import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {ContactUsCard} from '~/routes/_app.support_.contact-us/contact-us-card';
import {ContactUsData} from '~/routes/_app.support_.contact-us/contact-us-data';
import {BackButton} from '~/components/ui/back-button';
import {Routes} from '~/lib/constants/routes.constent';

export default function ContactUsPage() {
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
        {ContactUsData.map((item, index) => (
          <ContactUsCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
