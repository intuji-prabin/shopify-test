import {useNavigate} from '@remix-run/react';
import {ArrowLeft} from 'lucide-react';
import {Button} from '~/components/ui/button';
import {RouteError} from '~/components/ui/route-error';

export function EditTeamError({errorMessage}: {errorMessage?: string}) {
  const navigate = useNavigate();

  return (
    <section className="container">
      <div className="flex items-center py-6 space-x-4">
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
      <RouteError errorMessage={errorMessage} />
    </section>
  );
}
