import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

const PromotionCard = ({
  title,
  imageURL,
  myPromotion = false,
  id,
  expire_at
}: {
  title: string;
  imageURL: string;
  myPromotion?: boolean;
  id: number;
  expire_at: string;
}) => {
  // Get today's date
  const today = new Date();
  // Extract year, month, and day from the expiration date
  const expireDate = new Date(expire_at);
  const expireYear = expireDate.getFullYear();
  const expireMonth = expireDate.getMonth();
  const expireDay = expireDate.getDate();
  // Extract year, month, and day from today's date
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  // Function to check if the expiration date is past today's date
  const isExpired = () => {
    return (
      expireYear < todayYear ||
      (expireYear === todayYear && expireMonth < todayMonth) ||
      (expireYear === todayYear && expireMonth === todayMonth && expireDay < todayDay)
    );
  };

  return (
    <>
      <figure>
        <img
          alt="preview"
          src={imageURL}
          className="object-cover w-full h-60"
        />
      </figure>
      <div className="p-4 space-y-4 bg-grey-25">
        <h5>{title}</h5>
        <div className="grid grid-cols-1 gap-2 mxs:grid-cols-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="primary">
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1280px] p-0 border-0 gap-y-0 promotion-view w-auto">
              <div className="px-5 py-3">
                <h5>{title}</h5>
              </div>
              <img
                alt="preview"
                src={imageURL}
                className="h-auto max-h-[calc(100vh_-_100px)]"
              />
            </DialogContent>
          </Dialog>
          {isExpired() ? (
            <button
              className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-not-allowed text-grey-400 bg-grey-200"
              disabled
            >
              Expired
            </button>
          ) : (
            myPromotion ? (
              <Link
                to={`/edit/${id}`}
                className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-pointer text-grey-900 border-primary-500 hover:bg-primary-100 disabled:border-none disabled:text-neutral-white disabled:bg-grey-50"
              >
                Edit
              </Link>
            ) : (
              <Link
                to={`/customise/${id}`}
                className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-pointer text-grey-900 border-primary-500 hover:bg-primary-100 disabled:border-none disabled:text-neutral-white disabled:bg-grey-50"
              >
                customise
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default PromotionCard;
