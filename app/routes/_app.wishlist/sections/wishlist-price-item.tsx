import { InfoIcon } from '~/components/icons/info-icon';

export default function WishlistPriceItem({ buyPrice }: { buyPrice: number }) {
  return (
    <div className="flex flex-col gap-[2px] items-baseline">
      <p className="flex mb-1.5 text-semantic-success-500 font-medium text-sm">
        BUY PRICE{' '}
        <span>
          <InfoIcon />
        </span>
      </p>
      <div>
        <p className="text-grey-900 text-lg leading-5.5 italic">${buyPrice}</p>
        <p className="text-sm italic font-bold leading-normal text-grey-500">
          (Excl. GST)
        </p>
      </div>
    </div>
  );
}
