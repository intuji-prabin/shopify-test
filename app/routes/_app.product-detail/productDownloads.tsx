import {Button} from '~/components/ui/button';

export function DownloadFile({filename}: {filename?: string}) {
  return (
    <>
      <h5 className="text-lg italic text-grey-900 font-bold leading-6 ">
        {filename}
      </h5>
    </>
  );
}

export default function ProductDownloads() {
  return (
    <>
      <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase ">
        FILES FOR DOWNLOADS
      </h3>
      <div className="py-4 flex gap-8 max-w-[500px] justify-between border-[1px] border-b-grey-50 border-x-0 border-t-0 ">
        <div className="flex items-center gap-[13px] w-full">
          <figure className=" bg-grey-25  max-w-14 h-full w-full flex items-center justify-center">
            <img src="downloadFiles.png" alt="" />
          </figure>
          <DownloadFile filename="Prolite Helmet Manual" />
        </div>
        <Button variant="primary" size="default">
          Download
        </Button>
      </div>
      <div className="py-4 flex gap-8 max-w-[500px] justify-between border-[1px] border-b-grey-50 border-x-0 border-t-0  ">
        <div className="flex items-center gap-[13px] w-full">
          <figure className=" bg-grey-25  max-w-14 h-full w-full flex items-center justify-center">
            <img src="downloadFiles.png" alt="" />
          </figure>
          <DownloadFile filename="Prolite Helmet Manual" />
        </div>
        <Button variant="primary" size="default">
          Download
        </Button>
      </div>
    </>
  );
}
