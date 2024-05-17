import {Notification} from '../_app.notification/notification';
type NotificationType = 'PROMOTION' | 'ORDER' | 'INVOICE';
interface Notification {
  id: number;
  message: string;
  shopifyId: string;
  companyId: string;
  type: NotificationType;
  status: 'NEW' | 'OPENED';
}
const notification: Notification = {
  id: 2,
  message: 'May 17, 2024 you have assign new promotion banner 73',
  shopifyId: '73',
  companyId: 'SMT-001',
  type: 'INVOICE',
  status: 'NEW',
};
export default function NewNotificationPage() {
  return <Notification notification={notification} />;
}
