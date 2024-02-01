import * as Tabs from '@radix-ui/react-tabs';
import ProductFeatures from '../_app.product-detail/productFeatures';
import {Button} from '~/components/ui/button';
import NewsForYou from './sections/news-for-you';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {TicketsData} from '../_app.support_.tickets/tickets-data';
import PreviousNotification from './sections/previous-notification';

export default function NotificationPage() {
  function handleClearAll() {}
  return (
    <section className="tab-wrapper ">
      <div className="container">
        <div className="flex  justify-between items-center">
          <h3>Notifications</h3>
          <div className="flex gap-2 items-center">
            <p className="text-lg font-bold leading-[22px] text-grey-900 italic">
              6 item
            </p>
            <Button onClick={handleClearAll}>clear all</Button>
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
            {['New For You', 'Previous Notifications'].map(
              (tabValue, index) => (
                <Tabs.Trigger
                  key={`tab${index + 1}`}
                  className={`bg-white px-4 py-3 h-[45px] justify-start text-[15px] text-grey-500 text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:text-primary-500 data-[state=active]:border-b-4 border-primary-500 data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:bottom-border-tabs data-[state=active]:focus:red outline-none cursor-default flex items-center gap-2`}
                  value={`tab${index + 1}`}
                >
                  <h5 className="cursor-pointer not-italic leading-[21px] font-normal text-base">
                    {tabValue}
                  </h5>
                  <div className="p-[6px] bg-primary-100 notification-counter">
                    06
                  </div>
                </Tabs.Trigger>
              ),
            )}
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
            <PreviousNotification />
          </Tabs.Content>
          <div className="bg-neutral-white py-4 px-6 border-t flex items-center justify-between">
            <p className="w-40 text-grey-400 font-medium">
              1-7 of {TicketsData.length} Items
            </p>
            <PaginationWrapper pageSize={5} totalCount={TicketsData.length} />
          </div>
        </Tabs.Root>
      </div>
    </section>
  );
}
