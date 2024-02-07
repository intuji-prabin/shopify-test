import {json, useLoaderData} from '@remix-run/react';
import NotificationPage from './notification';
import {news} from './sections/notification';

//Type Definitions for the Notification Page

export type NotificationListItem = {
  id: string;
  date: string;
  news: string;
  orderNo: number;
  customer: string;
};
async function getNotificationItems() {
  return news;
}
export const loader = async () => {
  const items = await getNotificationItems();
  return json({items});
};
export default function route() {
  const {items} = useLoaderData<typeof loader>();
  return (
    <>
      <NotificationPage news={items} />
    </>
  );
}
