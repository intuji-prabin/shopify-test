import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import { FormEvent, Fragment, useState } from 'react';
import AccordionCustom from '~/components/ui/accordionCustom';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Slider } from '~/components/ui/slider';
import { CheckboxInputData, RadioInputData } from './filter-form-data';

export function FilterForm() {
  const initialRange = [3, 100];
  const [range, setRange] = useState(initialRange);

  const handleRangeChange = (newValues: number[]) => {
    setRange(newValues);
  };

  return (
    <>
      <h4 className="py-4 text-primary-500">All Filters</h4>
      <Separator />
      <Form method="get">
        {CheckboxInputData.map((form, index) => (
          <Fragment key={index}>
            <AccordionCustom accordionTitle={form.title}>
              {form.input.map((input, index) => (
                <div key={index} className="flex items-center py-2 gap-x-2">
                  <input
                    type="checkbox"
                    id={input.value}
                    name={input.name}
                    value={input.value}
                  />
                  <label
                    htmlFor={input.label}
                    className="text-lg not-italic font-medium text-grey-700"
                  >
                    {input.label}
                  </label>
                </div>
              ))}
            </AccordionCustom>
          </Fragment>
        ))}
        <div className="py-4">
          <h5>Warranty</h5>
          <div className="flex flex-wrap gap-1">
            {RadioInputData.map((radio, index) => (
              <Fragment key={index}>
                <input
                  type="radio"
                  id={radio.value}
                  className="hidden"
                  value={radio.value}
                  name={radio.name}
                />
                <label
                  htmlFor={radio.value}
                  className="p-2 mt-2 text-sm not-italic font-medium leading-4 duration-200 border border-solid cursor-pointer border-grey-50 text-grey-700 hover:border-transparent hover:bg-primary-400 peer-checked:bg-primary-400"
                >
                  {radio.label}
                </label>
              </Fragment>
            ))}
          </div>
        </div>
        <Separator />
        <div className="py-4">
          <h5 className="mb-16">Price</h5>
          <Slider
            minStepsBetweenThumbs={2}
            max={initialRange[1]}
            min={initialRange[0]}
            step={1}
            value={range}
            onValueChange={handleRangeChange}
            formatLabel={(value) => `$${value}`}
          />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </Form>
    </>
  );
}

export function SortByFilterForm() {
  const submit = useSubmit();
  const [queryParams] = useSearchParams();
  return (
    <div className="flex items-center justify-between">
      <p className="text-lg text-grey-700">
        183 items found for <span className="font-medium">“ Mig Welders ”</span>
      </p>
      <Form
        method="get"
        onChange={(event: FormEvent<HTMLFormElement>) => {
          submit(event.currentTarget);
        }}
        className="flex items-center space-x-2"
      >
        <label
          htmlFor="sort-by"
          className="text-base font-medium text-grey-400"
        >
          Sort by :{' '}
        </label>
        <select
          name="sort-by"
          value={queryParams.get('sort-by') as string}
          onChange={() => { }}
          className="!p-2 !border-grey-50 text-base font-medium bg-transparent text-grey-900"
        >
          <option value="">Sort By</option>
          <option value="quantity-buy-available">Quantity Buy Available</option>
          <option value="quantity-buy-unavailable">
            Quantity Buy UnAvailable
          </option>
        </select>
      </Form>
    </div>
  );
}
