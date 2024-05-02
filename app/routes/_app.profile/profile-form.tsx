
import {z} from 'zod';
import {useState} from 'react';
import {zfd} from 'zod-form-data';
import {Input} from '~/components/ui/input';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import {withZod} from '@remix-validated-form/with-zod';
import ImageUploadInput from '~/components/ui/image-upload-input';
import ValidatedFormPassword from '~/components/ui/validated-form-password';
import SelectInput, {SelectInputOptions} from '~/components/ui/select-input';
import {
  AUSTRALIAN_PHONENUMBER_VALIDATION_REGEX,
  PASSWORD_REGEX,
} from '~/lib/constants/regex.constant';
import {
  ValidatedForm,
  useFormContext,
  useIsSubmitting,
} from 'remix-validated-form';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE_MB,
} from '~/lib/constants/form.constant';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';

type ProfileFormProps = {
  defaultValues?: Omit<
    ProfileFormType,
    | 'profileImage'
    | 'oldPassword'
    | 'password'
    | 'confirmPassword'
    | 'customerId'
  > & {
    profileImageUrl: string;
  };
  customerId: string;
  options: SelectInputOptions[];
};

export const ProfileFormSchema = z
  .object({
    profileImage: zfd.file(
      z
        .custom<File | undefined>()
        .refine((file) => {
          if (file instanceof File) {
            return ACCEPTED_IMAGE_TYPES.includes(file.type);
          }
          return true;
        }, 'Please choose .jpg, .jpeg, .png, and .webp files.')
        .refine((file) => {
          if (file instanceof File) {
            return file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
          }
          // No file provided, so consider it valid
          return true;
        }, 'Max file size is 15MB.'),
    ),
    fullName: z.string().trim().min(1, {message: 'Full Name is required'}),
    email: z
      .string()
      .min(1, {message: 'Email is required'})
      .email()
      .trim()
      .toLowerCase()
      .optional(),
    phoneNumber: z
      .string()
      .min(1, {message: 'Phone Number is required'})
      .trim()
      .refine(
        (value) => AUSTRALIAN_PHONENUMBER_VALIDATION_REGEX.test(value),
        'Invalid Phone Number',
      ),
    address: z.string().min(1, {message: 'Address is required'}).trim(),
    userRole: z
      .string()
      .min(1, {message: 'User Role is required'})
      .trim()
      .optional(),
    customerId: z.string().optional(),
    oldPassword: z.string().trim().optional(),
    password: z
      .string()
      .trim()
      .optional()
      .refine((value) => {
        if (typeof value === 'undefined' || value === '') return true;
        return PASSWORD_REGEX.test(value);
      }, 'Password must be at least 8 characters, one capital letter, one number, and one special character'),
    confirmPassword: z.string().trim().optional(),
  })
  .refine(({oldPassword, password}) => !(oldPassword && !password), {
    path: ['password'],
    message: 'New password is required',
  })
  .refine(({oldPassword, password}) => !(!oldPassword && password), {
    path: ['oldPassword'],
    message: 'Old password is required',
  })
  .refine(
    ({oldPassword, password}) =>
      !(oldPassword && password && oldPassword === password),
    {
      path: ['password'],
      message: 'New password cannot be the same as the old password',
    },
  )
  .refine(({password, confirmPassword}) => password == confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match",
  });

export const ProfileFormSchemaValidator = withZod(ProfileFormSchema);

export type ProfileFormType = z.infer<typeof ProfileFormSchema>;

export type ProfileFormFieldNameType = keyof ProfileFormType;

export default function ProfileForm({
  options,
  customerId,
  defaultValues,
}: ProfileFormProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const formId = 'profile-form';

  const {reset} = useFormContext(formId);

  const isSubmitting = useIsSubmitting(formId);

  const imageUrl = defaultValues?.profileImageUrl
    ? defaultValues.profileImageUrl
    : DEFAULT_IMAGE.DEFAULT;

  return (
    <ValidatedForm
      method="POST"
      encType="multipart/form-data"
      id={formId}
      className="bg-neutral-white p-6"
      defaultValues={defaultValues}
      validator={ProfileFormSchemaValidator}
      onChange={() => setHasUnsavedChanges(true)}
    >
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h4>Basic Information</h4>
          <p>View and change the user information</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploadInput name="profileImage" imageUrl={imageUrl} />
            <div className="hidden md:block"></div>
            <Input
              required
              type="text"
              name="fullName"
              label="Full Name"
              placeholder="member full name"
            />
            <Input
              required
              disabled
              type="email"
              name="email"
              label="Email"
              placeholder="email address"
            />
            <Input
              required
              type="text"
              name="phoneNumber"
              label="Phone Number"
              placeholder="phone number"
            />
            <Input
              required
              name="address"
              label="Address"
              placeholder="address"
            />
            <Input type="hidden" name="customerId" value={customerId} />
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h4>User Roles</h4>
          <p>Set the user roles, change Profiles</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="userRole" className="text-grey-200">
                Role <span className="required ">*</span>
              </label>
              <SelectInput
                name="userRole"
                options={options}
                isDisabled={true}
                label="Select Roles"
              />
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h4>Passwords</h4>
          <p>Change the password of the users</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <ValidatedFormPassword
              name="oldPassword"
              placeholder="old password"
              label="Old Password"
              required={false}
            />
            <div></div>
            <ValidatedFormPassword
              name="password"
              placeholder="new password"
              label="New Password"
              required={false}
            />
            <ValidatedFormPassword
              name="confirmPassword"
              placeholder="confirm password"
              label="Confirm Password"
              required={false}
            />
          </div>
        </div>
      </div>
      {hasUnsavedChanges && (
        <div className="fixed inset-x-0 bottom-0 z-40 py-4 bg-primary-500">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-white">Unsaved changes</h4>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-white border-white"
                  onClick={() => {
                    reset();
                    setHasUnsavedChanges(false);
                  }}
                >
                  discard
                </Button>
                <Button
                  type="submit"
                  variant={isSubmitting ? 'disabled' : 'secondary'}
                  disabled={isSubmitting}
                >
                  save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ValidatedForm>
  );
}
