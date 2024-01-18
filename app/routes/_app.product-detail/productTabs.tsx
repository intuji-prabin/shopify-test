import AlternateProducts from './ProductAlternateProducts';

import PackageContents from './productPackageContents';
import ProductDescripion from './productDescripion';
import ProductDownloads from './productDownloads';
import ProductVideos from './productVideos';
import Specifications from './productSpecifications';
import * as Tabs from '@radix-ui/react-tabs';
import ProductFeatures from './productFeatures';
import ProductFaq from './productfaq';
import AlternativeProduct from './ProductAlternateProducts';

const ProductTab = () => (
  <section className="tab-wrapper bg-white">
    <Tabs.Root className="flex flex-col p-6" defaultValue="tab1">
      <Tabs.List
        className="shrink-0 flex tab-header border-b-grey-50 border-x-0 border-t-0 border-2 justify-between flex-col md:flex-row"
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-lg font-bold leading-[24px] text-mauve11 text-grey-500 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab1"
        >
          <h5 className="cursor-pointer">Description</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-4 py-3  h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab2"
        >
          <h5 className="cursor-pointer">Features</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab3"
        >
          <h5 className="cursor-pointer">Packaged Contents</h5>
        </Tabs.Trigger>{' '}
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab4"
        >
          <h5 className="cursor-pointer">Specifications</h5>
        </Tabs.Trigger>{' '}
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab5"
        >
          <h5 className="cursor-pointer">Downloads</h5>
        </Tabs.Trigger>{' '}
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab6"
        >
          <h5 className="cursor-pointer">Videos </h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab7"
        >
          <h5 className="cursor-pointer">FAQ </h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab8"
        >
          <h5 className="cursor-pointer">Alternate Products </h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab9"
        >
          <h5 className="cursor-pointer">Brochure </h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default"
          value="tab10"
        >
          <h5 className="cursor-pointer">Operating Manual</h5>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none "
        value="tab1"
      >
        <ProductDescripion />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab2"
      >
        <ProductFeatures />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab3"
      >
        <PackageContents />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab4"
      >
        <Specifications />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab5"
      >
        <ProductDownloads />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab6"
      >
        <ProductVideos />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab7"
      >
        <ProductFaq />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab8"
      >
        <AlternativeProduct />
      </Tabs.Content>
    </Tabs.Root>
  </section>
);

export default ProductTab;
