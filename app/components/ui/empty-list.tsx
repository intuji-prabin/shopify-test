import { EmptyArrow } from "../icons/emptyArrow";

const EmptyList = () => {
    return (
        <div className="container flex justify-center mt-12 mb-[488px]">
            <div className="flex items-center gap-4">
                <EmptyArrow />
                <div className="space-y-4 text-center">
                    <h3>It seems like your List is empty.</h3>
                    <p className="text-lg leading-5.5 text-grey-900">
                        Use <span className="font-medium">Rapid Product Search</span> to
                        instantly search product and add to the list.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EmptyList;