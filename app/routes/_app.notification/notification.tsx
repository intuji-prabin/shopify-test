import * as Tabs from '@radix-ui/react-tabs';
import ProductFeatures from '../_app.product-detail/productFeatures';
import {Button} from '~/components/ui/button';
import NewsForYou from './sections/news-for-you';

export default function NotificationPage() {
  return (
    <section className="tab-wrapper  container">
      <div className="flex  justify-between items-center">
        <h3>Notifications</h3>
        <div className="flex gap-2 items-center">
          <p className="text-lg font-bold leading-[22px] text-grey-900 italic">
            6 item
          </p>
          <Button>clear all</Button>
        </div>
      </div>
      <Tabs.Root
        className="flex flex-col p-6 bg-white mt-[22px] relative"
        defaultValue="tab1"
      >
        {/* Tab list header starts here */}
        <Tabs.List
          className="shrink-0 flex tab-header border-b-grey-50 border-x-0 border-t-0 border-2  flex-col flex-wrap lg:flex-row"
          aria-label="Manage your account"
        >
          {['New For You', 'Previous Notifications'].map((tabValue, index) => (
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
          <NewsForYou />
        </Tabs.Content>
        <Tabs.Content
          className="grow py-8 bg-white rounded-b-md outline-none  focus:none"
          value="tab2"
        >
          <ProductFeatures featureHeading={'Features'} />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
