import HeroBanner from '~/components/ui/hero-section';
import SingleItem from './single-item';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';

export default function route() {
  return (
    <>
      <HeroBanner image_url={'/place-order.png'} section_name={'Gloves'} />
      <UploadSearchbar />
      <SingleItem />
    </>
  );
}
