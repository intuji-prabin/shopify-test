import HeroSection from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import OrderTable from './order-table';
import OrderlistTitle from './order-list-title';

export default function BulkOrderPage({ measurement}:{ measurement?: string;}) {
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
