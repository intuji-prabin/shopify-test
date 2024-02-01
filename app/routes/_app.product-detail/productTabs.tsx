import PackageContents from './productPackageContents';
import ProductDescripion from './productDescripion';
import ProductDownloads from './productDownloads';
import ProductVideos from './productVideos';
import Specifications from './productSpecifications';
import * as Tabs from '@radix-ui/react-tabs';
import ProductFeatures from './productFeatures';
import ProductFaq from './productFaq';
import AlternativeProduct from './ProductAlternateProducts';

const ProductTab = () => (
  <section className="tab-wrapper bg-white">
    <Tabs.Root className="flex flex-col p-6" defaultValue="tab1">
      {/* Tab list header starts here */}
      <Tabs.List
        className="shrink-0 flex tab-header border-b-grey-50 border-x-0 border-t-0 border-2 justify-between flex-col flex-wrap lg:flex-row"
        aria-label="Manage your account"
      >
        {[
          'Description',
          'Features',
          'Packaged Contents',
          'Specifications',
          'Downloads',
          'Videos',
          'FAQ',
          'Alternate Products',
          'Brochure',
          'Operating Manual',
        ].map((tabValue, index) => (
          <Tabs.Trigger
            key={`tab${index + 1}`}
            className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
            value={`tab${index + 1}`}
          >
            <h5 className="cursor-pointer">{tabValue}</h5>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none "
        value="tab1"
      >
        <ProductDescripion
          productImageUrl={'cigweld100yr.png'}
          productDescLogo={'productDesc.png'}
          descriptionHeading={'PRODUCT DESCRIPTION'}
        />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab2"
      >
        <ProductFeatures featureHeading={'Features'} />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab3"
      >
        <PackageContents
          mainTitle={'Optional Extras'}
          packageTitleFirst={'PLASMA ACCESSORIES'}
          packageTitleSecond={'SAFETY EQUIPMENT'}
          tableTitle={'option'}
        />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab4"
      >
        <Specifications mainTitle={'PRODUCT SPECIFICATIONS'} />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab5"
      >
        <ProductDownloads
          mainTitle={'FILES FOR DOWNLOADS'}
          download={'downloadFiles.png'}
          btnTitle={'Download'}
        />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab6"
      >
        <ProductVideos mainTitle={'Videos'} />
      </Tabs.Content>
      <Tabs.Content
        className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
        value="tab7"
      >
        <ProductFaq mainTitle={' FREQUENTLY ASKED QUESTIONS'} />
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
