import PackageContents from './productPackageContents';
import ProductDescripion from './productDescripion';
import ProductDownloads from './productDownloads';
import ProductVideos from './productVideos';
import Specifications from './productSpecifications';
import * as Tabs from '@radix-ui/react-tabs';
import ProductFeatures from './productFeatures';
import ProductFaq from './productFaq';
import AlternativeProduct from './ProductAlternateProducts';

type ProductTabType = {
  description: string;
}

const ProductTab = ({ description }: ProductTabType) => (
  <section className="bg-white tab-wrapper">
    <Tabs.Root className="flex flex-col p-6" defaultValue="description-tab">
      {/* Tab list header starts here */}
      <Tabs.List
        className="flex flex-col flex-wrap justify-between border-2 border-t-0 shrink-0 tab-header border-b-grey-50 border-x-0 lg:flex-row"
        aria-label="Manage your account"
      >
        {/* {[
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
        ))} */}
        {description &&
          <Tabs.Trigger
            className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
            value="description-tab"
          >
            <h5 className="cursor-pointer">Description</h5>
          </Tabs.Trigger>
        }
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="features-tab"
        >
          <h5 className="cursor-pointer">Features</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="package-tab"
        >
          <h5 className="cursor-pointer">Packaged Contents</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="specifications-tab"
        >
          <h5 className="cursor-pointer">Specifications</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="downloads-tab"
        >
          <h5 className="cursor-pointer">Downloads</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="videos-tab"
        >
          <h5 className="cursor-pointer">Videos</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="faq-tab"
        >
          <h5 className="cursor-pointer">FAQ</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="alternate-tab"
        >
          <h5 className="cursor-pointer">Alternate Products</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="brochure-tab"
        >
          <h5 className="cursor-pointer">Brochure</h5>
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
          value="operating-tab"
        >
          <h5 className="cursor-pointer">Operating Manual</h5>
        </Tabs.Trigger>
      </Tabs.List>

      {description &&
        <Tabs.Content
          className="py-8 bg-white outline-none grow rounded-b-md "
          value="description-tab"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: description
            }}></div>
        </Tabs.Content>
      }
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="features-tab"
      >
        <ProductFeatures featureHeading={'Features'} />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="package-tab"
      >
        <PackageContents
          mainTitle={'Optional Extras'}
          packageTitleFirst={'PLASMA ACCESSORIES'}
          packageTitleSecond={'SAFETY EQUIPMENT'}
          tableTitle={'option'}
        />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="specifications-tab"
      >
        <Specifications mainTitle={'PRODUCT SPECIFICATIONS'} />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="downloads-tab"
      >
        <ProductDownloads
          mainTitle={'FILES FOR DOWNLOADS'}
          download={'/downloadFiles.png'}
          btnTitle={'Download'}
        />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="videos-tab"
      >
        <ProductVideos mainTitle={'Videos'} />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="faq-tab"
      >
        <ProductFaq mainTitle={' FREQUENTLY ASKED QUESTIONS'} />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="alternate-tab"
      >
        <AlternativeProduct />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="brochure-tab"
      >
        <ProductDownloads
          mainTitle={'FILES FOR DOWNLOADS'}
          download={'/downloadFiles.png'}
          btnTitle={'Download'}
        />
      </Tabs.Content>
      <Tabs.Content
        className="py-8 bg-white outline-none grow rounded-b-md focus:none"
        value="operating-tab"
      >
        <ProductDownloads
          mainTitle={'FILES FOR DOWNLOADS'}
          download={'/downloadFiles.png'}
          btnTitle={'Download'}
        />
      </Tabs.Content>
    </Tabs.Root>
  </section>
);

export default ProductTab;
