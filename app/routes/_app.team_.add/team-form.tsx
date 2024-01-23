import {withZod} from '@remix-validated-form/with-zod';
import {ValidatedForm} from 'remix-validated-form';
import {z} from 'zod';
import {EyeIcon} from '~/components/icons/eye';
import SelectInput, {SelectInputType} from '~/components/ui/select-input';
import {Input} from '~/components/ui/input';
import {Separator} from '~/components/ui/separator';
import {zfd} from 'zod-form-data';
import ImageUploadInput from '~/components/ui/image-upload-input';
import {Button} from '~/components/ui/button';

const AustralianPhoneNumberValidationRegex =
  /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

type TeamFormProps = {
  defaultValues?: Omit<TeamFormType, 'profileImage'> & {
    profileImageUrl: string;
  };
  options: SelectInputType[];
};

// const options: SelectInputType[] = [
//   {label: 'Marketing', value: 'marketing'},
//   {label: 'Sales', value: 'sales'},
//   {label: 'Accountant', value: 'accountant'},
// ];

const TeamFormSchema = z.object({
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
    .toLowerCase(),
  phoneNumber: z
    .string()
    .min(1, {message: 'Phone Number is required'})
    .trim()
    .refine(
      (value) => AustralianPhoneNumberValidationRegex.test(value),
      'Invalid Phone Number',
    ),
  address: z.string().min(1, {message: 'Address is required'}).trim(),
  userRole: z.string().min(1, {message: 'User Role is required'}).trim(),
  // password: z.string().min(1, {message: 'Password is required'}).trim(),
  // confirmPassword: z
  //   .string()
  //   .min(1, {message: 'Confirm password is required'})
  //   .trim(),
});
// .refine(({password, confirmPassword}) => password === confirmPassword, {
//   path: ['confirmPassword'],
//   message: "Password don't match",
// });

export const TeamFormSchemaValidator = withZod(TeamFormSchema);

export type TeamFormType = z.infer<typeof TeamFormSchema>;

export type TeamFormFieldNameType = keyof TeamFormType;

export default function TeamForm({defaultValues, options}: TeamFormProps) {
  return (
    <ValidatedForm
      method="post"
      validator={TeamFormSchemaValidator}
      encType="multipart/form-data"
      defaultValues={defaultValues}
      className="bg-neutral-white p-6"
    >
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h5>Basic Information</h5>
          <p>View and change the user information</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploadInput
              name="profileImage"
              imageUrl={defaultValues?.profileImageUrl}
            />
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
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h5>User Roles</h5>
          <p>Set the user roles, change teams</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <SelectInput
              name="userRole"
              options={options}
              label="Select Roles"
            />
            <div></div>
          </div>
        </div>
      </div>
      {/* <Separator className="my-8" />
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h5>Passwords</h5>
          <p>Change the password of the users</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              required
              type="password"
              icon={<EyeIcon />}
              name="password"
              label=" New Password"
              placeholder="new password"
            />
            <Input
              required
              type="password"
              icon={<EyeIcon />}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="re-enter password"
            />
          </div>
        </div>
      </div> */}
      <Button type="submit" size="small" variant="primary">
        Submit
      </Button>
    </ValidatedForm>
  );
}
