import {useActionData, useLoaderData, useNavigate} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import {ArrowLeft} from 'lucide-react';
import {validationError} from 'remix-validated-form';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import TeamForm, {
  TeamFormSchemaValidator,
  TeamFormType,
} from '~/routes/_app.team_.add/team-form';

export async function loader({request, params}: LoaderFunctionArgs) {
  /**
   * @description dummy data
   */
  const results: Omit<TeamFormType, 'profileImage'> & {
    profileImageUrl: string;
  } = {
    fullName: 'John Doe',
    email: 'johndoe@gmail.com',
    phoneNumber: '+61234567832',
    address: 'Sydney',
    userRole: 'sales',
    password: 'doe123',
    confirmPassword: 'doe123',
    profileImageUrl:
      'https://cdn.shopify.com/s/files/1/0760/8549/4046/files/next_js.png?v=1700798732',
  };
  return json({results});
}
export async function action({request}: ActionFunctionArgs) {
  const result = await TeamFormSchemaValidator.validate(
    await request.formData(),
  );

  if (result.error) {
    return validationError(result.error);
  }
  const formData = new FormData();
  formData.append('file', result.submittedData.profileImage);

  console.log('File details:', {
    name: result.submittedData.profileImage.name,
    size: result.submittedData.profileImage.size,
    type: result.submittedData.profileImage.type,
  });

  return json({data: result});
}
export default function TeamDetailsPage() {
  const navigate = useNavigate();
  const {results} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log('results', actionData);

  return (
    <section className="container">
      <div className="flex items-center space-x-4 pt-6 pb-4">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="border-grey-50 hover:bg-inherit"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-grey-400" />
        </Button>
        <h3>Edit Details</h3>
      </div>
      <Separator className="mt-4 mb-8" />
      <TeamForm defaultValues={results} />
    </section>
  );
}
