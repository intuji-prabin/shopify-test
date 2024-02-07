import {withZod} from '@remix-validated-form/with-zod';
import {useState} from 'react';
import {
  ValidatedForm,
  useFormContext,
  useIsSubmitting,
} from 'remix-validated-form';
import {z} from 'zod';
import {zfd} from 'zod-form-data';
import {Button} from '~/components/ui/button';
import ImageUploadInput from '~/components/ui/image-upload-input';
import {Input} from '~/components/ui/input';
import SelectInput, {SelectInputOptions} from '~/components/ui/select-input';
import {Separator} from '~/components/ui/separator';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE_MB,
} from '~/lib/constants/form.constant';
import {AustralianPhoneNumberValidationRegex} from '~/lib/constants/regex.constant';

type TeamFormProps = {
  defaultValues?: Omit<AddTeamFormType, 'profileImage'> & {
    profileImageUrl: string;
  };
  options: SelectInputOptions[];
  companyId?: string;
};

const EditTeamFormSchema = z.object({
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
  customerId: z.string(),
});
const AddTeamFormSchema = EditTeamFormSchema.omit({customerId: true}).extend({
  customerID: z.string().optional(),
});

export const EditTeamFormSchemaValidator = withZod(EditTeamFormSchema);
export const AddTeamFormSchemaValidator = withZod(AddTeamFormSchema);

export type EditTeamFormType = z.infer<typeof EditTeamFormSchema>;
export type AddTeamFormType = z.infer<typeof AddTeamFormSchema>;

export type EditTeamFormFieldNameType = keyof EditTeamFormType;
export type AddTeamFormFieldNameType = keyof AddTeamFormType;

export default function TeamForm({
  defaultValues,
  options,
  companyId,
}: TeamFormProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const {reset} = useFormContext('team-form');

  const updatePermissions = (value: string) => {
    setSelectedRole(value);
  };

  const roles = options?.find(
    (option) => option.value === selectedRole,
  )?.permissions;

  const isSubmitting = useIsSubmitting('team-form');

  return (
    <ValidatedForm
      method="post"
      encType="multipart/form-data"
      id="team-form"
      className="relative p-6 bg-neutral-white"
      defaultValues={defaultValues}
      validator={AddTeamFormSchemaValidator}
      onChange={() => setHasUnsavedChanges(true)}
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h5>Basic Information</h5>
          <p>View and change the user information</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <ImageUploadInput
              name="profileImage"
              imageUrl={defaultValues?.profileImageUrl}
            />
            <div className="hidden lg:block"></div>
            <Input
              required
              type="text"
              name="fullName"
              label="Full Name"
              placeholder="full name"
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
            <Input type="hidden" name="customerId" value={companyId} />
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-start-1 sm:col-end-2">
          <h5>User Roles</h5>
          <p>Set the user roles, change teams</p>
        </div>
        <div className="sm:col-start-2 sm:col-end-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="">
              <label htmlFor="userRole">
                Role <span className="required">*</span>
              </label>
              <SelectInput
                name="userRole"
                options={options}
                label="select roles"
                updatePermissions={(value: string) => updatePermissions(value)}
              />
            </div>
            {selectedRole && (
              <div className="p-6 bg-primary-50">
                <h4 className="pb-4 capitalize">
                  {selectedRole} role permissions
                </h4>
                <ul className="pl-5">
                  {roles?.map((role) => (
                    <li
                      key={role.id}
                      className="text-base font-normal list-disc text-grey-700"
                    >
                      {role.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {hasUnsavedChanges && (
        <div className="fixed inset-x-0 bottom-0 py-4 bg-grey-900">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h5 className="text-white">Unsaved changes</h5>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary-500"
                  onClick={() => {
                    reset();
                    setHasUnsavedChanges(false);
                  }}
                >
                  discard
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
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
