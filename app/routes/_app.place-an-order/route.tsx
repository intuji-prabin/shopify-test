import HeroSection from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import OrderTable from './order-table';
import ClearAllDialouge from '../_app.notification/sections/clear-all-dialouge-box';
import OrderlistTitle from './order-list-title';

export default function BulkOrderPage() {
  return (
    <>
      <HeroSection
        image_url={'/place-order.png'}
        section_name={'PLACE AN ORDER'}
      />
      <UploadSearchbar />
      <OrderlistTitle />
      <OrderTable />
    </>
  );
}
