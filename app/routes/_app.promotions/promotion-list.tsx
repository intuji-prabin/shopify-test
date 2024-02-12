import * as Tabs from '@radix-ui/react-tabs';
import React, {useState} from 'react';
import {Button} from '~/components/ui/button';
import PromotionCard from './promotion-card';
import {Form} from '@remix-run/react';
import {Upload} from 'lucide-react';

export interface PromotionDataType {
  promotions: PromotionType[];
  myPromotions: PromotionType[];
}

export interface PromotionType {
  id: number;
  title: string;
  image_url: string;
}

const filterOptions = [
  {label: 'Newest To Oldest', value: 'Newest To Oldest'},
  {label: 'Oldest To Newest', value: 'Oldest To Newest'},
];

const PromotionList = ({promotionData}: {promotionData: PromotionDataType}) => {
  const [checkedCount, setCheckedCount] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  // const handleCheckboxChange = (event: React.FormEvent<HTMLFormElement>) => {
  //   const target = event.target as HTMLInputElement;
  //   const isChecked = target.checked;
  //   setCheckedCount((prevCount) => (isChecked ? prevCount + 1 : prevCount - 1));
  // };

  const handleCheckboxChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const imageURL = target.getAttribute('data-attribute');

    if (isChecked) {
      setSelectedImages(
        (prevSelected) => [...prevSelected, imageURL] as string[],
      );
      setCheckedCount((prevCount) => prevCount + 1);
    } else {
      setSelectedImages((prevSelected) =>
        prevSelected.filter((url) => url !== imageURL),
      );
      setCheckedCount((prevCount) => prevCount - 1);
    }
  };
  console.log(selectedImages);

  const handleExportImages = () => {
    // Create a function to download images based on selectedImages array
    selectedImages.forEach((imageUrl) => {
      // Here you can initiate the download process for each imageUrl
      // For example, you can use an anchor element with download attribute
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'image.jpg';
      link.click();
    });
  };

  const handleOnchange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    console.log('Selected Date:', selectedValue);
  };

  const promotionList = promotionData.promotions;
  const myPromotionList = promotionData.myPromotions;

  return (
    <div className="p-6 bg-white">
      <Tabs.Root defaultValue="tab1">
        <div className="flex flex-col lg:flex-row gap-x-6 gap-y-4">
          <Tabs.List
            className="flex flex-col flex-wrap flex-grow border-2 border-t-0 shrink-0 tab-header border-b-grey-50 border-x-0 lg:flex-row"
            aria-label="Manage your account"
          >
            <Tabs.Trigger
              className="bg-white px-4 py-2 flex items-left text-grey-500 font-normal select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 data-[state=active]:border-primary-500 outline-none cursor-pointer not-italic justify-center lg:justify-start"
              value="tab1"
            >
              Available Promotions
            </Tabs.Trigger>
            <Tabs.Trigger
              className="bg-white px-4 py-2 flex items-left text-grey-500 font-normal select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 data-[state=active]:border-primary-500 outline-none cursor-pointer not-italic justify-center lg:justify-start"
              value="tab2"
            >
              My Promotions
            </Tabs.Trigger>
          </Tabs.List>
          <div>
            <select
              name="filter"
              onChange={handleOnchange}
              className="w-full !border-grey-100 filter-select"
            >
              {filterOptions.map((filter, index) => (
                <option value={filter.value} key={index + 'filter'}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Tabs.Content className="pt-6" value="tab1">
          <div className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25">
            {promotionList.map((promotion: PromotionType) => (
              <div key={promotion.id}>
                <PromotionCard
                  title={promotion.title}
                  imageURL={promotion.image_url}
                  id={promotion.id}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-6">
            <Button
              type="button"
              variant="primary"
              size="large"
              className="min-w-64"
            >
              Load More
            </Button>
          </div>
        </Tabs.Content>
        <Tabs.Content className="pt-6" value="tab2">
          <Form method="POST" onChange={handleCheckboxChange}>
            <div className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25">
              {myPromotionList.map((promotion: PromotionType) => (
                <div key={promotion.id} className="relative">
                  <PromotionCard
                    title={promotion.title}
                    imageURL={promotion.image_url}
                    id={promotion.id}
                    myPromotion={true}
                  />
                  <input
                    type="checkbox"
                    className="!absolute top-2 right-2 bg-white !rounded-none"
                    name={promotion.title}
                    value={promotion.id}
                  />
                  <input
                    type="hidden"
                    value={promotion.image_url}
                    data-attribute={promotion.image_url}
                  />
                </div>
              ))}
              {checkedCount > 0 && (
                <div className="absolute top-0 right-0">
                  <div className="flex items-center gap-x-2">
                    <p className="font-bold text-lg leading-5.5 italic">
                      {checkedCount} items selected
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      className="text-neutral-white"
                    >
                      <Upload className="h-5 w-5" /> Export
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      name="_action"
                      value="delete"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
              {/* <input
                type="submit"
                name="_action"
                value="Delete"
                className="absolute top-0 right-0"
              /> */}
            </div>
          </Form>
          <div className="flex justify-center pt-6">
            <Button
              type="button"
              variant="primary"
              size="large"
              className="min-w-64"
            >
              Load More
            </Button>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default PromotionList;
