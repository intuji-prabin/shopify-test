import * as Tabs from '@radix-ui/react-tabs';
import AlternativeProduct from './ProductAlternateProducts';
import ProductDownloads from './productDownloads';
import ProductFaq from './productFaq';


const ProductTab = ({ productTab }: any) => {
  return (
    <section className="bg-white tab-wrapper">
      <Tabs.Root className="flex flex-col p-6" defaultValue="description-tab">
        {/* Tab list header starts here */}
        <Tabs.List
          className="flex flex-col flex-wrap justify-between border-2 border-t-0 shrink-0 tab-header border-b-grey-50 border-x-0 lg:flex-row"
          aria-label="Manage your account"
        >
          {productTab?.description &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="description-tab"
            >
              <h5 className="cursor-pointer">Description</h5>
            </Tabs.Trigger>
          }
          {productTab?.features &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="features-tab"
            >
              <h5 className="cursor-pointer">Features</h5>
            </Tabs.Trigger>
          }
          {productTab?.packageContent &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="package-tab"
            >
              <h5 className="cursor-pointer">Packaged Contents</h5>
            </Tabs.Trigger>
          }
          {productTab?.specification &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="specifications-tab"
            >
              <h5 className="cursor-pointer">Specifications</h5>
            </Tabs.Trigger>
          }
          {productTab?.download && productTab?.download.length > 0 &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="downloads-tab"
            >
              <h5 className="cursor-pointer">Downloads</h5>
            </Tabs.Trigger>
          }
          {productTab?.video && productTab?.video.length > 0 &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="videos-tab"
            >
              <h5 className="cursor-pointer">Videos</h5>
            </Tabs.Trigger>
          }
          {productTab?.faq && productTab?.faq.length > 0 &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="faq-tab"
            >
              <h5 className="cursor-pointer">FAQ</h5>
            </Tabs.Trigger>
          }
          <Tabs.Trigger
            className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
            value="alternate-tab"
          >
            <h5 className="cursor-pointer">Alternate Products</h5>
          </Tabs.Trigger>
          {productTab?.brochure && productTab?.brochure.length > 0 &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="brochure-tab"
            >
              <h5 className="cursor-pointer">Brochure</h5>
            </Tabs.Trigger>
          }
          {productTab?.operatingManual && productTab?.operatingManual.length > 0 &&
            <Tabs.Trigger
              className={`bg-white px-4 py-3 h-[45px] flex items-left justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default`}
              value="operating-tab"
            >
              <h5 className="cursor-pointer">Operating Manual</h5>
            </Tabs.Trigger>
          }
        </Tabs.List>

        {productTab?.description &&
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md "
            value="description-tab"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: productTab?.description
              }}></div>
          </Tabs.Content>
        }
        {productTab?.features &&
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="features-tab"
          >
            {/* <ProductFeatures featureHeading={'Features'} /> */}
            <div
              dangerouslySetInnerHTML={{
                __html: productTab?.features
              }}></div>
          </Tabs.Content>
        }
        {productTab?.packageContent &&
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="package-tab"
          >
            {/* <PackageContents
            mainTitle={'Optional Extras'}
            packageTitleFirst={'PLASMA ACCESSORIES'}
            packageTitleSecond={'SAFETY EQUIPMENT'}
            tableTitle={'option'}
          /> */}
            <div
              dangerouslySetInnerHTML={{
                __html: productTab?.packageContent
              }}></div>
          </Tabs.Content>
        }
        {productTab?.specification &&
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="specifications-tab"
          >
            {/* <Specifications mainTitle={'PRODUCT SPECIFICATIONS'} /> */}
            <div
              dangerouslySetInnerHTML={{
                __html: productTab?.specification
              }}></div>
          </Tabs.Content>
        }
        {productTab?.download && productTab?.download.length > 0 && (
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="downloads-tab"
          >
            {productTab?.download.map((item: any, index: number) => (
              <div className="py-4 flex gap-8 max-w-[500px] justify-between border-[1px] border-b-grey-50 border-x-0 border-t-0" key={index}>
                <div className="flex items-center gap-[13px] w-full">
                  <figure className="flex items-center justify-center w-full h-full bg-grey-25 max-w-14">
                    <img src='/downloadFiles.png' className="" alt="pdf" />
                  </figure>
                  <h5 className="text-lg italic font-bold leading-6 text-grey-900">
                    {item?.text}
                  </h5>
                </div>
                <a href={item?.url} target="_blank" className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic leading-6 uppercase duration-150 border-solid cursor-pointer text-neutral-white bg-primary-500 hover:bg-primary-600 disabled:bg-grey-50" download="text.pdf">
                  Download
                </a>
              </div>
            ))}
          </Tabs.Content>
        )}
        {productTab?.video && productTab?.video.length > 0 &&
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="videos-tab"
          >
            {/* <ProductVideos mainTitle={'Videos'} /> */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 product-tab-video ">
              {productTab?.video.map((item: any, index: number) => (
                item.type === 'youtube' ?
                  <iframe className='w-full aspect-video' src={item.url} key={index} allowFullScreen></iframe>
                  :
                  <video className='w-full aspect-video' controls key={index}>
                    <source src={item.url} type="video/mp4" />
                    <source src={item.url} type="video/ogg" />
                    Your browser does not support HTML video.
                  </video>
              ))}
            </div>
          </Tabs.Content>
        }
        {productTab?.faq && productTab?.faq.length > 0 &&
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="faq-tab"
          >
            <ProductFaq mainTitle={' FREQUENTLY ASKED QUESTIONS'} accordionData={productTab?.faq} />
          </Tabs.Content>
        }
        <Tabs.Content
          className="py-8 bg-white outline-none grow rounded-b-md focus:none"
          value="alternate-tab"
        >
          <AlternativeProduct />
        </Tabs.Content>
        {productTab?.brochure && productTab?.brochure.length > 0 && (
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="brochure-tab"
          >
            {productTab?.brochure.map((item: any, index: number) => (
              <div className="py-4 flex gap-8 max-w-[500px] justify-between border-[1px] border-b-grey-50 border-x-0 border-t-0" key={index}>
                <div className="flex items-center gap-[13px] w-full">
                  <figure className="flex items-center justify-center w-full h-full bg-grey-25 max-w-14">
                    <img src='/downloadFiles.png' className="" alt="pdf" />
                  </figure>
                  <h5 className="text-lg italic font-bold leading-6 text-grey-900">
                    {item?.text}
                  </h5>
                </div>
                <a href={item?.url} target="_blank" className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic leading-6 uppercase duration-150 border-solid cursor-pointer text-neutral-white bg-primary-500 hover:bg-primary-600 disabled:bg-grey-50" download="text.pdf">
                  Download
                </a>
              </div>
            ))}
          </Tabs.Content>
        )}
        {productTab?.operatingManual && productTab?.operatingManual.length > 0 && (
          <Tabs.Content
            className="py-8 bg-white outline-none grow rounded-b-md focus:none"
            value="operating-tab"
          >
            {productTab?.operatingManual.map((item: any, index: number) => (
              <div className="py-4 flex gap-8 max-w-[500px] justify-between border-[1px] border-b-grey-50 border-x-0 border-t-0" key={index}>
                <div className="flex items-center gap-[13px] w-full">
                  <figure className="flex items-center justify-center w-full h-full bg-grey-25 max-w-14">
                    <img src='/downloadFiles.png' className="" alt="pdf" />
                  </figure>
                  <h5 className="text-lg italic font-bold leading-6 text-grey-900">
                    {item?.text}
                  </h5>
                </div>
                <a href={item?.url} target="_blank" className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic leading-6 uppercase duration-150 border-solid cursor-pointer text-neutral-white bg-primary-500 hover:bg-primary-600 disabled:bg-grey-50" download="text.pdf">
                  Download
                </a>
              </div>
            ))}
          </Tabs.Content>
        )}
      </Tabs.Root >
    </section>
  )
};

export default ProductTab;
