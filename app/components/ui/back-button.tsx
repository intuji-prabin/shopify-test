import {useNavigate} from '@remix-run/react';
import {Button} from '~/components/ui/button';
import {ArrowLeft} from 'lucide-react';

export function BackButton({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center space-x-4">
      <Button
        type="button"
        size="icon"
        data-cy="back-button"
        variant="ghost"
        className="border-grey-50 group group-hover:bg-inherit hover:border-primary-500 duration-300"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="text-grey-400 group-hover:text-primary-500" />
      </Button>
      <h3 className={className}>{title}</h3>
    </div>
  );
}
