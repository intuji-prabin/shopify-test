import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import OrderTable from './order-table';

export default function BulkOrderPage({measurement}: {measurement?: string}) {
  return (
    <>
      <HeroBanner
        imageUrl={'/place-order.png'}
        sectionName={'PLACE AN ORDER'}
      />
      <UploadSearchbar />
      <OrderTable />
    </>
  );
}
