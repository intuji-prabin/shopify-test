import * as React from 'react';
import {ChevronsUpDown} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from './popover';
import {Button} from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

export function ComboboxDemo({
  options,
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string | null;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | null>>;
  options: {value: string; label: string}[];
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const isFound = options.find((option) => option.value === selectedValue);

  const placeHolderValue = isFound?.label || selectedValue;

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
          className="justify-between px-3 font-medium normal-case"
        >
          {placeHolderValue ?? 'Select a Group'}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[26rem] rounded-none">
        <Command>
          <CommandInput
            className="w-full px-0 border-0 border-grey-100 active:!border-grey-100 focus:!border-grey-100 hover:!border-grey-100 focu:bg-white active:bg-white hover:bg-white !bg-white placeholder:text-grey-500"
            value={search}
            onValueChange={setSearch}
            placeholder="Search group..."
          />
          <CommandEmpty className="p-3">
            <Button
              variant="primary"
              className="w-full"
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
                  value={option.value}
                  onSelect={(currentValue) => {
                    setSelectedValue(currentValue);
                    setOpen(false);
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
