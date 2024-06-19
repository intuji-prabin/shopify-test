import { PlaceOrder } from '../../top-header';
import { TrackAnOrderButton } from '../track-an-order-dialog';

export default function OrderTrackMobile() {
  return (
    <div className="flex items-center gap-4 flex-row-reverse justify-end md:justify-between pt-4 border border-t-[#e9edf2] border-x-0 border-b-0">
      <TrackAnOrderButton />
      <PlaceOrder />
    </div>
  );
}
