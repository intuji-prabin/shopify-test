import Loader from "~/components/ui/loader";

const VerifyingPassword = () => {
    return (
        <div className='md:w-[398px] w-full'>
            <div className="flex flex-col p-8 space-y-8 bg-white shadow-3xl">
                <div className="flex flex-col items-center justify-center gap-y-5">
                    <Loader />
                    <h4>Verifying...</h4>
                </div>
            </div>
        </div>
    );
}

export default VerifyingPassword;