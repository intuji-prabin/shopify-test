import {format} from 'date-fns';
import {cn} from '~/lib/utils/utils';
import {Button} from '~/components/ui/button';
import {Calendar} from '~/components/ui/calendar';
import {DangerAlert} from '~/components/icons/alert';
import {CalendarIcon} from '~/components/icons/calendar-icon';
import {useControlField, useField} from 'remix-validated-form';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover';
import {TicketsFilterFormFieldNameType} from '~/routes/_app.support_.tickets/filter-form';
import {CreateTicketFormFieldNameType} from '~/routes/_app.support_.create-ticket/create-ticket-form';

type DatePickerInputProps = {
  disablePreviousDates?: boolean;
  name: CreateTicketFormFieldNameType | TicketsFilterFormFieldNameType;
};

export function DatePickerInput({
  name,
  disablePreviousDates = false,
}: DatePickerInputProps) {
  const {getInputProps, validate, error} = useField(name);

  const [date, setDate] = useControlField<Date | undefined>(name);

  return (
    <Popover>
      <input
        {...getInputProps({id: name})}
        type="hidden"
        value={date?.toISOString() || ''}
      />
      <PopoverTrigger asChild>
        <Button
          variant="input"
          size="medium"
          className={cn(
            `w-full justify-between text-left text-base font-normal text-grey-400 ${
              error ? 'border-semantic-danger-500' : 'border-grey-300'
            }`,
            !date && 'text-muted-foreground',
          )}
        >
          {date ? (
            format(date, 'dd/MM/yyyy')
          ) : (
            <span className="capitalize text-grey-400">Pick a date</span>
          )}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          disabled={disablePreviousDates ? {before: new Date()} : undefined}
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            validate();
          }}
          initialFocus
        />
      </PopoverContent>
      {error && (
        <p className="pt-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{error}</span>
        </p>
      )}
    </Popover>
  );
}
