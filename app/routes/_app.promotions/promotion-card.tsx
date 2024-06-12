import { Link, useLocation } from '@remix-run/react';
import { AsyncImage } from 'loadable-image';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Can } from '~/lib/helpers/Can';
const PromotionCard = ({
  title,
  imageURL,
  myPromotion = false,
  id,
  expire_at,
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
      (expireYear === todayYear &&
        expireMonth === todayMonth &&
        expireDay < todayDay)
    );
  };

  const [renderedImageWidth, setRenderedImageWidth] = useState();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('id') === String(id)) {
      setIsDialogOpen(true);
    }
  }, [location.search, id]);

  const handleViewClick = () => {
    const params = new URLSearchParams(location.search);
    params.set('id', id.toString());
    window.history.pushState(
      {},
      '',
      `${location.pathname}?${params.toString()}`,
    );
    setIsDialogOpen(true);
  };

  const handleClosePreview = () => {
    const params = new URLSearchParams(location.search);
    params.delete('id');
    window.history.pushState({}, '', `${location.pathname}`);
    setIsDialogOpen(false);
  };

  return (
    <>
      <figure>
        <AsyncImage
          loader={
            <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700 animate-pulse">
              <svg
                className="w-10 h-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          }
          src={imageURL}
          className="w-full h-60"
        />
      </figure>
      <div className="p-4 space-y-4 bg-grey-25">
        <h5>{title}</h5>
        <div className="flex flex-col gap-2 mxs:flex-row">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(isOpen) => !isOpen && handleClosePreview()}
          >
            <Can I="view" a="view_promotional_banners">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="primary"
                  className="grow"
                  onClick={handleViewClick}
                >
                  View
                </Button>
              </DialogTrigger>
            </Can>

            <DialogContent className="max-w-[1280px] p-0 border-0 gap-y-0 promotion-view w-auto">
              <div
                className="py-3 pl-5 pr-10"
                style={{ maxWidth: renderedImageWidth }}
              >
                <h5>{title}</h5>
              </div>
              <img
                alt="preview"
                src={imageURL}
                className="h-auto max-h-[calc(100vh_-_100px)] mx-auto -mb-0.5"
                onLoad={(event: any) =>
                  setRenderedImageWidth(event?.target?.width)
                }
              />
            </DialogContent>
          </Dialog>
          {isExpired() ? (
            <button
              className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-not-allowed text-grey-400 bg-grey-200 grow"
              disabled
            >
              Expired
            </button>
          ) : myPromotion ? (
            <Can I="view" a="edit_promotions">
              <Link
                to={`/edit/${id}`}
                className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-pointer text-grey-900 border-primary-500 hover:bg-primary-100 disabled:border-none disabled:text-neutral-white disabled:bg-grey-50 grow"
              >
                Edit
              </Link>
            </Can>
          ) : (
            <Can I="view" a="customize_promotions">
              <Link
                to={`/customise/${id}`}
                className="flex items-center justify-center gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-pointer text-grey-900 border-primary-500 hover:bg-primary-100 disabled:border-none disabled:text-neutral-white disabled:bg-grey-50 grow"
              >
                customise
              </Link>
            </Can>
          )}
        </div>
      </div>
    </>
  );
};

export default PromotionCard;
