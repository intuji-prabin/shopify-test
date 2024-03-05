import Loader from '~/components/ui/loader';

const FullPageLoading = ({ description = "Loading...." }: { description?: string }) => {
    return (
        <div className="absolute inset-0 z-[9999]">
            <div className="flex h-full bg-white/95">
                <div className="fixed flex flex-wrap items-center justify-center -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 gap-x-4 gap-y-2">
                    <p className="text-lg">
                        {description}
                    </p>
                    <Loader width="w-8" height="h-8" />
                </div>
            </div>
        </div>
    );
}

export default FullPageLoading;