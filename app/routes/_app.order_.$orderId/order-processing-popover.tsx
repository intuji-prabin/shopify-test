import {Button} from '~/components/ui/button';
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog';

export function PickedButton() {
  return (
    <Button variant="status_brown" className="w-full min-w-[184px] py-2">
      Picked
    </Button>
  );
}
export function DeliveredButton() {
  return (
    <Button variant="status_green" className="w-full min-w-[184px] py-2">
      Delivered
    </Button>
  );
}
export function ShippedButton() {
  return (
    <Button variant="status_blue" className="w-full min-w-[184px] py-2">
      Shipped
    </Button>
  );
}

export default function ProcessingPopover() {
  const participants = [
    {
      product_name: 'Thermal Dynamics 1Torch SL100 Plasma Torch 6m Lead',
      status: <PickedButton />,
    },
    {
      product_name: 'Arcair DC Carbon Arc Gouging - Pointed',
      status: <DeliveredButton />,
    },
    {
      product_name: 'WeldSkill 180 AC-DC TIG Welder',
      status: <ShippedButton />,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h4 className="font-bold italic text-xs leading-4 text-gray-900 underline decoration-primary-500 decoration-2 cursor-pointer">
          View Details
        </h4>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[552px] [&>button]:-top-2 [&>button]:-right-3 [&>button]:bg-semantic-danger-500 process p-4">
        <table className="w-full border-collapse">
          <thead className="bg-secondary-500">
            <tr>
              <th
                scope="col"
                className="px-4 py-[6px] text-grey-900 font-medium text-base"
              >
                Product Name
              </th>
              <th
                scope="col"
                className="px-4 py-[6px] text-grey-900 font-medium text-base"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index} className="border-x">
                <td className="px-4 py-3 border-b">
                  {participant.product_name}
                </td>
                <td className="px-4 py-3 border-b">{participant.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
