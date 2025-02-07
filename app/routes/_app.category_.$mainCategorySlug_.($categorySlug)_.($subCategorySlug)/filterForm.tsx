import {Form, useNavigate, useSearchParams, useSubmit} from '@remix-run/react';
import {FormEvent, Fragment, useEffect, useState} from 'react';
import AccordionCustom from '~/components/ui/accordionCustom';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import {Slider} from '~/components/ui/slider';

export function FilterForm({
  filterList,
}: {
  filterList: {
    filterLabel: string;
    filterKey: string;
    filterValue: string[];
  }[];
}) {
  const filterdata = filterList;

  const [searchParams] = useSearchParams();
  const searchParam = Object.fromEntries(searchParams);
  const searchKey = Object.keys(searchParam);
  let searchList: {
    key: string;
    value: string[];
  }[] = [];
  searchKey.map((value) => {
    searchList.push({key: value, value: searchParams.getAll(value)});
  });
  const filteredData = searchList.filter((item) => item.key !== 'warranty');
  const filteredValues = filteredData.map((item) => item.value);

  const minPrice =
    Number(searchParams.get('minPrice')) !== 0
      ? Number(searchParams.get('minPrice'))
      : 1;
  const maxPrice =
    Number(searchParams.get('maxPrice')) !== 0
      ? Number(searchParams.get('maxPrice'))
      : 50000;

  const initialRange = [minPrice, maxPrice];
  const [range, setRange] = useState(initialRange);
  const [isMinChecked, setIsMinChecked] = useState(false);
  const [isMaxChecked, setIsMaxChecked] = useState(false);

  const [reset, setReset] = useState(false);

  const [selectedWarrantyValue, setSelectedWarrantyValue] = useState(
    searchParams.get('warranty'),
  );

  const handleRangeChange = (newValues: number[]) => {
    setIsMinChecked(true);
    setIsMaxChecked(true);
    setRange(newValues);
  };
  const warrantyFilter =
    filterdata && filterdata.filter((item) => item.filterKey === 'warranty');
  const otherFilters =
    filterdata && filterdata.filter((item) => item.filterKey !== 'warranty');
  const input = otherFilters.flatMap((filter) => filter.filterValue);

  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>(
    Object.fromEntries(filteredValues.map((value) => [value, true])),
  );
  const handleCheckboxChange = (inputValue: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [inputValue]: !prev[inputValue],
    }));
  };

  const [openAccordian, setOpenAccordian] = useState<any>('');

  const handleWarranty = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWarrantyValue(e.target.value);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (reset) {
      setRange([1, 50000]);
      setSelectedWarrantyValue('');
      setIsMinChecked(false);
      setIsMaxChecked(false);
      setCheckedItems(Object.fromEntries(input.map((value) => [value, false])));
      setReset(false);
    }
  }, [reset]);

  return (
    <>
      {filterdata === undefined ? (
        <div className="p-4">No Filters Available</div>
      ) : (
        <>
          <Form method="get">
            <div className="flex items-end gap-2 px-4 py-5 border-b border-solid border-grey-50">
              <h4 className="leading-none">All Filters</h4>
              <div
                className="text-xs lg:text-sm !leading-none italic font-bold cursor-pointer text-grey-500 border-b border-solid !border-grey-500"
                onClick={() => {
                  navigate(window.location.pathname);
                  setReset(true);
                }}
              >
                CLEAR FILTER
              </div>
            </div>
            <div className="px-4">
              {otherFilters?.map((form, index) => (
                <Fragment key={index}>
                  <AccordionCustom
                    accordianLabel={form.filterLabel}
                    setOpenAccordian={setOpenAccordian}
                    isOpen={openAccordian === form.filterLabel}
                    accordionTitle={form.filterLabel}
                  >
                    {form?.filterValue?.map((input, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center py-2 gap-x-2"
                        >
                          <input
                            type="checkbox"
                            id={input}
                            name={form?.filterKey}
                            value={input}
                            checked={checkedItems[input] || false}
                            onChange={() => handleCheckboxChange(input)}
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
              ))}
              <div className="py-4">
                <h5>Warranty</h5>
                <div className="flex flex-wrap gap-1">
                  {warrantyFilter &&
                    warrantyFilter.map((radio) =>
                      radio?.filterValue.map((value, index: number) => {
                        return (
                          <Fragment key={index}>
                            <input
                              type="radio"
                              id={value}
                              className="hidden"
                              value={value}
                              name={radio?.filterKey}
                              checked={
                                value === selectedWarrantyValue ? true : false
                              }
                              onChange={handleWarranty}
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
              <input
                type="checkbox"
                className="hidden"
                id="minPrice"
                name="minPrice"
                value={range[0]}
                checked={isMinChecked}
                onChange={() => {}}
              />
              <input
                type="checkbox"
                className="hidden"
                id="maxPrice"
                name="maxPrice"
                value={range[1]}
                checked={isMaxChecked}
                onChange={() => {}}
              />

              <Button
                type="submit"
                className="absolute p-0 text-xs italic font-bold !leading-none bg-transparent border-b border-solid lg:text-sm top-6 lg:top-7 right-4 text-primary-500 border-primary-500 hover:bg-transparent"
              >
                APPLY FILTER
              </Button>
            </div>
          </Form>
          <div className="p-4">
            <h5 className="mb-16">Price</h5>
            <Slider
              minStepsBetweenThumbs={2}
              max={50000}
              min={1}
              step={1}
              value={range}
              onValueChange={handleRangeChange}
              formatLabel={(value) => `$${value}`}
              setIsMaxChecked={setIsMaxChecked}
              setIsMinChecked={setIsMinChecked}
              setRange={setRange}
            />
          </div>
        </>
      )}
    </>
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
      <label htmlFor="sort-by" className="pb-0 text-base text-grey-800">
        Sort by :{' '}
      </label>
      <select
        name="sort-by"
        value={queryParams.get('sort-by') as string}
        onChange={() => {}}
        className="!p-2 !border-grey-500 text-base bg-transparent text-grey-800"
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
