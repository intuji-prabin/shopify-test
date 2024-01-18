import {FormEvent} from 'react';
import {Form, useSearchParams, useSubmit} from '@remix-run/react';
import {SearchIcon} from 'lucide-react';
import {debounce} from '~/lib/helpers/general.helper';

export function SearchInput() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const debounceSubmit = debounce((form: any) => submit(form), 300);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) =>
    debounceSubmit(event.currentTarget);

  return (
    <Form method="get" onChange={handleSubmit}>
      <div className="relative">
        <input
          type="search"
          name="search"
          placeholder="Search"
          className="w-full"
          defaultValue={searchParams.get('search') || ''}
        />
        <span className="absolute right-0 inset-y-0 p-2.5 pt-1.5 bg-primary-500">
          <SearchIcon className="text-neutral-white" />
        </span>
      </div>
    </Form>
  );
}
