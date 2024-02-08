import {Button} from '~/components/ui/button';
import CreateGroup from './create-a-group';

export default function OrderlistTitle() {
  const orderList = [
    {
      id: 0,
      date: 'Oct 12 10:00 AM ',
      orderList:
        'New Order Received - Order No. 0005145629 ordered by Catherin McCallum',
      orderNo: ' 0005145629',
      customer: 'Catherin McCallum',
    },
    {
      id: 1,
      date: 'Oct 12 10:00 AM ',
      orderList:
        'New Order Received - Order No. 0005145629 ordered by Catherin McCallum',
      orderNo: ' 0005145629',
      customer: 'Catherin McCallum',
    },
    {
      id: 2,
      date: 'Oct 12 10:00 AM ',
      orderList:
        'New Order Received - Order No. 0005145629 ordered by Catherin McCallum',
      orderNo: ' 0005145629',
      customer: 'Catherin McCallum',
    },
  ];
  function handleRemoveAllItems() {
    // table.toggleAllPageRowsSelected(false);
  }

  return (
    <div className=" container flex  justify-between items-center my-[30px]">
      <h3>Order List</h3>
      <div className="flex gap-2 items-center">
        <p className="text-lg font-bold leading-[22px] text-grey-900 italic">
          {orderList?.length === 0
            ? 'Please select items to create a group or add to cart. '
            : `${orderList.length} items `}
        </p>

        <div className="remove-dialogue">
          <CreateGroup handleRemoveAllItems={handleRemoveAllItems} />
        </div>
        <Button className="bg-secondary-500 min-w-[111px] text-grey-900 uppercase font-bold italic hover:bg-grey-900 hover:text-white">
          Add to cart
        </Button>
      </div>
    </div>
  );
}
