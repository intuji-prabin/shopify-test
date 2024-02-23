import {useField} from 'remix-validated-form';
import {ScrollArea} from '~/components/ui/scroll-area';
import {DangerAlert} from '~/components/icons/alert';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  AddTeamFormFieldNameType,
  EditTeamFormFieldNameType,
} from '~/routes/_app.team_.add/team-form';
import {CreateTicketFormFieldNameType} from '~/routes/_app.support_.create-ticket/create-ticket-form';

type SelectInputType = {value: string; title: string};

type PermissionsType = SelectInputType & {id: number};

export type SelectInputOptions = SelectInputType & {
  permissions?: PermissionsType[];
};

export type SelectInputProps = {
  name:
    | AddTeamFormFieldNameType
    | EditTeamFormFieldNameType
    | CreateTicketFormFieldNameType;
  // | OrderFilterFormFieldNameType
  // | TicketsFilterFormFieldNameType;
  label: string;
  isDisabled?: boolean;
  options: SelectInputOptions[];
  updatePermissions?: (value: string) => void;
};

export default function SelectInput({
  name,
  label,
  options,
  isDisabled,
  updatePermissions,
}: SelectInputProps) {
  const {getInputProps, error, clearError} = useField(name);

  return (
    <>
      <div className="relative">
        <Select
          disabled={isDisabled}
          {...getInputProps()}
          onValueChange={(value) => {
            updatePermissions && updatePermissions(value);
            clearError();
          }}
        >
          <SelectTrigger
            className={`${
              error ? 'border-semantic-danger-500' : 'border-grey-300'
            } rounded-none px-3 py-2 not-italic text-base leading-5.5 font-normal text-grey-400 disabled:bg-grey-25 disabled:border-none`}
          >
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent className="rounded-none shadow-base">
            <ScrollArea className="max-h-[238px] w-full p-2">
              <SelectGroup>
                {options?.map((item, index) => (
                  <SelectItem
                    value={item.value}
                    key={index}
                    className="p-2 focus:bg-primary-50"
                  >
                    {item.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
        {!isDisabled && error && (
          <p className="pt-1 error-msg">
            <DangerAlert />
            <span className="pl-2">{error}</span>
          </p>
        )}
      </div>
    </>
  );
}
