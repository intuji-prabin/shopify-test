import { useActionData } from '@remix-run/react';
import { ActionFunctionArgs, json } from '@remix-run/server-runtime';
import { withZod } from '@remix-validated-form/with-zod';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { ExportUp } from '~/components/icons/export';
import { FullScreen } from '~/components/icons/full-screen';
import AccordionCustom from '~/components/ui/accordionCustom';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import ColorPicker from '~/components/ui/color-picker';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import ImageUploadInput from '~/components/ui/image-upload-input';
import ImageEdit from '~/components/ui/imageEdit';
import Loader from '~/components/ui/loader';
import { Separator } from '~/components/ui/separator';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';

const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

type EditFormProps = {
  defaultValues?: Omit<EditFormType, 'companyLogo'> & {
    companyLogo: string;
  };
};

const EditFormValidator = z.object({
  companyLogo: zfd.file(
    z
      .custom<File | undefined>()
      .refine((file) => {
        if (file instanceof File) {
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        }
        return true;
      }, 'Please choose .jpg, .jpeg, .png, and .webp files.')
      .refine((file) => {
        if (file instanceof File) {
          return file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        }
        // No file provided, so consider it valid
        return true;
      }, 'Max file size is 15MB.'),
  ),
});

export const EditFormSchemaValidator = withZod(EditFormValidator);

export type EditFormType = z.infer<typeof EditFormValidator>;

export type EditFormFieldNameType = keyof EditFormType;

export async function action({ request }: ActionFunctionArgs) {
  const result = await EditFormSchemaValidator.validate(
    await request.formData(),
  );
  console.log('result', result);

  if (result.error) {
    return validationError(result.error);
  }
  const formData = new FormData();
  formData.append('file', result.submittedData.companyLogo);

  return json({ data: result });
}

