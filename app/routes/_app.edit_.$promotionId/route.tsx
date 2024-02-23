import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import {withZod} from '@remix-validated-form/with-zod';
import html2canvas from 'html2canvas';
import {useRef, useState} from 'react';
import {ValidatedForm} from 'remix-validated-form';
import {z} from 'zod';
import {zfd} from 'zod-form-data';
import {FullScreen} from '~/components/icons/full-screen';
import AccordionCustom from '~/components/ui/accordionCustom';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import ColorPicker from '~/components/ui/color-picker';
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog';
import ImageUploadInput from '~/components/ui/image-upload-input';
import ImageEdit from '~/components/ui/imageEdit';
import Loader from '~/components/ui/loader';
import {Separator} from '~/components/ui/separator';
import {displayToast} from '~/components/ui/toast';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {Routes} from '~/lib/constants/routes.constent';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getMyPromotionById, updatePromotion} from './edit-promotion.server';
import PromotionNavigation from '../_app.customise_.$promotionId/promotion-navigation';
import {BackButton} from '~/components/ui/back-button';
import { getUserDetails } from '~/lib/utils/user-session.server';

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

/**
 * @category Action Function
 * @param param0 request | params
 * @returns json
 */
export async function action({request, params}: ActionFunctionArgs) {
  const data = await request.formData();
  let formData = Object.fromEntries(data);
  formData = {...formData};
  const bannerId = params.promotionId as string;
  await updatePromotion(formData, bannerId);
  return json({});
}

