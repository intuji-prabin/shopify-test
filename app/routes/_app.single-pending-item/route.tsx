import HeroBanner from '~/components/ui/hero-section';
import SingleItem from './single-item';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';

export default function route() {
  return (
    <>
      <HeroBanner imageUrl={'/place-order.png'} sectionName={'Gloves'} />
      <UploadSearchbar searchVariant="pending_order" />
      <SingleItem />
    </>
  );
}
