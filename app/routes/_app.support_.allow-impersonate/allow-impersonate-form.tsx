import { Form, Link, useNavigate, useSubmit } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { Routes } from '~/lib/constants/routes.constent';

export function AllowImpersonateForm({
  defaultValues
}: {
  defaultValues: {
    impersonateActive: boolean;
    reason: string;
    status: string;
  };
}) {
  const [isActive, setIsActive] = useState(defaultValues.impersonateActive);
  const [isBtnEnabled, setIsBtnEnabled] = useState(true);

  const handleActiveChange = () => {
    setIsActive((previousState) => !previousState);
  }

  useEffect(() => {
    if (defaultValues.impersonateActive === isActive) {
      setIsBtnEnabled(true);
    } else {
      setIsBtnEnabled(false);
    }
  }, [isActive, defaultValues.impersonateActive]);

  return (
    <div className="grid gap-6 p-6 bg-neutral-white sm:grid-cols-2">
      <div>
        <Form method="POST"
          id="impersonate-form"
        >
          <label htmlFor="allow-impersonate">
            Allow impersonate
            <span className="required">*</span>
          </label>
          <Switch
            type="button"
            checked={isActive}
            onCheckedChange={handleActiveChange}
            disabled={defaultValues.status === 'LOGGEDIN'}
          />
          <label htmlFor="reason" className={`${!isActive && "opacity-50"}`}>
            Reason to Impersonate
          </label>
          {isActive ?
            <textarea
              name="reason"
              placeholder="Reason here"
              rows={8}
              maxLength={900}
              defaultValue={defaultValues.reason}
              disabled={isBtnEnabled}
              className={`${isBtnEnabled && 'pointer-events-none opacity-50'} w-full`}
            ></textarea>
            :
            <p className='border border-solid border-grey-300/50 h-[178px] pointer-events-none mb-1.5'></p>
          }
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              variant="primary"
              name="_action"
              disabled={isBtnEnabled}
              value={`${isActive ? 'allow_impersonate' : 'disallow_impersonate'
                }`}
            >
              send
            </Button>
            <p>
              By clicking send, you are granting permission to Cigweld to access
              and work on your account.
            </p>
          </div>
        </Form>
      </div>
      <div className="p-6 bg-primary-50">
        <h4>What will happen?</h4>
        <ul className="mt-4 ml-5 list-disc">
          <li>Your data will not be shared with anyone.</li>
          <li>Your data will not be modified or updated.</li>
          <li>
            We will send you a recording of our staff working on your account to
            your email.
          </li>
          <li>You will be contacted if any changes need to be made.</li>
          <li className="mb-8">
            If you are having any trouble with allowing impersonate option,
            please try{' '}
            <Link
              to={Routes.SUPPORT_TICKETS_CREATE}
              className="font-medium text-primary-500"
            >
              Schedule a call
            </Link>{' '}
            option.{' '}
          </li>
        </ul>
      </div>
    </div>
  );
}
