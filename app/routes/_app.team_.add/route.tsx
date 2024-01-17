import {useActionData, useNavigate} from '@remix-run/react';
import {Separator} from '~/components/ui/separator';
import {validationError} from 'remix-validated-form';
import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import TeamForm, {
  TeamFormSchemaValidator,
} from '~/routes/_app.team_.add/team-form';
import {BackButton} from '~/components/ui/back-button';

export async function action({request}: ActionFunctionArgs) {
  const result = await TeamFormSchemaValidator.validate(
    await request.formData(),
  );
  console.log('result', result);

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

export default function AddTeam() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  console.log(actionData);
  return (
    <section className="container">
      <div className=" pt-6 pb-4">
        <BackButton title="Add Team Memeber" />
        <Separator className="mt-4 mb-8" />
      </div>
      <TeamForm />
    </section>
  );
}
