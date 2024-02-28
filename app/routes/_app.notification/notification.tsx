import * as Tabs from '@radix-ui/react-tabs';
import NewsForYou from './sections/news-for-you';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {TicketsData} from './tickets-data';
import PreviousNotification from './sections/previous-notification';
import ClearAllDialouge from './sections/clear-all-dialouge-box';

export default function NotificationPage({
  news,
}: {
  news: {
    id: number;
    date: string;
    news: string;
    orderNo: string;
    customer: string;
  }[];
}) {
  function handleRemoveAllItems() {
    // table.toggleAllPageRowsSelected(false);
  }

  return (
    <section className="tab-wrapper ">
      <div className="container">
        <div className="flex  justify-between items-center">
          <h3>Notifications</h3>
          <div className="flex gap-2 items-center">
            <p className="text-lg font-bold leading-[22px] text-grey-900 italic">
              {/* 6 item */}
              {news?.length === 1 ? '1 item ' : `${news.length} items `}
            </p>
            <div className="remove-dialogue">
              <ClearAllDialouge handleRemoveAllItems={handleRemoveAllItems} />
            </div>
          </div>
        </div>
        <Tabs.Root
          className="flex flex-col p-6 bg-white mt-[22px] relative"
          defaultValue="tab1"
        >
          {/* Tab list header starts here */}
          <div className="relative">
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
                      {news.length <= 9 ? ' 0' + news.length : news.length}
                    </div>
                  </Tabs.Trigger>
                ),
              )}
            </Tabs.List>
            <div className="absolute top-2 right-0 bg-white uppercase text-[#0F1010] italic text-lg leading-6 cursor-pointer border-primary-500  border-b-2 boder-t-0 border-x-0">
              mark all as read
            </div>
          </div>

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

          <PaginationWrapper pageSize={5} totalCount={TicketsData.length} />
        </Tabs.Root>
      </div>
    </section>
  );
}
