import * as React from 'react';
import {ChevronsUpDown} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover';
import {Button} from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import {z} from 'zod';

const CreateGroupSchema = z.object({
  group: z.string().trim().max(50, {message: 'Group Name is too long'}),
});

interface ComboboxProps {
  error: {
    isError: boolean;
    message: string;
  };
  setError: React.Dispatch<
    React.SetStateAction<{
      isError: boolean;
      message: string;
    }>
  >;
  selectedValue: string | null;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | null>>;
  options: {value: string; label: string}[];
}
export function CreateableSelectInput({
  options,
  error,
  setError,
  selectedValue,
  setSelectedValue,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState('');

  const isFound = options.find((option) => option.value === selectedValue);

  const buttonLabel =
    isFound?.label ||
    (selectedValue && selectedValue.trim().length > 0
      ? selectedValue
      : 'Select a Group');

  const handleInputChange = (search: string) => {
    const result = CreateGroupSchema.safeParse({
      group: search,
    });
    if (!result.success) {
      setError({
        isError: true,
        message: result.error.errors[0].message,
      });
      setOpen(false);
      return;
    }
    setSearch(search);
    setError({isError: false, message: ''});
  };

  React.useEffect(() => {
    if (open) {
      setSearch('');
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="input"
          role="combobox"
          aria-expanded={open}
          className={`${error.isError ? '!border-semantic-danger-500' : ''}
          justify-between px-3 font-medium w-full focus:outline-none capitalize
          `}
        >
          {buttonLabel}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[26rem] rounded-none">
        <Command>
          <CommandInput
            className="border-grey-100 w-full px-0 border-0 active:!border-grey-100 focus:!border-grey-100 hover:!border-grey-100 focu:bg-white active:bg-white hover:bg-white !bg-white placeholder:text-grey-500"
            value={search}
            onValueChange={handleInputChange}
            placeholder="Search group..."
          />
          <CommandEmpty className="p-3">
            <Button
              variant="primary"
              className="w-full"
              disabled={error.isError}
              onClick={() => {
                setSelectedValue(search);
                setOpen(false);
              }}
            >
              Create a New Group
            </Button>
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  className="capitalize"
                  value={option.value}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    setSelectedValue(currentValue);
                    setError({isError: false, message: ''});
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
