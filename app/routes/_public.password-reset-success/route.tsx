import {Link} from '@remix-run/react';
import {Success} from '~/components/icons/success';

const PasswordResetSuccess = () => {
  return (
    <div className="md:w-[398px] w-full min-h-[414px]">
      <div className="flex flex-col p-8 space-y-8 bg-white shadow-3xl">
        <div className="mx-auto">
          <Success />
        </div>
        <div className="flex flex-col items-center justify-center gap-y-5">
          <h4>Password Changed Sucessfully</h4>
          <p>Please log in to your account</p>
          <Link
            to="/login"
            className="flex items-center justify-center w-full gap-2 p-2 px-4 py-3 text-sm leading-4 uppercase duration-150 border-solid cursor-pointer text-neutral-white bg-primary-500 hover:bg-primary-600 disabled:bg-grey-50"
          >
            BACK TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
