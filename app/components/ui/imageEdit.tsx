import { RefObject } from 'react';
import { Call } from '../icons/call';
import { Fax } from '../icons/fax';
import { Globe } from '../icons/globe';
import Mail from '../icons/mail';
interface ImageEditProps {
  canvasRef?: RefObject<HTMLDivElement>;
  imgSrc: string;
  alt: string;
  renderedImageWidth: number | undefined;
  companyInfo?: {
    companyLogo: string;
    companyName: string;
    companyEmail: string;
    companyWebsite: string;
    companyPhone: string;
    companyFax: string;
    textColor: string;
    bgColor: string;
  };
}

const ImageEdit = ({
  canvasRef,
  imgSrc,
  alt,
  companyInfo,
  renderedImageWidth,
}: ImageEditProps) => {
  return (
    <div className="flex justify-center px-6 py-10 bg-white">
      <div className='overflow-x-auto border border-gray-200 border-dashed'>
        <div
          style={{
            width:
              renderedImageWidth && renderedImageWidth < 799 ? 'min-content' : '',
          }}
          ref={canvasRef}
          id="main-image"
        >
          {!!renderedImageWidth && (
            <img
              alt={alt}
              src={imgSrc}
              className={`${renderedImageWidth > 799 && 'w-full'} h-auto`}
            />
          )}
          <div
            style={{
              backgroundColor: companyInfo?.bgColor,
              width:
                renderedImageWidth && renderedImageWidth > 799
                  ? '100%'
                  : renderedImageWidth,
            }}
          >
            <div
              className="flex flex-wrap items-center justify-between p-4 gap-x-6 gap-y-3"
              style={{ color: companyInfo?.textColor }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 p-1 bg-white border border-solid rounded-full border-grey-50">
                  <img
                    src={companyInfo?.companyLogo}
                    alt="view"
                    className="object-contain rounded-full w-11 h-11 image-preview"
                  />
                </div>
                <h5 style={{ lineHeight: '0', fontFamily: 'Barlow Condensed' }}>
                  {companyInfo?.companyName}
                </h5>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div className="space-y-2">
                  <p
                    className="flex items-center gap-1"
                    style={{
                      color: companyInfo?.textColor,
                      fontFamily: 'Barlow Condensed',
                    }}
                  >
                    <Mail fillColor="#0F1010" />
                    {companyInfo?.companyEmail}
                  </p>
                  <p
                    className="flex items-center gap-1"
                    style={{
                      color: companyInfo?.textColor,
                      fontFamily: 'Barlow Condensed',
                    }}
                  >
                    <Call />
                    {companyInfo?.companyPhone}
                  </p>
                </div>
                <div className="space-y-2">
                  <p
                    className="flex items-center gap-1"
                    style={{
                      color: companyInfo?.textColor,
                      fontFamily: 'Barlow Condensed',
                    }}
                  >
                    <Globe />
                    {companyInfo?.companyWebsite}
                  </p>
                  <p
                    className="flex items-center gap-1"
                    style={{
                      color: companyInfo?.textColor,
                      fontFamily: 'Barlow Condensed',
                    }}
                  >
                    <Fax />
                    {companyInfo?.companyFax}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEdit;
