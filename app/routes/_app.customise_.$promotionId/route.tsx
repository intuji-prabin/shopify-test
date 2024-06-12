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
import { withZod } from '@remix-validated-form/with-zod';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { ValidatedForm } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { FullScreen } from '~/components/icons/full-screen';
import AccordionCustom from '~/components/ui/accordionCustom';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import ColorPicker from '~/components/ui/color-picker';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from '~/components/ui/dialog';
import ImageUploadInput from '~/components/ui/image-upload-input';
import ImageEdit from '~/components/ui/imageEdit';
import Loader from '~/components/ui/loader';
import { displayToast } from '~/components/ui/toast';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { Routes } from '~/lib/constants/routes.constent';
import { getAccessToken, isAuthenticate, isImpersonating } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import PromotionNavigation from './promotion-navigation';
import { createPromotion, getPromotionById } from './promotion.server';
import { Input } from '~/components/ui/input';
import { NumberPlusOnly } from '~/lib/constants/regex.constant';
import FullPageLoading from '~/components/ui/fullPageLoading';
import { useConditionalRender } from '~/hooks/useAuthorization';

const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const EditFormValidator = z.object({
  logo: zfd.file(
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
  companyPhone: z
    .string()
    .min(1, { message: 'Company Phone is required' }),
  // .trim()
  // .refine(
  //   (value) => NumberPlusOnly.test(value),
  //   'Company Phone must only contain numbers and +',
  // ),
  company_name: z.string().min(1, { message: 'Company Name is required' }),
  company_email: z
    .string()
    .min(1, { message: 'Company Email is required' })
    .email({ message: 'Invalid email address' }),
  company_domain: z.string().min(1, { message: 'Company Website is required' }),
  company_fax: z.string().min(1, { message: 'Company Fax is required' }),
});

export const EditFormSchemaValidator = withZod(EditFormValidator);

export type EditFormType = z.infer<typeof EditFormValidator>;

export type EditFormFieldNameType = keyof EditFormType;

export async function action({ context, request, params }: ActionFunctionArgs) {
  const data = await request.formData();
  const { userDetails } = await getUserDetails(request);
  const customerId = userDetails?.id;
  let formData = Object.fromEntries(data);
  formData = { ...formData };
  const bannerId = params.promotionId as string;
  await createPromotion(context, request, formData, bannerId, customerId);
  return json({});
}

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);
  const customerId = userDetails?.id;
  const accessTocken = (await getAccessToken(context)) as string;
  const isImpersonatingCheck = await isImpersonating(request);
  const promotionId = params?.promotionId as string;
  const response = await getPromotionById(context, request, promotionId, customerId);
  if (response?.payload) {
    const results = response?.payload;
    return json({ accessTocken, isImpersonatingCheck, results, promotionId });
  }
}