const PromotionEdit = ({ defaultValues }: EditFormProps) => {
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [renderedImageWidth, setRenderedImageWidth] = useState();
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'ABC Distributors',
    companyEmail: 'company@gmail.com',
    companyWebsite: 'abc.com.au',
    companyFax: '+61 1 123 456 789',
    companyPhone: '+61 1 123 456 789',
    textColor: '#0F1010',
    bgColor: '#f5f5f5',
  });
  const canvasRef = useRef<any>();

  const printDocument = (canvasRef: HTMLElement) => {
    setLoading(true);
    if (canvasRef) {
      html2canvas(canvasRef, {
        useCORS: true,
        scale: 2,
      }).then((canvas) => {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.download = 'preview.png';
        link.href = canvas.toDataURL();
        link.target = '_blank';
        link.click();
        setLoading(false);
      });
    } else {
      alert('Error occured while exporting the image. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setCompanyInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowUnsavedChanges(true);
  };

  const resetCompanyInfo = () => {
    setCompanyInfo({
      companyName: 'ABC Distributors',
      companyEmail: 'company@gmail.com',
      companyWebsite: 'abc.com.au',
      companyFax: '+61 1 123 456 789',
      companyPhone: '+61 1 123 456 789',
      textColor: '#0F1010',
      bgColor: '#f5f5f5',
    });
    const imagePreviews = document.querySelectorAll(
      '.image-preview',
    ) as unknown as HTMLImageElement[];
    imagePreviews.forEach((imagePreview) => {
      imagePreview.setAttribute('src', `${DEFAULT_IMAGE.DEFAULT}`);
    });
    setShowUnsavedChanges(false);
  };

  const actionData = useActionData();
  console.log(actionData);

  const htmlProcessPop = (canvasRef: any) => {
    setImage('');
    html2canvas(canvasRef, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.download = 'preview.png';
      link.href = canvas.toDataURL();
      setImage(link.href);
    });
  };

  const unsavedChanges = () => {
    setShowUnsavedChanges(true);
  };

  return (
    <div className="bg-grey-25">
      <section className="container pt-8 pb-1">
        <div className="flex flex-wrap justify-between gap-4">
          <BackButton title="Customize Promotion" />
          <Button
            type="button"
            size="small"
            variant="ghost"
            className={`border-primary-500 hover:bg-inherit ${loading && 'pointer-events-none'
              }`}
            onClick={() => printDocument(canvasRef.current)}
          >
            {loading ? <Loader /> : <ExportUp />}Export
          </Button>
        </div>
      </section>
      <section className="container mt-1">
        <Breadcrumb>
          <BreadcrumbItem>Content Management</BreadcrumbItem>
          <BreadcrumbItem href="/">Promotions</BreadcrumbItem>
          <BreadcrumbItem href="/" className="text-grey-900">
            Customize Promotion
          </BreadcrumbItem>
        </Breadcrumb>
      </section>
      <section className={`container pb-72 ${showUnsavedChanges && 'mb-28'}`}>
        <Separator className="mt-4 mb-8" />
        <div className="grid items-start grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex flex-wrap justify-between gap-4 px-6 py-4 bg-white border-b border-solid border-grey-50">
              <h5>Live Preview</h5>
              <Dialog>
                <DialogTrigger
                  onClick={() => htmlProcessPop(canvasRef.current)}
                  asChild
                >
                  <p className="flex items-center gap-1 cursor-pointer">
                    <FullScreen />
                    Full Screen
                  </p>
                </DialogTrigger>
                <DialogContent
                  style={{
                    width: renderedImageWidth && renderedImageWidth + 50,
                  }}
                  className={`max-w-4xl ${!image && 'flex items-center justify-center'
                    }`}
                >
                  {image && renderedImageWidth ? (
                    <img
                      src={image}
                      alt="popupView"
                      className="h-auto max-h-[calc(100vh_-_150px)]"
                    />
                  ) : (
                    <>
                      <Loader width="w-10" height="h-10" />
                      <p>Loading...</p>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <img
              src={'/images/imageEditor.png'}
              alt="previewHidden"
              className="hidden"
              onLoad={(event: any) =>
                setRenderedImageWidth(event?.target?.width)
              }
            />
            <ImageEdit
              alt={'preview'}
              imgSrc={'/images/imageEditor.png'}
              canvasRef={canvasRef}
              companyInfo={companyInfo}
              renderedImageWidth={renderedImageWidth}
            />
          </div>
          <div className="relative px-6 py-1 bg-white">
            <ValidatedForm
              method="post"
              validator={EditFormSchemaValidator}
              encType="multipart/form-data"
              defaultValues={defaultValues}
              data-cy="customize-promotion"
            >
              <h5 className="py-4">Company Logo</h5>
              <ImageUploadInput
                name="companyLogo"
                unsavedChanges={unsavedChanges}
                imageUrl={defaultValues?.companyLogo}
                className="pb-4 promotion__edit"
                defaultImage={DEFAULT_IMAGE.DEFAULT}
              />
              <div className="accordion__section">
                <AccordionCustom accordionTitle="Company Information">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="companyname">Company Name</label>
                      <input
                        type="text"
                        name="companyname"
                        value={companyInfo.companyName}
                        className="w-full"
                        placeholder="company name"
                        onInput={(e) =>
                          handleChange('companyName', e.currentTarget.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="companyemail">Company Email</label>
                      <input
                        type="text"
                        name="companyemail"
                        value={companyInfo.companyEmail}
                        className="w-full"
                        placeholder="company email"
                        onInput={(e) =>
                          handleChange('companyEmail', e.currentTarget.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="companywebsite">Company Website</label>
                      <input
                        type="text"
                        name="companywebsite"
                        value={companyInfo.companyWebsite}
                        className="w-full"
                        placeholder="company website"
                        onInput={(e) =>
                          handleChange('companyWebsite', e.currentTarget.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="companyPhone">Company Phone</label>
                      <input
                        type="tel"
                        name="companyPhone"
                        value={companyInfo.companyPhone}
                        className="w-full"
                        placeholder="company phone"
                        onInput={(e) =>
                          handleChange('companyPhone', e.currentTarget.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="companyfax">Company Fax</label>
                      <input
                        type="tel"
                        name="companyfax"
                        value={companyInfo.companyFax}
                        className="w-full"
                        placeholder="company fax"
                        onInput={(e) =>
                          handleChange('companyFax', e.currentTarget.value)
                        }
                      />
                    </div>
                  </div>
                </AccordionCustom>
                <AccordionCustom accordionTitle="Text Color">
                  <ColorPicker
                    name="textColor"
                    color={companyInfo.textColor}
                    onChange={(color) => handleChange('textColor', color)}
                  />
                </AccordionCustom>
                <AccordionCustom accordionTitle="Background">
                  <ColorPicker
                    name="bgColor"
                    color={companyInfo.bgColor}
                    onChange={(color) => handleChange('bgColor', color)}
                  />
                </AccordionCustom>
              </div>
              {showUnsavedChanges && (
                <div className="fixed inset-x-0 bottom-0 py-4 bg-grey-900">
                  <div className="container">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h5 className="text-white">Unsaved changes</h5>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-primary-500"
                          onClick={resetCompanyInfo}
                        >
                          discard
                        </Button>
                        <Button type="submit" variant="primary">
                          save changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ValidatedForm>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromotionEdit;
