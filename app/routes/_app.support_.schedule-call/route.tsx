import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {
  ScheduleCallForm,
  ScheduleCallFormFieldValidator,
} from './schedule-call-form';
import {Routes} from '~/lib/constants/routes.constent';
import {validationError} from 'remix-validated-form';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {ActionFunctionArgs, json} from '@remix-run/server-runtime';

export async function action({request, context}: ActionFunctionArgs) {
  console.log('hello');

  await isAuthenticate(context);
  try {
    const result = await ScheduleCallFormFieldValidator.validate(
      await request.formData(),
    );
    if (result.error) {
      return validationError(result.error);
    }
    console.log('result', result.data);

    return json({});
  } catch (error) {}
}

export default function ScheduleCallPage() {
  return (
    <section className="container">
      <div className=" pt-6 pb-4">
        <BackButton title="Schedule a Call" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.SUPPORT}>Support</BreadcrumbItem>
          <BreadcrumbItem
            href={Routes.SUPPORT_SCHEDULE_CALL}
            className="text-grey-900"
          >
            Schedule a Call
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <p className="my-6">
        A remote support session is a collaborative technology-driven
        interaction between a support technician and a user, where the
        technician provides assistance, troubleshooting, or guidance for
        resolving technical issues on the user's device or system. This method
        is widely used in today's digital age and offers several advantages.
      </p>
      <ScheduleCallForm />
    </section>
  );
}