export async function loader({params, context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  try {
    const {userDetails} = await getUserDetails(request);
    const customerId    = userDetails?.id.replace("gid://shopify/Customer/", "")
    const promotionId = params?.promotionId as string;
    const response = await getMyPromotionById(promotionId);
    
    if (response?.payload) {
      const results = response?.payload;
      return json({results, promotionId});
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('err', error);
      return (
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1>Oops</h1>
            <p>Something went wrong</p>
          </div>
        </div>
      );
    }
    return <h1>Unknown Error</h1>;
  }
}

const PromotionEdit = ({ defaultValues }: EditFormProps) => {
  const { results, promotionId } = useLoaderData<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [image, setImage] = useState('');
  const [renderedImageWidth, setRenderedImageWidth] = useState();
  const [companyInfo, setCompanyInfo] = useState({
    companyLogo: DEFAULT_IMAGE.IMAGE,
    companyName: results?.company_name,
    companyEmail: results?.company_email,
    companyWebsite: results?.company_domain,
    companyFax: results?.company_fax,
    companyPhone: results?.phone,
    textColor: results?.color,
    bgColor: results?.background_color,
  });

  const canvasRef = useRef<any>();
  const blobRef = useRef<any>();

  const handleChange = (field: string, value: string) => {
    setCompanyInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowUnsavedChanges(true);
  };

  const resetCompanyInfo = () => {
    setCompanyInfo({
      companyLogo: DEFAULT_IMAGE.IMAGE,
      companyName: results?.company_name,
      companyEmail: results?.company_email,
      companyWebsite: results?.company_domain,
      companyFax: results?.company_fax,
      companyPhone: results?.phone,
      textColor: results?.color,
      bgColor: results?.background_color,
    });
    const imagePreviews = document.querySelectorAll(
      '.image-preview',
    ) as unknown as HTMLImageElement[];
    imagePreviews.forEach((imagePreview) => {
      imagePreview.setAttribute(
        'src',
        `${results?.logo_url ?? DEFAULT_IMAGE.IMAGE}`,
      );
    });
    setShowUnsavedChanges(false);
  };

  const htmlProcessPop = (canvasRef: any) => {
    setImage('');
    html2canvas(canvasRef, {
      allowTaint: true,
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
  const navigate = useNavigate();

  const handleClick = async () => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append('company_name', companyInfo?.companyName);
    formData.append('company_email', companyInfo?.companyEmail);
    formData.append('company_fax', companyInfo?.companyFax);
    formData.append('phone', companyInfo?.companyPhone);
    formData.append('company_domain', companyInfo?.companyWebsite);
    formData.append('color', companyInfo?.textColor);
    formData.append('background_color', companyInfo?.bgColor);
    formData.append('logo', companyInfo?.companyLogo);

    try {
      const canvas = await html2canvas(canvasRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
      });
      formData.append("image", canvas.toDataURL());
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error has occured while creating the image");
    }

    try {
      const response = await fetch(`/edit/${promotionId}`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        displayToast({ message: "Promotion Edited Successfully", type: "success" });
        navigate(Routes.MY_PROMOTIONS);
      } else {
        throw new Error('Failed to edit promotion');
      }
    } catch (error) {
      console.error('Error editing promotion:', error);
      setIsLoading(false);
      return (
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1>Oops</h1>
            <p>Something went wrong</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-grey-25">
      {isLoading && (
        <div className="absolute inset-0 z-[9999]">
          <div className="flex h-full bg-white/95">
            <div className="fixed flex flex-wrap items-center justify-center -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 gap-x-4 gap-y-2">
              <p className="text-lg">
                The image is being processed. Please wait for few moments ....
              </p>
              <Loader width="w-8" height="h-8" />
            </div>
          </div>
        </div>
      )}
      <section className="container pt-8 pb-1">
        <div className="flex flex-wrap justify-between gap-4">
          <BackButton title="Edit Promotion" />
          <PromotionNavigation canvasRef={canvasRef} />
        </div>
      </section>
      <section className="container mt-1">
        <Breadcrumb>
          <BreadcrumbItem>Content Management</BreadcrumbItem>
          <BreadcrumbItem href={Routes.MY_PROMOTIONS}>
            My Promotions
          </BreadcrumbItem>
          <BreadcrumbItem className="text-grey-900">
            Customize Promotion
          </BreadcrumbItem>
        </Breadcrumb>
      </section>
      <section className="container">
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
                  className={`max-w-4xl ${
                    !image && 'flex items-center justify-center'
                  }`}
                >
                  {image && renderedImageWidth ? (
                    <img
                      src={image}
                      alt="popupView"
                      className="h-auto max-h-[calc(100vh_-_150px)] mx-auto"
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
              src={results?.image_url}
              alt="previewHidden"
              className="hidden"
              onLoad={(event: any) =>
                setRenderedImageWidth(event?.target?.width)
              }
            />
            <ImageEdit
              alt={'preview'}
              imgSrc={results?.image_url}
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
              id="promotion-form"
              data-cy="customize-promotion"
              onSubmit={(_, event) => {
                event.preventDefault();
                handleClick();
              }}
            >
              <input
                ref={blobRef}
                type="text"
                name="image"
                className="hidden"
              />
              <h5 className="py-4">Company Logo</h5>
              <ImageUploadInput
                name="logo"
                unsavedChanges={unsavedChanges}
                imageUrl={defaultValues?.companyLogo}
                className="pb-4 promotion__edit"
                defaultImage={DEFAULT_IMAGE.IMAGE}
              />
              <div className="accordion__section">
                <AccordionCustom accordionTitle="Company Information">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="company_name">Company Name</label>
                      <input
                        type="text"
                        name="company_name"
                        value={companyInfo.companyName}
                        className="w-full"
                        placeholder="company name"
                        onInput={(e) =>
                          handleChange('companyName', e.currentTarget.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="company_email">Company Email</label>
                      <input
                        type="text"
                        name="company_email"
                        value={companyInfo.companyEmail}
                        className="w-full"
                        placeholder="company email"
                        onInput={(e) =>
                          handleChange('companyEmail', e.currentTarget.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="company_domain">Company Website</label>
                      <input
                        type="text"
                        name="company_domain"
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
                      <label htmlFor="company_fax">Company Fax</label>
                      <input
                        type="tel"
                        name="company_fax"
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
                    name="color"
                    color={companyInfo.textColor}
                    onChange={(color) => handleChange('textColor', color)}
                  />
                </AccordionCustom>
                <AccordionCustom accordionTitle="Background">
                  <ColorPicker
                    name="background_color"
                    color={companyInfo.bgColor}
                    onChange={(color) => handleChange('bgColor', color)}
                  />
                </AccordionCustom>
              </div>
              {showUnsavedChanges && (
                <div className="fixed inset-x-0 bottom-0 py-4 bg-primary-500">
                  <div className="container">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h5 className="text-white">Unsaved changes</h5>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-white border-white"
                          onClick={resetCompanyInfo}
                        >
                          discard
                        </Button>
                        <Button
                          type="submit"
                          variant="secondary"
                          name="action"
                          disabled={isLoading}
                        >
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

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <section className="container">
        <h1 className="text-center uppercase">No data found</h1>
      </section>
    );
  }
}
