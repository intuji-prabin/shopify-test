import { useNavigate } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center space-x-4">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="border-grey-50 hover:bg-inherit"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="text-grey-400" />
      </Button>
      <h3 className='uppercase'>{title}</h3>
    </div>
  );
}
