import {getProductGroup} from '../_app.pending-order/pending-order.server';

export async function getProductGroupOptions({
  customerId,
}: {
  customerId: string;
}) {
  const productGroup = await getProductGroup({customerId});

  const productGroupOptions = productGroup.map((group) => ({
    label: group.groupName,
    value: String(group.groupId),
  }));

  return productGroupOptions;
}
