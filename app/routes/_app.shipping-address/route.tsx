import InfoBar from '~/components/ui/layouts/infoBar';
import ShippingAddressBreadcrumb from './shipping-address-breadcrumb';
import ShippingAddressCards from './shipping-address-card';

export default function ShippingAddressMgmt() {
  return (
    <div className="container py-12 ">
      <ShippingAddressBreadcrumb title={'Shipping Address '} />
      <InfoBar
        title={'To edit or add new shipping address please'}
        url={' contact us.'}
      />
      <ShippingAddressCards />
    </div>
  );
}
