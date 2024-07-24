const Expenditure = ({
  expenditureData,
  activeTab,
  currencySymbol,
}: {
  expenditureData: any;
  activeTab: string;
  currencySymbol: string;
}) => {
  return (
    <div className="flex flex-col mxs:flex-row gap-x-8 gap-y-6 expenditure">
      <div className='relative after:content-[""] after:absolute after:bg-grey-50 after:-bottom-3 after:w-full after:h-px after:mxs:w-px after:mxs:h-14 after:mxs:top-0 after:mxs:-right-4'>
        <p className="font-medium uppercase">{activeTab}</p>
        <p className="text-lg italic font-bold lg:text-xl xl:text-2xl">
          {expenditureData?.currency}{' '}
          <span className="text-xl lg:text-2xl xl:text-3xl">
            {currencySymbol && currencySymbol}
            {expenditureData?.amount}
          </span>
        </p>
      </div>
      <div className='relative after:content-[""] after:absolute after:bg-grey-50 after:-bottom-3 after:w-full after:h-px after:mxs:w-px after:mxs:h-14 after:mxs:top-0 after:mxs:-right-4'>
        <p className="font-medium capitalize">
          <span className="uppercase">{activeTab}</span> last year
        </p>
        <p className="text-lg italic font-bold lg:text-xl xl:text-2xl">
          {expenditureData?.currency}{' '}
          <span className="text-xl lg:text-2xl xl:text-3xl">
            {currencySymbol && currencySymbol}
            {expenditureData?.lastAmount}
          </span>
        </p>
      </div>
      <div className='relative after:content-[""] after:absolute after:bg-grey-50 after:-bottom-3 after:w-full after:h-px after:mxs:w-px after:mxs:h-14 after:mxs:top-0 after:mxs:-right-4'>
        <p className="font-medium capitalize">full spend previous year</p>
        <p className="text-lg italic font-bold lg:text-xl xl:text-2xl">
          {expenditureData?.currency}{' '}
          <span className="text-xl lg:text-2xl xl:text-3xl">
            {currencySymbol && currencySymbol}
            {expenditureData?.fullSpendAmount}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Expenditure;
