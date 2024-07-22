import { PredictiveSearch } from "~/components/ui/predictive-search";

const ComparisonEmpty = () => {
    return (
        <>
            <div className='flex items-center justify-center h-48 p-5 bg-grey-25'>
            </div>
            <div className='pt-3'>
                <p className='text-lg font-medium leading-[22px] text-grey-900'>
                    Add a product
                </p>
            </div>
            <div className=' flex bg-white items-center w-full h-[38px] px-3 py-2 relative border border-solid border-grey-100 mt-4'>
                <PredictiveSearch inputPlaceholder='Search product' searchVariant="compare" />
            </div>
        </>
    );
}

export default ComparisonEmpty;