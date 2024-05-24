import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import { useConditionalRender } from '~/hooks/useAuthorization';
import {Routes} from '~/lib/constants/routes.constent';
import {AllowImpersonateForm} from '~/routes/_app.support_.allow-impersonate/allow-impersonate-form';

export default function AllowImpersonatePage() {
  const shouldRender = useConditionalRender('allow_impersonation');

  return (
    shouldRender && (<section className="container">
      <div className=" pt-6 pb-4">
        <BackButton title="Allow Impersonate" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.SUPPORT}>Support</BreadcrumbItem>
          <BreadcrumbItem
            href={Routes.SUPPORT_ALLOW_IMPERSONATE}
            className="text-grey-900"
          >
            Allow Impersonate
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <p className="my-6">
        Allow Impersonate is a collaborative effort between you and IT customer
        support to troubleshoot and resolve technical issues while maintaining
        the security and privacy of your account and data. It provides an
        efficient way to address problems without the need for physical
        presence.
      </p>
      <AllowImpersonateForm />
    </section>)
  );
}
