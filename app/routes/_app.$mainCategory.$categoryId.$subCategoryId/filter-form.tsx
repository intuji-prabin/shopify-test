import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import { FormEvent, Fragment, useState } from 'react';
import AccordionCustom from '~/components/ui/accordionCustom';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Slider } from '~/components/ui/slider';

export function FilterForm(filterList: any) {
  const { filterdata } = filterList;
  const initialRange = [3, 100];
  const [range, setRange] = useState(initialRange);

  const handleRangeChange = (newValues: number[]) => {
    setRange(newValues);
  };
  const warrantyFilter = filterdata.filter(
    (item) => item.filterKey === 'warranty',
  );
  const otherFilters = filterdata.filter(
    (item) => item.filterKey !== 'warranty',
  );

  const [openAccordian, setOpenAccordian] = useState<any>("");

  return (
    <Form method="get">
      <div className='flex items-end gap-2 px-4 py-5 border-b border-solid border-grey-50'>
        <h4 className='leading-none'>
          All Filters
        </h4>
        <div className='text-xs lg:text-sm !leading-none italic font-bold cursor-pointer text-primary-500 border-b border-solid !border-primary-500' onClick={() => {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          window.location.reload();
        }}>
          CLEAR FILTER
        </div>
      </div>
      <div className='px-4 pb-4'>
        {
          otherFilters?.map((form: any, index: any) => (
            <Fragment key={index}>
              <AccordionCustom accordianLabel={form.filterLabel} setOpenAccordian={setOpenAccordian} isOpen={openAccordian === form.filterLabel} accordionTitle={form.filterLabel}>
                {form?.filterValue?.map((input: any, index: any) => {
                  return (
                    <div key={index} className="flex items-center py-2 gap-x-2">
                      <input
                        type="checkbox"
                        id={input}
                        name={form?.filterKey}
                        value={input}
                      />
                      <label
                        htmlFor={input}
                        className="text-lg not-italic font-medium text-grey-700"
                      >
                        {input}
                      </label>
                    </div>
                  );
                })}
              </AccordionCustom>
            </Fragment>
          ))
        }
        <div className="py-4">
          <h5>Warranty</h5>
          <div className="flex flex-wrap gap-1">
            {warrantyFilter.map((radio: any) =>
              radio?.filterValue.map((value: any, index: any) => {
                return (
                  <Fragment key={index}>
                    <input
                      type="radio"
                      id={value}
                      className="hidden"
                      value={value}
                      name={radio?.filterKey}
                    />
                    <label
                      htmlFor={value}
                      className="p-2 mt-2 text-sm not-italic font-medium leading-4 duration-200 border border-solid cursor-pointer border-grey-50 text-grey-700 hover:border-transparent hover:bg-primary-400 peer-checked:bg-primary-400"
                    >
                      {value}
                    </label>
                  </Fragment>
                );
              }),
            )}
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
        <Button type="submit" className="absolute p-0 text-xs italic font-bold !leading-none bg-transparent border-b border-solid lg:text-sm top-6 lg:top-7 right-4 text-grey-500 border-grey-500 hover:bg-transparent">
          APPLY FILTER
        </Button>
      </div>
    </Form >
  );
}

export function SortByFilterForm() {
  const submit = useSubmit();
  const [queryParams] = useSearchParams();
  return (
    <Form
      method="get"
      onChange={(event: FormEvent<HTMLFormElement>) => {
        submit(event.currentTarget);
      }}
      className="flex items-center space-x-2"
    >
      <label htmlFor="sort-by" className="text-base font-medium text-grey-400">
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
  );
}