const PromotionEdit = () => {
  const { accessTocken, isImpersonatingCheck, results, promotionId } = useLoaderData<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [image, setImage] = useState('');
  const [renderedImageWidth, setRenderedImageWidth] = useState();
  const [companyInfo, setCompanyInfo] = useState({
    companyLogo: results?.logo_url ?? DEFAULT_IMAGE.IMAGE,
    companyName: results?.company_name,
    companyEmail: results?.company_email,
    companyWebsite: results?.company_domain,
    companyFax: results?.company_fax,
    companyPhone: results?.phone,
    textColor: results?.color,
    bgColor: results?.background_color,
  });
  const [openAccordian, setOpenAccordian] = useState<
    'company-information' | 'text-color' | 'background' | ''
  >('company-information');

  const canvasRef = useRef<any>();
  const blobRef = useRef<any>();

  const handleChange = (field: string, value: string) => {
    setCompanyInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowUnsavedChanges(true);
  };

  const handleChangeFile = (field: string, value: string) => {
    setCompanyInfo({ ...companyInfo, [field]: value });
  };

  const resetCompanyInfo = () => {
    setCompanyInfo({
      companyLogo: results?.logo_url ?? DEFAULT_IMAGE.IMAGE,
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
      width: canvasRef.offsetWidth - 1,
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
        width: canvasRef.current.offsetWidth - 1,
      });
      formData.append('image', canvas.toDataURL());
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error has occured while creating the image');
      setIsLoading(false);
    }
    try {
      const response = await fetch(`/customise/${promotionId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: accessTocken,
          'Impersonate-Enable': isImpersonatingCheck,
        }
      });
      if (response.ok) {
        displayToast({
          message: 'Promotion Updated Successfully',
          type: 'success',
        });
        navigate(Routes.MY_PROMOTIONS);
      } else {
        throw new Error('Failed to update promotion');
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
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

  let imageName = companyInfo?.companyName;
  imageName = imageName && imageName.replace(/ /g, '_');
  const shouldRender = useConditionalRender('customize_promotions');
  const [validationError, setValidationError] = useState(false);
  console.log("validationError", validationError)
  return (
    shouldRender && (
      <div className="bg-grey-25">
        {isLoading && (
          <FullPageLoading description="The image is being processed. Please wait for few moments...." />
        )}
        <section className="container pt-8 pb-1">
          <div className="flex flex-wrap justify-between gap-4">
            <BackButton title="Customize Promotion" />
            <PromotionNavigation canvasRef={canvasRef} imageName={imageName} />
          </div>
        </section>
        <section className="container mt-1">
          <Breadcrumb>
            <BreadcrumbItem>Content Management</BreadcrumbItem>
            <BreadcrumbItem href={Routes.PROMOTIONS}>Promotions</BreadcrumbItem>
            <BreadcrumbItem className="text-grey-900">
              Customize Promotion
            </BreadcrumbItem>
          </Breadcrumb>
        </section>
        <section className="container">
          <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="order-2 lg:col-span-2 lg:order-1">
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
                    overlayBgColor={`${image && renderedImageWidth
                      ? 'bg-black/80'
                      : 'bg-white/80'
                      }`}
                    className={`bg-white/80 p-0 border-0 gap-y-0 promotion-view w-auto ${image && renderedImageWidth
                      ? 'max-w-[1280px]'
                      : 'h-full w-full max-w-[unset]'
                      }`}
                  >
                    {image && renderedImageWidth ? (
                      <div style={{ maxWidth: renderedImageWidth }}>
                        <img
                          alt="preview"
                          src={image}
                          className="h-auto max-h-[calc(100vh_-_100px)] mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <p className="text-lg">Loading...</p>
                        <Loader width="w-8" height="h-8" />
                      </div>
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
            <div className="relative order-1 px-6 py-1 bg-white lg:order-2">
              <ValidatedForm
                method="post"
                validator={EditFormSchemaValidator}
                encType="multipart/form-data"
                id="customize-form"
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
                  imageUrl={results?.logo_url ?? DEFAULT_IMAGE.IMAGE}
                  className="pb-4 promotion__edit"
                  unsavedChanges={unsavedChanges}
                  handleFile={(field: string, value: string) =>
                    handleChangeFile(field, value)
                  }
                />
                <div className="accordion__section">
                  <AccordionCustom
                    accordianLabel="company-information"
                    setOpenAccordian={setOpenAccordian}
                    isOpen={openAccordian === 'company-information'}
                    accordionTitle="Company Information"
                  >
                    <div className="space-y-6">
                      <div>
                        <Input
                          required
                          type="text"
                          name="company_name"
                          label="Company Name"
                          value={companyInfo.companyName}
                          className="w-full"
                          placeholder="company name"
                          setValidationError={setValidationError}
                          onInput={(e) =>
                            handleChange('companyName', e.currentTarget.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          required
                          type="text"
                          name="company_email"
                          value={companyInfo.companyEmail}
                          className="w-full"
                          label="Company Email"
                          placeholder="company email"
                          onInput={(e) =>
                            handleChange('companyEmail', e.currentTarget.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          required
                          type="text"
                          name="company_domain"
                          value={companyInfo.companyWebsite}
                          className="w-full"
                          label="Company Website"
                          placeholder="company website"
                          onInput={(e) =>
                            handleChange(
                              'companyWebsite',
                              e.currentTarget.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Input
                          required
                          type="text"
                          name="companyPhone"
                          label="Company Phone"
                          placeholder="company phone"
                          value={companyInfo.companyPhone || ''}
                          onInput={(e) =>
                            handleChange('companyPhone', e.currentTarget.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          required
                          type="text"
                          name="company_fax"
                          value={companyInfo.companyFax}
                          className="w-full"
                          placeholder="company fax"
                          label="Company Fax"
                          onInput={(e) =>
                            handleChange('companyFax', e.currentTarget.value)
                          }
                        />
                      </div>
                    </div>
                  </AccordionCustom>
                  <AccordionCustom
                    accordianLabel="text-color"
                    setOpenAccordian={setOpenAccordian}
                    isOpen={openAccordian === 'text-color'}
                    accordionTitle="Text Color"
                  >
                    <ColorPicker
                      name="color"
                      color={companyInfo.textColor}
                      onChange={(color) => handleChange('textColor', color)}
                    />
                  </AccordionCustom>
                  <AccordionCustom
                    accordianLabel="background"
                    setOpenAccordian={setOpenAccordian}
                    isOpen={openAccordian === 'background'}
                    accordionTitle="Background"
                  >
                    <ColorPicker
                      name="background_color"
                      color={companyInfo.bgColor}
                      onChange={(color) => handleChange('bgColor', color)}
                    />
                  </AccordionCustom>
                </div>
                {showUnsavedChanges && (
                  <div className="fixed inset-x-0 bottom-0 z-50 py-4 bg-primary-500">
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
    )
  );
};

export default PromotionEdit;

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="container pt-6">
        <div className="min-h-[400px] flex justify-center items-center ">
          <div className="flex flex-col items-center gap-2">
            <h3>Error has occured</h3>
            <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
