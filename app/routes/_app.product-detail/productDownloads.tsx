import {Button} from '~/components/ui/button';

export function DownloadFile({filename}: {filename?: string}) {
  return (
    <>
      <h5 className="text-lg italic text-grey-900 font-bold leading-6">
        {filename}
      </h5>
    </>
  );
}

type ProductDownloadProps = {
  download: string;
  btnTitle: string;
};

function ProductDownload({download, btnTitle}: ProductDownloadProps) {
  return (
    <div className="py-4 flex gap-8 max-w-[500px] justify-between border-[1px] border-b-grey-50 border-x-0 border-t-0">
      <div className="flex items-center gap-[13px] w-full">
        <figure className="bg-grey-25 max-w-14 h-full w-full flex items-center justify-center">
          <img src={download} className="" alt="product-image" />
        </figure>
        <DownloadFile filename="Prolite Helmet Manual" />
      </div>
      <Button variant="primary" size="default">
        {btnTitle}
      </Button>
    </div>
  );
}

type PackageProps = {
  mainTitle: string;
} & ProductDownloadProps;

export default function ProductDownloads({
  mainTitle,
  download,
  btnTitle,
}: PackageProps) {
  return (
    <>
      <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase">
        {mainTitle}
      </h3>
      <ProductDownload download={download} btnTitle={btnTitle} />
      <ProductDownload download={download} btnTitle={btnTitle} />
    </>
  );
}
