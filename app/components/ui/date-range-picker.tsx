import * as React from 'react';
import {format} from 'date-fns';
import {cn} from '~/lib/utils/utils';
import {DateRange} from 'react-day-picker';
import {Button} from '~/components/ui/button';
import {Calendar} from '~/components/ui/calendar';
import {CalendarIcon} from '~/components/icons/calendar-icon';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover';

export function DatePickerWithRange({
  className,
  dateRange,
}: React.HTMLAttributes<HTMLDivElement> & {dateRange?: DateRange}) {
  const [date, setDate] = React.useState<DateRange | undefined>(dateRange);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <input
          type="hidden"
          name="createdDateFrom"
          value={date?.from ? format(new Date(date.from), 'yyyy-MM-dd') : ''}
        />
        <input
          type="hidden"
          name="createdDateTo"
          value={date?.to ? format(new Date(date.to), 'yyyy-MM-dd') : ''}
        />
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="input"
            className={cn(
              'w-full justify-between text-left text-base font-normal text-grey-400 border-grey-300 px-3',
              !date && 'text-muted-foreground',
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(new Date(date.from), 'dd/MM/yyyy')} -{' '}
                  {format(new Date(date.to), 'dd/MM/yyyy')}
                </>
              ) : (
                format(new Date(date.from), 'dd/MM/yyyy')
              )
            ) : (
              <span>Pick a date range</span>
            )}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="center">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
