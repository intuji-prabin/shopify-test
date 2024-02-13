import {OrderSuccessfull} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';

export default function OrderSuccess() {
  return (
    <div className="max-w-[538px] bg-white flex flex-col mx-auto justify-center items-center gap-10 py-6">
      <figure className="bg-semantic-success-100 rounded-[50%] h-12 w-12 flex items-center justify-center">
        <OrderSuccessfull />
      </figure>
      <div className="flex flex-col gap-6">
        <h3>Your order has been successfully placed</h3>
        <div className="flex items-center flex-col">
          <p>Alex Smith, thank you for your order!</p>
          <p>
            We’ve received your order and will contact your via email address.
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="primary">track order</Button>
        <Button variant="ghost">All products</Button>
      </div>
    </div>
  );
}
