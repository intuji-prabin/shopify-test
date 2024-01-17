import { Form, useActionData } from '@remix-run/react';
import { ActionFunctionArgs } from '@remix-run/server-runtime';
import { useState, Fragment, useRef, useEffect } from 'react';
import { DangerAlert } from '~/components/icons/alert';
import { Button } from '~/components/ui/button';

let currentOtpIndex: number = 0;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const otpKey = formData.getAll('otp');
  const finalOtp = otpKey.join('');
  let validateOtp = (finalOtp: string) => {
    if (!finalOtp) {
      return 'This field is required';
    } else if (finalOtp.length < 5) {
      return 'Please fill the complete code';
    }
  };
  const formErrors = {
    otp: validateOtp(finalOtp),
  };
  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  // Return final OTP if no form errors
  return { finalOtp };
};

type ActionData = {
  formErrors?: {
    otp?: string;
  };
  finalOtp?: string;
};

const OtpVerification = () => {
  const [tempOtp, setTempOtp] = useState<string[]>(new Array(5).fill(''));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  let [otp, setOtp] = useState<number>(0);

  const handleOtpChange = (value: number) => {
    setOtp(value);
  };

  const handleOnchange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOtp: string[] = [...tempOtp];
    newOtp[currentOtpIndex] = value.substring(value.length - 1);

    if (!value) setActiveOtpIndex(currentOtpIndex - 1);
    else setActiveOtpIndex(currentOtpIndex + 1);

    setTempOtp(newOtp);
    handleOtpChange(
      isNaN(parseInt(newOtp.join(''))) ? 0 : parseInt(newOtp.join('')),
    );
    otp = isNaN(parseInt(tempOtp.join(''))) ? 0 : parseInt(tempOtp.join(''));
  };

  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    currentOtpIndex = index;
    if (key === 'Backspace') {
      setActiveOtpIndex(currentOtpIndex - 1);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const actionData = useActionData<ActionData>();
  console.log('actionData', actionData);
  return (
    <Form method="post">
      <div className="flex items-center space-x-2 w-fit">
        {tempOtp.map((_, index) => {
          return (
            <Fragment key={index}>
              <input
                ref={index === activeOtpIndex ? inputRef : null}
                onChange={handleOnchange}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
                className={`w-[54px] aspect-square block appearance-none text-center otp-field`}
                type="number"
                name="otp"
                value={tempOtp[index]}
                min={1}
              // required
              />
            </Fragment>
          );
        })}
      </div>
      {actionData?.formErrors?.otp ? (
        <p className="pt-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{actionData?.formErrors?.otp}</span>
        </p>
      ) : null}
      <Button size="small" type="submit">
        Create Account
      </Button>
    </Form>
  );
}

export default OtpVerification;